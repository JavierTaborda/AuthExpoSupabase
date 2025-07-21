import { appColors } from "@/utils/colors";
import { ActivityIndicator, Text, View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background dark:bg-dark-background">
      <Text className="text-xl text-primary font-bold mb-4">Cargando app...</Text>
      <ActivityIndicator size="large" color={appColors.primary.DEFAULT} />
    </View>
  );
}
