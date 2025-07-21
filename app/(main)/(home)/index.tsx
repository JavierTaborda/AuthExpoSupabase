import { useAuthStore } from "@/stores/useAuthStore";
import { Text, View } from "react-native";
export default function Home() {
  const {  session } = useAuthStore();
  const token= session?.access_token;
  return (
    <View className="flex-1 items-center  gap-5 justify-center bg-background dark:bg-dark-background ">
      <Text className="text-black dark:text-white text-xl mb-4">
        Bienvenido
      </Text> 
      {session && session.user && <Text className="text-black dark:text-white text-xl mb-4">{session.user.email}</Text>}

      <View className="flex-row items-center gap-4">
         
       
      </View>
 
    </View>

  );
}