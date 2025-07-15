import * as LocalAuthentication from 'expo-local-authentication';

/**
 * This function checks if the device supports biometric authentication
 * and if the user has enrolled any biometrics. If both conditions are met,
 * it prompts the user to authenticate using biometrics.
 *
 */

export async function authenticateWithBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    throw new Error('Biometría no disponible');
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Usa tu biometría para ingresar',
    cancelLabel: 'Cancelar',
  });

  if (!result.success) {
    throw new Error(result.error || 'Autenticación cancelada');
  }

  return true;
}