import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
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
export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,

  setSession: (session) => set({ session }),

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
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