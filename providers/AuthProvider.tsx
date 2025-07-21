
import SplashScreen from '@/components/SplashScreen';
import { useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';
import { getSessionStatus } from '@/utils/sessionStatus';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, signOut, signOutSoft } = useAuthStore();
  const hasChecked = useRef(false);
  //TODO: Hide <Slot> ehen is render 

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
      
      try {
        if (!session) {
          router.replace("/(auth)/sign-in");
          return;
        }

        const login = await getSessionStatus()
        if (login === 'active') {
          const success = await authenticateWithBiometrics();
          if (!success) {
            Alert.alert("Autenticación fallida", "No pudimos validar tu identidad.");
            throw new Error("Biometría fallida");
          }
        }

      } catch (error) {
        Alert.alert("Error de autenticación", "No se pudo restaurar la sesión.");
        await signOutSoft();
      }
    };
    if (!loading) verifyAuth();
  }, [loading]);

  if (loading) {
    return (
      <SplashScreen/>
    );
  }

  return <>{children}</>;
}