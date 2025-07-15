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
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  initializeAuth: () => void;
}

// This file manages the authentication state using Zustand and Supabase.

//Expo SecureStore is used to securely store the authentication token.
export async function saveToken(token: string) {
  await SecureStore.setItemAsync('auth_token', token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync('auth_token');
}


export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (data?.session?.access_token) {

      Alert.alert(
        "¿Activar biometría?",
        "¿Quieres usar Face ID o huella digital para futuros ingresos?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: async () => {
              await SecureStore.deleteItemAsync('auth_token');
            },
          },
          {
            text: "Sí",
            onPress: async () => {
              await saveToken(data.session!.access_token);
            },
          },
        ]
      );

      set({ session: data.session, loading: false });
    }

    set({ loading: false });
    return { error };
  },

  signUp: async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return { error };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    await SecureStore.deleteItemAsync('auth_token');
    router.replace('/(auth)/sign-in');
    set({ session: null, loading: false });
  },

  initializeAuth: () => {
    set({ loading: true });
    supabase.auth.getSession().then(({ data: { session } }) => {
      set({ session, loading: false });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
    return () => subscription.unsubscribe();
  },

}));