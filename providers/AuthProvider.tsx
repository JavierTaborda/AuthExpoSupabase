import { supabase } from '@/lib/supabase';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';

import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut } = useAuthStore();

  // useEffect(() => {
  //   if (!loading && !session) {
  //     router.replace('/(auth)/sign-in');
  //   }
  // }, [session, loading]);


  useEffect(() => {
    const verifyAuth = async () => {
      if (!loading && !session) {
        signOut();
        router.replace('/(auth)/sign-in');
      }


      if (!loading && session) {
        const success = await authenticateWithBiometrics();
        if (success) {
          const token = await getToken();
          if (token) {
            const { data } = await supabase.auth.getUser();

            if (!data?.user) {
              router.replace('/(auth)/sign-in');
            }
            else {
              router.replace('../(main)/(home)/');
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


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-dark-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}