import { useThemeStore } from "@/stores/useThemeStore";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  const { theme, hydrate } = useThemeStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    hydrate().finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <>
      <SafeAreaProvider>

        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Slot />
      </SafeAreaProvider>

    </>
  )
}
