import { useAuthStore } from '@/stores/useAuthStore';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { signIn, loading } = useAuthStore();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor, completa todos los campos.');
            return;
        }

        const { error } = await signIn(email, password);

        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/');
        }
    };

    return (
        <View className="flex-1 justify-center p-6 bg-white dark:bg-black">

            <View className="mb-8">
                <Text className="text-3xl font-bold text-center dark:text-white">
                    Bienvenido
                </Text>

            </View>


            <View className="gap-4">

                <View>
                    <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                        Correo electrónico
                    </Text>
                    <TextInput
                        className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                        placeholder="tu@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        accessibilityLabel="Correo electrónico"
                        accessibilityHint="Ingresa tu dirección de correo electrónico"
                    />
                </View>


                <View>
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-gray-700 dark:text-gray-300 font-medium">
                            Contraseña
                        </Text>

                    </View>
                    <TextInput
                        className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                        placeholder="Ingresa tu contraseña..."
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        accessibilityLabel="Contraseña"
                        accessibilityHint="Ingresa tu contraseña"
                    />
                </View>


                <TouchableOpacity
                    className="bg-primary dark:bg-primary-dark rounded-xl p-4 items-center justify-center mt-2"
                    onPress={handleSignIn}
                    disabled={loading}
                    accessibilityRole="button"
                    accessibilityLabel="Iniciar sesión"
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">
                            Iniciar sesión
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            


            <View className="flex-row justify-center mt-6">
                {/* <Text className="text-gray-600 dark:text-gray-400">
                    ¿No tienes una cuenta?{' '}
                </Text>
                <Link href="/" asChild>
                    <TouchableOpacity>
                        <Text className="text-primary dark:text-primary-light font-semibold">
                            Regístrate
                        </Text>
                    </TouchableOpacity>
                </Link> */}
                <TouchableOpacity>
                    <Text className="text-primary dark:text-primary-light font-semibold">
                        Olvidé mi contraseña
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}