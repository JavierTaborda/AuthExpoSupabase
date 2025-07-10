import { supabase } from '@/lib/supabase';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';

import { router } from 'expo-router';
import { useEffect } from 'react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthStore();

  // useEffect(() => {
  //   if (!loading && !session) {
  //     router.replace('/(auth)/sign-in');
  //   }
  // }, [session, loading]);


useEffect(() => {
  const verifyAuth = async () => {
    if (!loading && !session) {
      const success = await authenticateWithBiometrics();
      if (success) {
        const token = await getToken();
        if (token) {
          const { data } = await supabase.auth.getUser(); 
          if (!data?.user) {
            router.replace('/(auth)/sign-in');
          }
        } else {
          router.replace('/(auth)/sign-in');
        }
      } else {
        router.replace('/(auth)/sign-in');
      }
    }
  };

  verifyAuth();
}, [loading]);


  if (loading) return null;

  return <>{children}</>;
}