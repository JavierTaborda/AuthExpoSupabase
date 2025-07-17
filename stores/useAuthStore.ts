import { supabase } from "@/lib/supabase";
import { authenticateWithBiometrics } from "@/utils/biometricAuth";
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
  initializeAuth: () => Promise<void>;
}


// This file manages the authentication state using Zustand and Supabase.

//Expo SecureStore is used to securely store the authentication token.
export async function saveToken(token: string) {
  await SecureStore.setItemAsync("auth_token", token);
}

export async function getToken(): Promise<string | null> {
  return await SecureStore.getItemAsync("auth_token");
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
      Alert.alert(
        "¿Activar biometría?",
        "¿Quieres usar Face ID o huella digital para futuros ingresos?",
        [
          {
            text: "No",
            style: "cancel",
            onPress: async () => {
              await SecureStore.deleteItemAsync("auth_token");
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
      return { error };
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
    await SecureStore.deleteItemAsync("auth_token");
    set({ session: null, loading: false });
    router.replace("/(auth)/sign-in");
  },

  initializeAuth: async () => {
    set({ loading: true });

    // try get active session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      set({ session, loading: false });
      return;
    }

    // No  session, try biometric
    const token = await getToken();

    if (token) {
      try {
       
        await authenticateWithBiometrics();

        // restore session 
        const { data, error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: "", 
        });

        if (error || !data?.session) {
          await SecureStore.deleteItemAsync("auth_token");
          set({ session: null, loading: false });
          return;
        }

        set({ session: data.session, loading: false });
      } catch (error) {
        
        await SecureStore.deleteItemAsync("auth_token");
        set({ session: null, loading: false });
      }
    } else {
      set({ session: null, loading: false });
    }
  },
}));
