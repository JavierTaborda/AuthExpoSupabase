import { useThemeStore } from "@/stores/useThemeStore";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {

 const { theme } = useThemeStore()

  useEffect(() => {
    colorScheme.set(theme)
  }, [theme])

   return (
    <>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <Slot />
    </>
  )
}
