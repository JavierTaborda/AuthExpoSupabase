import React from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmailOTPForm from '@/modules/auth/components/EmailOTPForm';
import PasswordForm from '@/modules/auth/components/PasswordForm';
import PhoneForm from '@/modules/auth/components/PhoneForm';
import { useSignIn } from '@/modules/auth/hooks/useSignIn';

export default function SignIn() {
    const {
        email, setEmail,
        password, setPassword,
        phone, setPhone,
        otpCode, setOtpCode,
        method, setMethod,
        isLoading, isSending, isCodeSent,
        otpCountdown, canResendOtp,
        isFormValid, isEmailValid, isPhoneValid,
        handleSignIn, sendOtp, handleBiometricLogin,
    } = useSignIn();

    return (
        <SafeAreaView edges={['top']} style={{ flex: 1 }} className="bg-background dark:bg-dark-background">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={10}
                    className="flex-1"
                >
                    <View className="flex-1 px-6 justify-between pb-6">
                        <View className="pt-12">
                            <Text className="text-3xl font-bold text-foreground dark:text-dark-foreground mb-2">
                                Inicia sesión
                            </Text>
                            <Text className="text-base text-foreground dark:text-dark-foreground mb-6">
                                Bienvenido de nuevo. Ingresa tus datos para continuar.
                            </Text>

                            {/* Selector de método */}
                            <View className="flex-row mb-6">
                                {[
                                    { label: 'Contraseña', value: 'password' },
                                    { label: 'Teléfono', value: 'phone' },
                                    { label: 'Correo', value: 'emailOtp' },
                                ].map((opt) => (
                                    <TouchableOpacity
                                        key={opt.value}
                                        onPress={() => setMethod(opt.value as any)}
                                        className={`flex-1 py-2 items-center border-b-2 ${method === opt.value ? 'border-primary' : 'border-transparent'}`}
                                    >
                                        <Text className={`text-base font-medium ${method === opt.value ? 'text-primary' : 'text-mutedForeground'}`}>
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Formulario dinámico */}
                            <View className="gap-4">
                                {method === 'password' && (
                                    <PasswordForm
                                        email={email}
                                        password={password}
                                        setEmail={setEmail}
                                        setPassword={setPassword}
                                        onBiometricLogin={handleBiometricLogin}

                                    />
                                )}
                                {method === 'phone' && (
                                    <PhoneForm
                                        phone={phone}
                                        setPhone={setPhone}
                                        otpCode={otpCode}
                                        setOtpCode={setOtpCode}
                                        isCodeSent={isCodeSent}
                                        isSending={isSending}
                                        onSendCode={sendOtp}
                                        countdown={otpCountdown}
                                        canResend={canResendOtp}
                                        isPhoneValid={isPhoneValid}
                                    />
                                )}
                                {method === 'emailOtp' && (
                                    <EmailOTPForm
                                        email={email}
                                        setEmail={setEmail}
                                        otpCode={otpCode}
                                        setOtpCode={setOtpCode}
                                        isCodeSent={isCodeSent}
                                        isSending={isSending}
                                        countdown={otpCountdown}
                                        canResend={canResendOtp}
                                        onSendCode={sendOtp}
                                        isEmailValid={isEmailValid}
                                    />
                                )}
                            </View>

                            {/* Button*/}
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
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
