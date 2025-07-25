import ThemeToggle from '@/components/ThemeToggle';
import { useAuthStore } from '@/stores/useAuthStore';
import { getBiometricEnabled } from '@/utils/biometricFlag';
import { appColors } from '@/utils/colors';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BiometricToggle from '../components/BiometricView';

export default function ProfileScreen() {
  const { session, signOut, signOutSoft } = useAuthStore();
  const [isloading, setIsLoading] = useState<boolean>(false)


  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      const isEnabled = await getBiometricEnabled();

      if (isEnabled) {
        await signOutSoft();
      }
      else {
        await signOut();
      }
    }
    catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert("Error " + errorMessage);
    }
    finally {
      setIsLoading(false);
    }

  };

  return (
    <ScrollView className="flex-1 p-6 bg-background dark:bg-dark-background" alwaysBounceVertical={true} indicatorStyle={'black'}>
      <View className='items-center gap-4'>


        {session?.user?.email && (
          <View className="items-center px-4 py-3 rounded-xl w-[80%]   bg-componentbg dark:bg-dark-componentbg">
            <Text className="text-lg  dark:text-white">
              Correo: {session.user.email}
            </Text>
          </View>
        )}

        {session?.user?.role && (
          <View className="items-center px-4 py-3 rounded-xl w-[80%]   bg-componentbg dark:bg-dark-componentbg">

            <Text className="text-lg  dark:text-white">
              Rol: {session.user.role}
            </Text>
          </View>
        )}


        <BiometricToggle />
        <ThemeToggle />


        <TouchableOpacity
          className="flex-row items-center bg-error/10 p-3 rounded-lg border border-error/20"
          onPress={() => handleSignOut()}
          activeOpacity={0.7}
          disabled={isloading}
        >
          <MaterialIcons name="logout" size={20} color={appColors.error} />
          <Text className="text-error font-medium ml-2">Salir</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}