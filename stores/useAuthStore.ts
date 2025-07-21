import { supabase } from "@/lib/supabase";
import { setBiometricEnabled } from "@/utils/biometricFlag";
import { setSessionStatus } from '@/utils/sessionStatus';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { create } from "zustand";

interface AuthStore {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  sendCodeOTP: (value: string, method: 'email' | 'phone', redirectUri?: string) => Promise<{ error: Error | null }>;
  signInOTP: (method: string, token: string, type: 'email' | 'sms') => Promise<{ error: Error | null }>;
  restoreSessionWithBiometrics: () => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  signOutSoft: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}


// This file manages the authentication state using Zustand and Supabase.


export const useAuthStore = create<AuthStore>((set, get) => ({
  session: null,
  loading: true,


  setSession: (session) => set({ session }),

  signIn: async (email, password) => {
    set({ loading: true });
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data.session) {
      await setSessionStatus("active");
      await setBiometricEnabled(true);
      set({ session: data.session, loading: false });
    } else {
      set({ loading: false });
    }

    return { error };
  },

  sendCodeOTP: async (
    value,
    method,
    redirectUri?,
  ) => {
    let response;

    if (method === 'email') {
      response = await supabase.auth.signInWithOtp({
        email: value,
        options: {
          emailRedirectTo: redirectUri,
        },
      });
    } else {
      response = await supabase.auth.signInWithOtp({ phone: value });
    }

    const { error } = response;
    return { error };
  },

  signInOTP: async (method, token, type) => {
    set({ loading: true });

    const payload = type === 'sms'
      ? { phone: method, token, type }
      : { email: method, token, type };

    const { data, error } = await supabase.auth.verifyOtp(payload);

    if (data?.session?.access_token && data?.session?.refresh_token) {
      await setSessionStatus("active");
      await setBiometricEnabled(true);
      set({ session: data.session });
    }

    set({ loading: false });
    return { error };
  },

  restoreSessionWithBiometrics: async () => {
    set({ loading: true });

    const biometricEnabled = await AsyncStorage.getItem("biometricEnabled");
    if (biometricEnabled !== "true") {
      set({ loading: false });
      return { error: new Error("Biometría no habilitada.") };
    }

    try {
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        set({ session: data.session, loading: false });
        await setSessionStatus("active");
        await setBiometricEnabled(true);
        return { error: null };
      } else {
        set({ loading: false });
        return { error: new Error("No se pudo restaurar la sesión.") };
      }
    } catch (error) {
      set({ loading: false });
      return { error: error as Error };
    }
  },


  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await AsyncStorage.setItem("biometricEnabled", "false");
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(false);
    set({ session: null, loading: false });
    router.replace("/(auth)/sign-in");
  },
  signOutSoft: async () => {
    set({ session: null });
    await AsyncStorage.setItem("biometricEnabled", "true");
    await setSessionStatus("loggedOut");
    await setBiometricEnabled(true);
    router.replace("/(auth)/sign-in");
  },


  initializeAuth: async () => {
    set({ loading: true });

    const sessionStatus = await AsyncStorage.getItem("sessionStatus");
    if (sessionStatus !== "active") {
      set({ session: null, loading: false });
      return;
    }

    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!session || error) {
        set({ session: null, loading: false });
        return;
      }

      set({ session, loading: false });

    } catch (error) {
      set({ session: null, loading: false });
    }
  }


}));
