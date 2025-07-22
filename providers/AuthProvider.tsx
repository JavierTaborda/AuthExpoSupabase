import SplashScreen from '@/components/SplashScreen';
import { useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';
import { getSessionStatus } from '@/utils/sessionStatus';
import { useEffect, useRef } from 'react';
import { Alert } from 'react-native';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    session,
    loading,
    signOutSoft,
    manualLogin,
    setManualLogin,
  } = useAuthStore();
//TODO: show loading 
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    const checkBiometricsOnStartup = async () => {
      if (!session)
      {
        await signOutSoft();
      }
      if (session && !manualLogin && !hasAuthenticated.current) {
        const login = await getSessionStatus();
        if (login === 'active') {
          const success = await authenticateWithBiometrics();
          if (!success) {
            Alert.alert("Autenticación fallida", "No pudimos validar tu identidad.");
            await signOutSoft();
          } else {
            hasAuthenticated.current = true;
          }
        }
      }

      setManualLogin(false);
    };

    checkBiometricsOnStartup();
  }, [session]);

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}