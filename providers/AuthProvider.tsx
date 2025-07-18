import { supabase } from '@/lib/supabase';
import { getAuthTokens, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';

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

        await signOut();
        return

      }

      try {

        const success = await authenticateWithBiometrics();
        if (!success) {
          Alert.alert('Autenticación fallida', 'No pudimos validar tu identidad.');
          throw new Error('Biometría fallida');
        }

        const token = await getAuthTokens();
        const { data, error } = await supabase.auth.setSession({
          access_token: token.accessToken!,
          refresh_token: token.refreshToken ?? '',
        });

        if (error || !data?.session || !data?.user) {
          Alert.alert('Sesión inválida', 'Tu sesión ha expirado. Inicia sesión nuevamente.');
          await signOut();
        }

      } catch (err) {
        Alert.alert('Error de autenticación', 'Hubo un problema durante la verificación.');
        await signOut();
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