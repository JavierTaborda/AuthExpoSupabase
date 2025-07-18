import ThemeToggle from '@/components/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { appColors } from '@/utils/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const { session, signOut } = useAuthStore();
  

  const handleSignOut = async () => {
    await signOut();

  };

  return (
    <View className="flex-1 p-6 bg-background dark:bg-dark-background">
      <View className='items-center gap-6'>

      {session?.user?.email && (
        <Text className="text-lg mb-4 dark:text-white">
          Cuenta: {session.user.email}
        </Text>
      )}

      <ThemeToggle />

      <TouchableOpacity
        className="flex-row items-center bg-error/10 p-3 rounded-lg border border-error/20"
        onPress={() => handleSignOut()}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} color={appColors.error}/>
        <Text className="text-error font-medium ml-2">Salir</Text>
      </TouchableOpacity>
      </View>

    </View>
  );
}