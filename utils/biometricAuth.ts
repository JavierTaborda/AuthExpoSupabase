import * as LocalAuthentication from 'expo-local-authentication';

/**
 * This function checks if the device supports biometric authentication
 * and if the user has enrolled any biometrics. If both conditions are met,
 * it prompts the user to authenticate using biometrics.
 *
 */

const trys = 2;


export async function authenticateWithBiometrics() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    throw new Error('Biometría no disponible');
  }
  let attemps = 0;
  let auth = false;

  while (attemps < 3 && !auth) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Usa tu biometría para ingresar',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar PIN '
    });

    if (!result.success) {
      attemps++;
    }
    else {
      auth = true;
    }
  }

  return auth;
}