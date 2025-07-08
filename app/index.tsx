import { Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 justify-center items-center bg-background-light dark:bg-background-dark">
      <Text className="text-text-light dark:text-text-dark text-xl">
        Bienvenido 🎉
      </Text>
    </View>
  );
}