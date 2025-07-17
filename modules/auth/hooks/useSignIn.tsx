
import { supabase } from '@/lib/supabase';
import { getToken, useAuthStore } from '@/stores/useAuthStore';
import { authenticateWithBiometrics } from '@/utils/biometricAuth';
import * as AuthSession from 'expo-auth-session';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';

export function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+58');
  const [verificationCode, setVerificationCode] = useState('');
  const [otpEmailCode, setOtpEmailCode] = useState('');
  const [useEmail, setUseEmail] = useState(false);
  const [useEmailOtp, setUseEmailOtp] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isOtpEmailSent, setIsOtpEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);

  const { signIn } = useAuthStore();

  const isPhoneValid = /^\+58\d{10}$/.test(phone);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isFormValid = useEmailOtp
    ? email.trim() !== '' && otpEmailCode.length === 6
    : useEmail
    ? email.trim() !== '' && password.trim() !== ''
    : isPhoneValid && verificationCode.length === 6;

  const handleSignIn = async () => {
    if (!isFormValid) {
      Alert.alert('Error', 'Completa todos los campos.');
      return;
    }

    setIsLoading(true);

    if (useEmail) {
      const { error } = await signIn(email, password);
      setIsLoading(false);
      if (error) Alert.alert('Error', error.message);
      else router.replace('../(main)/(home)/');
    } else if (useEmailOtp) {
      const { error } = await supabase.auth.verifyOtp({ email, token: otpEmailCode, type: 'email' });
      setIsLoading(false);
      if (error) Alert.alert('Error', error.message);
      else router.replace('../(main)/(home)/');
    } else {
      const { error } = await supabase.auth.verifyOtp({ phone, token: verificationCode, type: 'sms' });
      setIsLoading(false);
      if (error) Alert.alert('Error', error.message);
      else router.replace('../(main)/(home)/');
    }
  };

  const sendVerificationCode = async () => {
    if (!isPhoneValid) return Alert.alert('Error', 'Número inválido. Usa formato +58XXXXXXXXXX');
    setIsSendingCode(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setIsSendingCode(false);
    if (error) Alert.alert('Error', error.message);
    else {
      setIsCodeSent(true);
      Alert.alert('Código enviado', 'Revisa tus mensajes SMS.');
    }
  };

  const sendEmailOtpCode = async () => {
    if (!isEmailValid) return Alert.alert('Error', 'Correo inválido');

    setIsSendingCode(true);
    const redirectUri = AuthSession.makeRedirectUri({ native: 'frigiluxapp://redirect' });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUri },
    });
    setIsSendingCode(false);

    if (error) Alert.alert('Error', error.message);
    else {
      setIsOtpEmailSent(true);
      Alert.alert('Código enviado', 'Revisa tu correo electrónico.');
      startCountdown();
    }
  };

  const startCountdown = () => {
    setOtpCountdown(60);
    setCanResendOtp(false);
    const interval = setInterval(() => {
      setOtpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResendOtp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateWithBiometrics();
      if (success) {
        const token = await getToken();
        const { data } = await supabase.auth.getUser();
        if (token && data?.user) router.replace('../(main)/(home)/');
        else Alert.alert('Error', 'Inicia sesión manualmente');
      }
    } catch (err) {
      Alert.alert('Error', (err as Error).message);
    }
  };

  return {
    email,
    password,
    phone,
    verificationCode,
    otpEmailCode,
    useEmail,
    useEmailOtp,
    isSendingCode,
    isCodeSent,
    isOtpEmailSent,
    isLoading,
    otpCountdown,
    canResendOtp,
    isEmailValid,
    isPhoneValid,
    isFormValid,
    setEmail,
    setPassword,
    setPhone,
    setVerificationCode,
    setOtpEmailCode,
    setUseEmail,
    setUseEmailOtp,
    setIsCodeSent,
    setIsOtpEmailSent,
    sendVerificationCode,
    sendEmailOtpCode,
    handleSignIn,
    handleBiometricLogin,
  };
}
