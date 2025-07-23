import { AuthProvider } from "@/providers/AuthProvider";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";


export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <StatusBar style="auto" />

            <Slot />
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </>
  );
}
