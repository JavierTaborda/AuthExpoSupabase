import SplashScreen from "@/components/SplashScreen";
import { useAuthProviderStore } from "@/stores/useAuthProviderStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { hydrate } = useThemeStore();
  const { showSplash, initializeApp } = useAuthProviderStore();
  
  const splashOpacity = useRef(new Animated.Value(1)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      await hydrate();
      await initializeApp();
    };
    init();
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
        <Animated.View style={[styles.absoluteFill, { opacity: splashOpacity }]}>
          <SplashScreen />
        </Animated.View>
      )}
      {!showSplash && (
        <Animated.View style={[styles.absoluteFill, { opacity: contentOpacity }]}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
});