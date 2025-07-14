import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import OTPInput from '@/components/OTPInput';
import { supabase } from '@/lib/supabase';
import RecoverPassword from '@/modules/auth/components/RecoverPassword';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';
import { router } from 'expo-router';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('+58');
    const [verificationCode, setVerificationCode] = useState('');
    const [useEmail, setUseEmail] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuthStore();

    const isPhoneValid = /^\+58\d{10}$/.test(phone); //  +584121234567
    const isFormValid = useEmail
        ? email.trim() !== '' && password.trim() !== ''
        : isPhoneValid && verificationCode.length === 6;

    const sendVerificationCode = async () => {
        if (!isPhoneValid) {
            Alert.alert('Error', 'Número inválido. Usa formato +58XXXXXXXXXX');
            return;
        }

        setIsSendingCode(true);
        const { error } = await supabase.auth.signInWithOtp({ phone });

        setIsSendingCode(false);
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setIsCodeSent(true);
            Alert.alert('Código enviado', 'Revisa tus mensajes SMS.');
        }
    };

    const handleSignIn = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Completa todos los campos.');
            return;
        }

        setIsLoading(true);

        if (useEmail) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setIsLoading(false);
                Alert.alert('Error', 'Correo inválido');
                return;
            }

            const { error } = await signIn(email, password);
            setIsLoading(false);
            if (error) {
                Alert.alert('Error', error.message);
            } else {
                router.replace('../(main)/(home)/');
            }
        } else {
            const { error } = await supabase.auth.verifyOtp({
                phone,
                token: verificationCode,
                type: 'sms',
            });
            setIsLoading(false);
            if (error) {
                Alert.alert('Error', error.message);
            } else {
                router.replace('../(main)/(home)/');
            }
        }
    };

    const handleBiometricLogin = async () => {
        try {
            const success = await authenticateWithBiometrics();
            if (success) {
                const token = await getToken();
                if (token) {
                    const { data } = await supabase.auth.getUser();
                    if (data?.user) {
                        router.replace('../(main)/(home)/');
                    } else {
                        Alert.alert('Sesión inválida', 'Inicia sesión manualmente');
                    }
                } else {
                    Alert.alert('Token no encontrado', 'Inicia sesión manualmente');
                }
            }
        } catch (err) {
            Alert.alert('Error', (err as Error).message);
        }
    };

    return (
        <SafeAreaView className="flex-1">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                    <KeyboardAvoidingView
                        className="flex-1"
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                    >
                        <View className="flex-1 justify-normal p-6 bg-background dark:bg-dark-background">
                            <Text className="text-3xl font-bold text-center dark:text-white mb-6">Bienvenido</Text>

                            {/* Toggle Email/Phone */}
                            <View className="flex-row justify-center mb-6">
                                <TouchableOpacity
                                    className={`flex-1 py-2 rounded-l-full ${useEmail ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    onPress={() => {
                                        setUseEmail(true);
                                        setIsCodeSent(false);
                                    }}
                                >
                                    <Text className="text-center text-white">Correo</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className={`flex-1 py-2 rounded-r-full ${!useEmail ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                    onPress={() => {
                                        setUseEmail(false);
                                        setEmail('');
                                        setPassword('');
                                    }}
                                >
                                    <Text className="text-center text-white">Teléfono</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="gap-4">
                                {!useEmail ? (
                                    <View>
                                        <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                            Número de teléfono
                                        </Text>
                                        <TextInput
                                            className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                                            placeholder="+58412XXXXXXX"
                                            placeholderTextColor="#9CA3AF"
                                            value={phone}
                                            onChangeText={(text) => {
                                                // start with +58 and allow only numbers
                                                if (/^\+58\d*$/.test(text)) {
                                                    setPhone(text);
                                                    if (text.length === 13) {
                                                        setIsCodeSent(false);
                                                    }
                                                }
                                            }}
                                            keyboardType="phone-pad"
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            maxLength={13}
                                        />

                                        {phone.length === 13 && !isCodeSent && (
                                            <TouchableOpacity
                                                onPress={sendVerificationCode}
                                                disabled={isSendingCode}
                                                className={`mt-3 p-3 rounded-xl items-center justify-center ${isSendingCode ? 'bg-gray-400' : 'bg-secondary'}`}
                                            >
                                                {isSendingCode ? (
                                                    <ActivityIndicator color="white" />
                                                ) : (
                                                    <Text className="text-white font-semibold">Enviar código</Text>
                                                )}
                                            </TouchableOpacity>
                                        )}

                                        {isCodeSent && (
                                            <>
                                                <Text className="text-gray-700 dark:text-gray-300 font-medium mt-4 mb-1">
                                                    Código de verificación
                                                </Text>
                                                <OTPInput onCodeFilled={setVerificationCode} />
                                            </>
                                        )}
                                    </View>
                                ) : (
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
                                                autoCorrect={true}
                                                textContentType="emailAddress"
                                            />
                                        </View>

                                        <View>
                                            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Contraseña
                                            </Text>
                                            <TextInput
                                                className="border border-gray-300 dark:border-gray-600 rounded-xl p-4 dark:text-white bg-transparent"
                                                placeholder="Ingresa tu contraseña..."
                                                placeholderTextColor="#9CA3AF"
                                                value={password}
                                                onChangeText={setPassword}
                                                secureTextEntry
                                                textContentType="password"
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Buttons */}
                                <View className="flex-row justify-center gap-2 items-center mt-4">
                                    <TouchableOpacity
                                        className={`w-3/4 rounded-3xl p-4 items-center justify-center mt-2 ${!isFormValid || isLoading ? 'bg-gray-400' : 'bg-primary dark:bg-primary-dark'}`}
                                        onPress={handleSignIn}
                                        disabled={!isFormValid || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <ActivityIndicator color="white" />
                                                <Text className="text-white text-sm mt-2">Verificando...</Text>
                                            </>
                                        ) : (
                                            <Text className="text-white font-bold text-lg">Iniciar sesión</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleBiometricLogin}
                                        className="bg-secondary w-1/4 rounded-3xl p-4 items-center justify-center mt-2"
                                    >
                                        <Icon name="fingerprint" size={26} color="white" />
                                    </TouchableOpacity>
                                </View>

                                {useEmail && (
                                    <View className="flex-row justify-center mt-6">
                                        <RecoverPassword />
                                    </View>
                                )}
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
