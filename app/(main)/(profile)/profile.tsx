import { useAuthStore } from '@/stores/useAuthStore';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const { session, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();

  };

  return (
    <View className="flex-1 p-6 bg-white dark:bg-black">
      <Text className="text-2xl font-bold mb-6 dark:text-white">Profile</Text>

      {session?.user?.email && (
        <Text className="text-lg mb-4 dark:text-white">
          Logged in as: {session.user.email}
        </Text>
      )}

      <TouchableOpacity
        className="flex-row items-center bg-error/10 p-3 rounded-lg border border-error/20"
        onPress={() => handleSignOut()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} />
        <Text className="text-error font-medium ml-2">Salir</Text>
      </TouchableOpacity>

    </View>
  );
}