import { AuthProvider } from "@/providers/AuthProvider";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

  // const { theme, hydrate } = useThemeStore()
  // const [ready, setReady] = useState(false)

  // useEffect(() => {
  //   const init = async () => {
  //     await hydrate();
  //     await useAuthStore.getState().initializeAuth();

  //     setReady(true);
  //   };

  //   init();
  // }, [])


  // if (!ready) {
  //   return (
  //     <SplashScreen />
  //   );
  // }

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
