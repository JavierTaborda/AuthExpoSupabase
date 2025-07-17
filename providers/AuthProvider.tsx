import { supabase } from '@/lib/supabase';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';

import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuthStore();
  const hasChecked = useRef(false);

  // clean the status when logout
  useEffect(() => {
    if (!loading && !session) {
      hasChecked.current = false;
    }
  }, [session, loading]);

  // wait for yhe check of session 
  useEffect(() => {
    const verifyAuth = async () => {
      if (loading || hasChecked.current) return;
      hasChecked.current = true;

      if (!session) {
        return router.replace('/(auth)/sign-in');
      }

      try {
        const success = await authenticateWithBiometrics();
        if (!success) throw new Error('Autenticación fallida');

        const token = await getToken();
        const { data } = await supabase.auth.getUser();

        if (!data?.user || !token) {
          await signOut();
          Alert.alert('Sesión expirada', 'Inicia sesión nuevamente.');
          return router.replace('/(auth)/sign-in');
        }
      } catch (err) {
        await signOut();
        router.replace('/(auth)/sign-in');
      }
    };

    if (!loading) verifyAuth(); 
  }, [loading]);


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}
