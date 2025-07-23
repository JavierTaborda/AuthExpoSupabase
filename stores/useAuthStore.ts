import { supabase } from "@/lib/supabase";
import { getBiometricEnabled, setBiometricEnabled } from "@/utils/biometricFlag";
import { getSessionStatus, setSessionStatus } from "@/utils/sessionStatus";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Platform } from "react-native";
import { create } from "zustand";

interface AuthStore {
  session: Session | null; // Supabase session
  loading: boolean; // Auth loading status
  manualLogin: boolean; // Flag to track manual login (for biometric logic)

  setSession: (session: Session | null) => void; // Set user session
  setManualLogin: (value: boolean) => void; // Set manualLogin flag

  signIn: (email: string, password: string) => Promise<{ error: Error | null }>; // Sign in with email/password
  sendCodeOTP: (value: string, method: "email" | "phone", redirectUri?: string) => Promise<{ error: Error | null }>; // Send OTP
  signInOTP: (method: string, token: string, type: "email" | "sms") => Promise<{ error: Error | null }>; // Verify OTP login
  restoreSessionWithBiometrics: () => Promise<{ error: Error | null }>; // Restore session using biometrics
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>; // Register new user
  signOut: () => Promise<void>; // Full sign out
  signOutSoft: () => Promise<void>; // Soft sign out (used when biometrics fail)

  initializeAuth: () => Promise<void>; // Initialize session from storage
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  loading: true,
  manualLogin: false,

  setSession: (session) => set({ session }),
  setManualLogin: (value) => set({ manualLogin: value }),

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (data.session) {
        await setSessionStatus("active");
        await setBiometricEnabled(true);
        set({ session: data.session, manualLogin: true });
      }
      return { error };
    } catch (err) {
      return { error: err as Error };
    } finally {
      set({ loading: false });
    }
  },

  sendCodeOTP: async (value, method, redirectUri) => {
    try {
      const response =
        method === "email"
          ? await supabase.auth.signInWithOtp({
            email: value,
            options: { emailRedirectTo: redirectUri },
          })
          : await supabase.auth.signInWithOtp({ phone: value });

      return { error: response.error };
    } catch (err) {
      return { error: err as Error };
    }
  },

  signInOTP: async (method, token, type) => {
    set({ loading: true });
    try {
      const payload =
        type === "sms"
          ? { phone: method, token, type }
          : { email: method, token, type };

      const { data, error } = await supabase.auth.verifyOtp(payload);

      if (data?.session?.access_token && data?.session?.refresh_token) {
        await setSessionStatus("active");
        await setBiometricEnabled(true);
        set({ session: data.session, manualLogin: true });
      }

      return { error };
    } catch (err) {
      return { error: err as Error };
    } finally {
      set({ loading: false });
    }
  },

  restoreSessionWithBiometrics: async () => {
    try {
      const isBiometricEnabled = await getBiometricEnabled()

      if (!isBiometricEnabled) {
        const platformMsg =
          Platform.OS === "ios"
            ? "Face ID o Touch ID no están disponibles."
            : "La autenticación biométrica no está disponible en este dispositivo.";

        return { error: new Error(platformMsg) };
      }


      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        set({ session: data.session, loading: false, manualLogin: true });
        await setSessionStatus("active");
        await setBiometricEnabled(true);

        return { error: null };
      } else {
        set({ session: null, loading: false });
        return { error: new Error("No se pudo reestablecer la sesión.") };
      }
    } catch (error) {
      set({ loading: false });
      return { error: error as Error };
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      return { error };
    } catch (err) {
      return { error: err as Error };
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(false);
    set({ session: null, loading: false });
    router.replace("/(auth)/sign-in");
  },

  signOutSoft: async () => {
    set({ session: null });
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(true);
    router.replace("/(auth)/sign-in");
  },

  initializeAuth: async () => {
    set({ loading: true });

    const status = await getSessionStatus();
    if (status !== "active") {
      set({ session: null });
      return set({ loading: false });
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session || error) {
        set({ session: null });
      } else {
        set({ session: data.session });
      }
    } catch (err) {
      set({ session: null });
    } finally {
      set({ loading: false });
    }
  },
}));