import { supabase } from "@/lib/supabase";
import { setBiometricEnabled } from "@/utils/biometricFlag";
import { setSessionStatus } from "@/utils/sessionStatus";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { Platform } from "react-native";
import { create } from "zustand";

// Store interface
interface AuthStore {
  session: Session | null; // Supabase session
  loading: boolean; // Auth loading status
  manualLogin: boolean; // Flag to track manual login (for biometric logic)

  setSession: (session: Session | null) => void; // Set user session
  setManualLogin: (value: boolean) => void; // Set manualLogin flag

  signIn: (email: string, password: string) => Promise<{ error: Error | null }>; // Sign in with email/password
  sendCodeOTP: (
    value: string,
    method: "email" | "phone",
    redirectUri?: string
  ) => Promise<{ error: Error | null }>; // Send OTP
  signInOTP: (
    method: string,
    token: string,
    type: "email" | "sms"
  ) => Promise<{ error: Error | null }>; // Verify OTP login
  restoreSessionWithBiometrics: () => Promise<{ error: Error | null }>; // Restore session using biometrics
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>; // Register new user
  signOut: () => Promise<void>; // Full sign out
  signOutSoft: () => Promise<void>; // Soft sign out (used when biometrics fail)

  initializeAuth: () => Promise<void>; // Initialize session from storage
}

// Zustand store definition
export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  loading: true,
  manualLogin: false,

  setSession: (session) => set({ session }), // Save session
  setManualLogin: (value: boolean) => set({ manualLogin: value }), // Save login method

  // Sign in with password
  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      await setSessionStatus("active");
      await setBiometricEnabled(true);
      set({ session: data.session, loading: false, manualLogin: true });
    } else {
      set({ loading: false });
    }

    return { error };
  },

  // Send OTP to email or phone
  sendCodeOTP: async (value, method, redirectUri?) => {
    let response;
    if (method === "email") {
      response = await supabase.auth.signInWithOtp({
        email: value,
        options: { emailRedirectTo: redirectUri },
      });
    } else {
      response = await supabase.auth.signInWithOtp({ phone: value });
    }

    return { error: response.error };
  },

  // Sign in using OTP code
  signInOTP: async (method, token, type) => {
    set({ loading: true });

    const payload =
      type === "sms"
        ? { phone: method, token, type }
        : { email: method, token, type };

    const { data, error } = await supabase.auth.verifyOtp(payload);

    if (data?.session?.access_token && data?.session?.refresh_token) {
      await setSessionStatus("active");
      await setBiometricEnabled(true);
      set({ session: data.session });
    }

    set({ loading: false, manualLogin: true });
    return { error };
  },

  // Restore user session using biometrics
  restoreSessionWithBiometrics: async () => {
    const isBiometricEnabled =
      (await AsyncStorage.getItem("biometricEnabled")) === "true";
    if (!isBiometricEnabled) {
      const platformMsg =
        Platform.OS === "ios"
          ? "Face ID o Touch ID no están disponibles."
          : "La autenticación biométrica no está disponible en este dispositivo.";

      return { error: new Error(platformMsg) };
    }

    try {
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

  // Register a new user
  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error };
  },

  // Log out fully (clears session and biometric flags)
  signOut: async () => {
    await supabase.auth.signOut();
    await AsyncStorage.setItem("biometricEnabled", "false");
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(false);
    set({ session: null, loading: false });
    router.replace("/(auth)/sign-in");
  },

  // Soft log out (used if biometrics fail, keeps biometric enabled)
  signOutSoft: async () => {
    set({ session: null });
    await AsyncStorage.setItem("biometricEnabled", "true");
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(true);
    router.replace("/(auth)/sign-in");
  },

  // Load session from storage on app startup
  initializeAuth: async () => {
    set({ loading: true });

    const sessionStatus = await AsyncStorage.getItem("sessionStatus");
 
    if (sessionStatus !== "active") {
      set({ session: null, loading: false });
      return;
    }

    try {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session || error) {
        set({ session: null, loading: false });
        return;
      }
      
      set({ session: data.session, loading: false })
    } catch (error) {
      set({ session: null, loading: false });
    }
  },
}));
