import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';

import EmailInput from '@/components/inputs/EmailImput';
import OTPInput from '@/components/inputs/OTPInput';
import PasswordInput from '@/components/inputs/PasswordInput';
import PhoneInput from '@/components/inputs/PhoneInput';
import { supabase } from '@/lib/supabase';
import RecoverPassword from '@/modules/auth/components/RecoverPassword';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';
import { Ionicons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('+58');
    const [verificationCode, setVerificationCode] = useState('');
    const [useEmail, setUseEmail] = useState(false);
    // State for SMS OTP
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // For email OTP
    const [useEmailOtp, setUseEmailOtp] = useState(false);
    const [otpEmailCode, setOtpEmailCode] = useState('');
    const [isOtpEmailSent, setIsOtpEmailSent] = useState(false);

    const [otpCountdown, setOtpCountdown] = useState(60); // 
    const [canResendOtp, setCanResendOtp] = useState(false);
    const { signIn } = useAuthStore();

    const isPhoneValid = /^\+58\d{10}$/.test(phone); //  +584121234567
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const isFormValid = useEmailOtp
        ? email.trim() !== '' && otpEmailCode.length === 6
        : useEmail
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
        }
        else if (useEmailOtp) {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otpEmailCode,
                type: 'email',
            });
            setIsLoading(false);
            if (error) {
                Alert.alert('Error', error.message);
            } else {
                router.replace('../(main)/(home)/');
            }
        }

        else {
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
    const sendEmailOtpCode = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Correo inválido');
            return;
        }
        setIsSendingCode(true);
        const redirectUri = AuthSession.makeRedirectUri({
            native: 'frigiluxapp://redirect'

        });
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUri,

            },
        });
        setIsSendingCode(false);
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            setIsOtpEmailSent(true);
            Alert.alert('Código enviado', 'Revisa tu correo electrónico.');
        }
        setOtpCountdown(60);
        setCanResendOtp(false);

        const countdown = setInterval(() => {
            setOtpCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setCanResendOtp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
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
                            <View className="mb-6 ">
                                <Text className="text-4xl  font-bold text-start text-foreground dark:text-dark-foreground">Bienvenido</Text>
                                <Text className="text-start text-mutedForeground mt-2">
                                    Inicia sesión con tu correo o número de teléfono
                                </Text>
                            </View>
                            <View className='gap-6'>
                                {/* Toggle Email/Phone */}
                                <View className="flex-row justify-center">
                                    <TouchableOpacity
                                        className={`flex-1 py-2 rounded-l-full ${useEmail ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        onPress={() => {
                                            setUseEmail(true);
                                            setIsCodeSent(false);
                                            setUseEmailOtp(false);
                                        }}
                                    >
                                        <Text className="text-center text-white">Correo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={`flex-1 py-2  ${!useEmail && !useEmailOtp ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        onPress={() => {
                                            setUseEmail(false);
                                            setUseEmailOtp(false);
                                            setEmail('');
                                            setPassword('');
                                        }}
                                    >
                                        <Text className="text-center text-white">Teléfono</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        className={`flex-1 rounded-r-full py-2 ${useEmailOtp ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        onPress={() => {
                                            setUseEmailOtp(true);
                                            setUseEmail(false);
                                            setIsCodeSent(false);
                                            setIsOtpEmailSent(false);
                                        }}>
                                        <Text className="text-center text-white">OTP por Correo</Text>
                                    </TouchableOpacity>
                                </View>


                                <View className="gap-4">

                                    {!useEmail && !useEmailOtp ? (
                                        <View>
                                            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                Número de teléfono
                                            </Text>

                                            <PhoneInput
                                                value={phone}
                                                onChange={(text) => {
                                                    setPhone(text);
                                                    if (text.length === 13) {
                                                        setIsCodeSent(false);
                                                    }
                                                }}
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
                                    ) : useEmail ? (
                                        <View className="gap-4">
                                            <View>
                                                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                    Correo electrónico
                                                </Text>

                                                <EmailInput
                                                    value={email}
                                                    onChangeText={setEmail}
                                                />

                                            </View>

                                            <View>
                                                <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                                    Contraseña
                                                </Text>

                                                <PasswordInput
                                                    value={password}
                                                    onChangeText={setPassword}
                                                />
                                            </View>
                                        </View>
                                    ) : (
                                        <View>
                                            <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">Correo electrónico</Text>
                                            <EmailInput
                                                value={email}
                                                onChangeText={setEmail}
                                            />

                                            {isEmailValid && !isOtpEmailSent && (
                                                 <TouchableOpacity
                                                    onPress={sendEmailOtpCode}
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
                                            {isOtpEmailSent && (
                                                <>
                                                    <Text className="mt-4 text-gray-700 dark:text-gray-300 font-medium mb-1">Código OTP</Text>

                                                    <OTPInput onCodeFilled={setOtpEmailCode} />
                                                    {canResendOtp ? (
                                                        <TouchableOpacity onPress={sendEmailOtpCode} className="mt-4 p-3 bg-secondary rounded-xl">
                                                            <Text className="text-white text-center font-semibold">Reenviar código</Text>
                                                        </TouchableOpacity>

                                                    ) : (
                                                        <Text className="mt-4 text-center text-gray-500">
                                                            Puedes reenviar el código en {otpCountdown}s
                                                        </Text>
                                                    )}

                                                </>
                                            )}
                                        </View>
                                    )}

                                </View>

                                {/* Buttons */}
                                <View className="flex-row justify-center gap-2 items-center mt-4">
                                    <TouchableOpacity
                                        disabled={!isFormValid || isLoading}
                                        className={`w-3/4 rounded-3xl p-4 items-center justify-center mt-2 ${!isFormValid || isLoading ? 'bg-gray-400' : 'bg-primary dark:bg-primary-dark'}`}
                                        onPress={handleSignIn}

                                    >
                                        {isLoading ? (
                                            <>
                                                <ActivityIndicator color="white" />
                                            </>
                                        ) : (
                                            <Text className="text-white font-bold text-lg">Iniciar sesión</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={handleBiometricLogin}
                                        className="bg-secondary w-1/4 rounded-3xl p-4 items-center justify-center mt-2"
                                    >
                                        {Platform.OS === 'ios' ? (
                                            <Image
                                                source={require('@/assets/images/face-id.png')}
                                                style={{ width: 24, height: 24 }}
                                                resizeMode="contain"
                                            />
                                        ) : (
                                            <Ionicons name="finger-print-outline" size={24} color="white" />
                                        )}
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
