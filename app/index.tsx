import ThemeToggle from "@/components/ThemeToggle";
import { Text, View } from "react-native";
export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="text-black dark:text-white text-xl mb-4">
        Hola mundo
      </Text>
      <ThemeToggle />
    </View>
    
  );
}