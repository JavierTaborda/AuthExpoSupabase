import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { authenticateWithBiometrics } from "@/utils/biometricAuth";
import { getSessionStatus } from "@/utils/sessionStatus";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export function useInitialAppLoad() {
  const { hydrate } = useThemeStore();
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await hydrate();
      await authStore.initializeAuth();

      try {
        if (authStore.session) {
          const login = await getSessionStatus();
          if (login === "active") {
            const success = await authenticateWithBiometrics();
            if (!success) {
              Alert.alert("Autenticación fallida", "No pudimos validar tu identidad.");
              throw new Error("Biometría fallida");
            }
          }
        } else {
          router.replace("/(auth)/sign-in");
        }
      } catch (err) {
        Alert.alert("Error de autenticación", "No se pudo restaurar la sesión.");
        await authStore.signOutSoft();
        router.replace("/(auth)/sign-in");
      }

      setLoading(false);
    };

    initialize();
  }, []);

  return loading;
}
