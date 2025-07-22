
import AsyncStorage from "@react-native-async-storage/async-storage";

const BIOMETRIC_KEY = "biometricEnabled";

//Flag for activate the biometric login
export async function setBiometricEnabled(value: boolean) {
  await AsyncStorage.setItem(BIOMETRIC_KEY, value ? "true" : "false");
}

export async function getBiometricEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(BIOMETRIC_KEY);
  return value === "true";
}

