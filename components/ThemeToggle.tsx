import { useThemeStore } from "@/stores/useThemeStore";
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef } from "react";
import { Animated, Platform, StyleSheet, Switch, Text, View } from "react-native";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
   
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.99,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(pulseAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      })
    ]).start();

  
    Animated.timing(iconRotate, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [theme]);

  const iconSpin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          transform: [{ scale: pulseAnim }],
          backgroundColor: isDark ? "rgba(31, 41, 55, 0.8)" : "rgba(229, 231, 235, 0.8)" 
        }
      ]}
    >
      <View className="flex-row items-center gap-3">
        <Animated.View style={{ transform: [{ rotate: iconSpin }] }}>
          <MaterialIcons
            name={isDark ? "mode-night" : "wb-sunny"}
            size={20}
            color={isDark ? "#FACC15" : "#3B82F6"}
          />
        </Animated.View>
        <Text className="text-base font-medium" style={{ color: isDark ? "#F3F4F6" : "#0F172A" }}>
          {isDark ? "Modo oscuro" : "Modo claro"}
        </Text>
      </View>

      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? "#FACC15" : "#FFFFFF"}
        trackColor={{
          false: Platform.select({ 
            ios: "rgba(161, 161, 170, 0.5)", 
            android: "#A1A1AA" 
          }),
          true: Platform.select({ 
            ios: "rgba(59, 130, 246, 0.5)", 
            android: "#3B82F6" 
          }),
        }}
        ios_backgroundColor="rgba(161, 161, 170, 0.5)"
       
      />
    </Animated.View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: '80%',
    minHeight: 48, 
    marginVertical: 4,
  },
  
});