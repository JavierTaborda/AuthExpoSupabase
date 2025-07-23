import SplashScreen from "@/components/SplashScreen";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { authenticateWithBiometrics } from "@/utils/biometricAuth";
import { getSessionStatus } from "@/utils/sessionStatus";
import { useEffect, useRef, useState } from "react";
import { Alert, Animated, StyleSheet, View } from "react-native";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { session, loading, signOutSoft, manualLogin, setManualLogin } =
    useAuthStore();
  const { hydrate, theme } = useThemeStore();

  const hasAuthenticated = useRef(false);
  const [showSplash, setShowSplash] = useState(true);

  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const initializeApp = async () => {
      await hydrate();
      await useAuthStore.getState().initializeAuth();
  

      if (!session) {
        setShowSplash(false);
        await signOutSoft();
        return;
      }

      if (session && !manualLogin && !hasAuthenticated.current) {
        const login = await getSessionStatus();

        if (login === "active") {
          const success = await authenticateWithBiometrics();

          if (!success) {
            Alert.alert(
              "Autenticación fallida",
              "No pudimos validar tu identidad."
            );
            setShowSplash(false);
            await signOutSoft();
            return;
          } else {
            hasAuthenticated.current = true;
          }
        }
      }

      setManualLogin(false);
      setShowSplash(false);
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (!showSplash) {
      Animated.sequence([
        Animated.timing(splashOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showSplash]);

  return (
    <View className="flex-1 bg-background dark:bg-dark-background">
      {showSplash && (
        <Animated.View
          style={[styles.absoluteFill, { opacity: splashOpacity }]}
        >
          <SplashScreen />
        </Animated.View>
      )}
      {!showSplash && (
        <Animated.View
          style={[styles.absoluteFill, { opacity: contentOpacity }]}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: { ...StyleSheet.absoluteFillObject },
});
