import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { create } from "zustand";

interface AuthStore {
  session: Session | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  sendCodeOTP: (value: string, method: 'email' | 'phone', redirectUri?: string) => Promise<{ error: Error | null }>;
  signInOTP: (method: string, token: string, type: 'email' | 'sms') => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}


// This file manages the authentication state using Zustand and Supabase.

//Expo SecureStore is used to securely store the authentication token.
export async function saveAuthTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync("auth_access_token", accessToken);
  await SecureStore.setItemAsync("auth_refresh_token", refreshToken);
}

export async function getAuthTokens() {
  const accessToken = await SecureStore.getItemAsync("auth_access_token");
  const refreshToken = await SecureStore.getItemAsync("auth_refresh_token");
  return { accessToken, refreshToken };
}

export async function deleteAuthTokens() {
  await SecureStore.deleteItemAsync("auth_access_token");
  await SecureStore.deleteItemAsync("auth_refresh_token");
}

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

    if (data?.session?.access_token) {

      await saveAuthTokens(
        data.session!.access_token,
        data.session!.refresh_token!
      );

      set({ session: data.session, loading: false });
      return { error };
    }

    set({ loading: false });
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
      await saveAuthTokens(data.session.access_token, data.session.refresh_token);
      set({ session: data.session });
    }

    set({ loading: false });
    return { error };
  },

  signUp: async (email, password) => {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();

    //await deleteAuthTokens();
    set({ session: null, loading: false });
    router.replace("/(auth)/sign-in");
  },

  initializeAuth: async () => {
    set({ loading: true });


    try {
      // try get active session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        set({ session, loading: false });
        return;
      }

      // If not exits, use SecureStore to try get tokens
      const { accessToken, refreshToken } = await getAuthTokens();

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error || !data?.session) {
          await deleteAuthTokens();
          set({ session: null, loading: false });
          return;
        }

        set({ session: data.session, loading: false });
      } else {

        set({ session: null, loading: false });
      }
    } catch (e) {
      await deleteAuthTokens();
      set({ session: null, loading: false });
      Alert.alert("Error", "No se pudo restaurar la sesión.");
    }

  },
}));
