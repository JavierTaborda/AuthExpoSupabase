import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/stores/useAuthStore";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
export default function Home() {
  const { signOut, loading, session } = useAuthStore();
  const token= session?.access_token;
  return (
    <View className="flex-1 items-center  gap-5 justify-center bg-background dark:bg-dark-background ">
      <Text className="text-black dark:text-white text-xl mb-4">
        Bienvenido
      </Text> 
      {session && session.user && <Text className="text-black dark:text-white text-xl mb-4">{session.user.email}</Text>}

      <View className="flex-row items-center gap-4">
         
        <TouchableOpacity
          className="flex-row items-center bg-error/10 p-3 rounded-lg border border-error/20"
          onPress={() => signOut()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="logout" size={20}  />
          <Text className="text-error font-medium ml-2">Salir</Text>
        </TouchableOpacity>
      </View>
      <ThemeToggle />
    </View>

  );
}