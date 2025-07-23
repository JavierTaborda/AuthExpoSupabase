import EmailInput from '@/components/inputs/EmailImput';
import PasswordInput from '@/components/inputs/PasswordInput';
import { Ionicons } from '@expo/vector-icons';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import RecoverPassword from './RecoverPassword';

export default function PasswordForm({
  email, password, setEmail, setPassword, onBiometricLogin
}: {
  email: string;
  password: string;
  setEmail: (val: string) => void;
  setPassword: (val: string) => void;
  onBiometricLogin: () => void;

}) {
  return (
    <>
      <EmailInput value={email} onChangeText={setEmail} />
      <PasswordInput value={password} onChangeText={setPassword} />

      <TouchableOpacity
        onPress={onBiometricLogin}
        className="mt-4 w-full flex-row items-center justify-center gap-2 bg-secondary py-3 rounded-xl"
      >
        {Platform.OS === 'ios' ? (
          <>
            <Image source={require('@/assets/images/face-id.png')} style={{ width: 24, height: 24 }} resizeMode="contain" />
            <Text className="text-white font-medium">Usar Face ID</Text>
          </>
        ) : (
          <>
            <Ionicons name="finger-print-outline" size={24} color="white" />
            <Text className="text-white font-medium">Usar biometría</Text>
          </>
        )}

      </TouchableOpacity>
      <View className="items-center mt-6">
        <RecoverPassword />
      </View>
    </>

  );
}
