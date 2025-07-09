import { useAuthStore } from '@/stores/useAuthStore';
import { Link, router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Profile() {
  const { session, signOut } = useAuthStore();

  const handleSignOut = async () => {
    await signOut();
    router.replace('./(auth)/sign-in');
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
        className="bg-error rounded-lg p-3 items-center mt-4"
        onPress={handleSignOut}
      >
        <Text className="text-white font-medium">Sign Out</Text>
      </TouchableOpacity>
      
      <Link href="/" asChild className="mt-4">
        <TouchableOpacity className="bg-tertiary rounded-lg p-3 items-center">
          <Text className="text-white font-medium">Go to Home</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}