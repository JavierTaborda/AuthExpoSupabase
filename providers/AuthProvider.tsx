import { supabase } from '@/lib/supabase';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';

import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Alert, View } from 'react-native';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuthStore();

  const RedirectToSignIn = () => {

    router.replace('/(auth)/sign-in');
  }

  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading && !session) {
        RedirectToSignIn();
      }


      if (!loading && session) {
        const success = await authenticateWithBiometrics();
        if (success) {
          const token = await getToken();
          if (token) {
            const { data } = await supabase.auth.getUser();

            if (!data?.user) {
              RedirectToSignIn();
              signOut();
              Alert.alert("Sesión expirada", "Por favor inicie sesión nuevamente.");
            }

          } else {
            RedirectToSignIn();
          }
        } else {
          RedirectToSignIn();
        }
      }
    };

    verifyAuth();
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