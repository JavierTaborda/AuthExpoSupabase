import { useThemeStore } from "@/stores/useThemeStore";
import { Switch, Text, View } from "react-native";


export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === "dark"

  return (
    <View className="flex-row items-center gap-4 px-4 py-2 rounded bg-zinc-200 dark:bg-zinc-800">
      <Text className={`text-base font-medium ${isDark ? "text-white" : "text-black"}`}>
        Tema: {isDark ? "Oscuro" : "Claro"}
      </Text>
      <Switch
        value={isDark}
        onValueChange={toggleTheme}
        thumbColor={isDark ? "#FCD34D" : "#6B7280"}
        trackColor={{ false: "#A1A1AA", true: "#52525B" }}
      />
    </View>
  )
}