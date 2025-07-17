import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmailInput from '@/components/inputs/EmailImput';
import OTPInput from '@/components/inputs/OTPInput';
import PasswordInput from '@/components/inputs/PasswordInput';
import PhoneInput from '@/components/inputs/PhoneInput';
import RecoverPassword from '@/modules/auth/components/RecoverPassword';
import { useSignIn } from '@/modules/auth/hooks/useSignIn';

export default function SignIn() {
    const {
        email, password, phone, verificationCode, otpEmailCode,
        useEmail, useEmailOtp,
        isSendingCode, isCodeSent, isOtpEmailSent, isLoading,
        otpCountdown, canResendOtp, isFormValid, isEmailValid,
        setEmail, setPassword, setPhone, setVerificationCode, setOtpEmailCode,
        setUseEmail, setUseEmailOtp, setIsCodeSent, setIsOtpEmailSent,
        sendVerificationCode, sendEmailOtpCode,
        handleSignIn, handleBiometricLogin,
    } = useSignIn();

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1 }} className="bg-background dark:bg-dark-background">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                    className="flex-1"
                >
                    <View className="flex-1 px-6 justify-between pb-6">
                        <View className="pt-12">
                            {/* Header */}
                            <Text className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
                                Inicia sesión
                            </Text>
                            <Text className="text-base text-foreground dark:text-dark-foreground mb-6">
                                Bienvenido de nuevo. Ingresa tus datos para continuar.
                            </Text>

                            {/* Selector */}
                            <View className="flex-row mb-6">
                                {[
                                    { label: 'Contraseña', active: useEmail, onPress: () => { setUseEmail(true); setUseEmailOtp(false); setIsCodeSent(false); } },
                                    { label: 'Teléfono', active: !useEmail && !useEmailOtp, onPress: () => { setUseEmail(false); setUseEmailOtp(false); setEmail(''); setPassword(''); } },
                                    { label: 'Correo', active: useEmailOtp, onPress: () => { setUseEmailOtp(true); setUseEmail(false); setIsCodeSent(false); setIsOtpEmailSent(false); } },
                                ].map((opt) => (
                                    <TouchableOpacity
                                        key={opt.label}
                                        onPress={opt.onPress}
                                        className={`flex-1 py-2 items-center border-b-2 ${opt.active ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <Text className={`text-base font-medium ${opt.active ? 'text-primary' : 'text-mutedForeground'}`}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Inputs */}
                            <View className="gap-4">
                                {!useEmail && !useEmailOtp ? (
                                    <>
                                        <PhoneInput value={phone} onChange={(text) => {
                                            setPhone(text);
                                            if (text.length === 13) setIsCodeSent(false);
                                        }} />

                                        {phone.length === 13 && !isCodeSent && (
                                            <TouchableOpacity
                                                onPress={sendVerificationCode}
                                                disabled={isSendingCode}
                                                className={`mt-2 py-3 rounded-md items-center ${isSendingCode ? 'bg-gray-300' : 'bg-primary'}`}
                                            >
                                                {isSendingCode ? <ActivityIndicator color="white" /> : (
                                                    <Text className="text-white font-semibold">Enviar código</Text>
                                                )}
                                            </TouchableOpacity>
                                        )}

                                        {isCodeSent && (
                                            <>
                                                <Text className="text-sm font-medium text-mutedForeground mt-2">Código de verificación</Text>
                                                <OTPInput onCodeFilled={setVerificationCode} />
                                            </>
                                        )}
                                    </>
                                ) : useEmail ? (
                                    <>
                                        <EmailInput value={email} onChangeText={setEmail} />
                                        <PasswordInput value={password} onChangeText={setPassword} />
                                    </>
                                ) : (
                                    <>
                                        <EmailInput value={email} onChangeText={setEmail} />

                                        {isEmailValid && !isOtpEmailSent && (
                                            <TouchableOpacity
                                                onPress={sendEmailOtpCode}
                                                disabled={isSendingCode}
                                                className={`mt-2 py-3 rounded-md items-center ${isSendingCode ? 'bg-gray-300' : 'bg-primary'}`}
                                            >
                                                {isSendingCode ? <ActivityIndicator color="white" /> : (
                                                    <Text className="text-white font-semibold">Enviar código</Text>
                                                )}
                                            </TouchableOpacity>
                                        )}

                                        {isOtpEmailSent && (
                                            <>
                                                <OTPInput onCodeFilled={setOtpEmailCode} />
                                                {canResendOtp ? (
                                                    <TouchableOpacity onPress={sendEmailOtpCode} className="mt-4 p-3 bg-primary rounded-md">
                                                        <Text className="text-white text-center font-semibold">Reenviar código</Text>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <Text className="mt-2 text-center text-mutedForeground text-sm">
                                                        Puedes reenviar en {otpCountdown}s
                                                    </Text>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            </View>

                            {/* Botón de iniciar sesión */}
                            <View className="mt-6">
                                <TouchableOpacity
                                    onPress={handleSignIn}
                                    disabled={!isFormValid || isLoading}
                                    className={`w-full py-4 rounded-xl ${!isFormValid || isLoading ? 'bg-gray-300' : 'bg-primary'}`}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text className="text-center text-white font-semibold text-base">Iniciar sesión</Text>
                                    )}
                                </TouchableOpacity>
                            </View>


                            {useEmail && (
                                <>
                                    <TouchableOpacity
                                        onPress={handleBiometricLogin}
                                        className="mt-4 w-full flex-row items-center justify-center gap-2 bg-secondary py-3 rounded-xl"
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
                                        <Text className="text-white font-medium">Usar biometría</Text>
                                    </TouchableOpacity>

                                    <View className="items-center mt-6">
                                        <RecoverPassword />
                                    </View></>
                            )}
                        </View>


                        
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
