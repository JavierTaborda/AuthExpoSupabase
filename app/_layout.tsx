import { AuthProvider } from "@/providers/AuthProvider";
import { useAuthStore } from "@/stores/useAuthStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { theme, hydrate } = useThemeStore()
  const { initializeAuth } = useAuthStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      await hydrate();
      initializeAuth();
      setReady(true);
    };

    init();
  }, [])

  if (!ready) return null

  return (
    <>

      <SafeAreaProvider >
        <StatusBar style="auto" />
        <AuthProvider>
          {/* <SafeAreaView style={{ flex: 1 }} className="flex-1 bg-background dark:bg-dark-background"> */}
            <Slot />
          {/* </SafeAreaView> */}
        </AuthProvider>
      </SafeAreaProvider>
    </>
  )
}



