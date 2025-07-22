import { authenticateWithBiometrics } from "@/utils/biometricAuth";
import { getSessionStatus } from "@/utils/sessionStatus";
import { useAuthStore } from "./useAuthStore";

//Check biometric when restart the app
export async function verifyBiometricSession() {
  const { session, manualLogin, signOutSoft, setManualLogin } = useAuthStore.getState();

  if (session && !manualLogin) {
    const login = await getSessionStatus();
    if (login === "active") {
      const success = await authenticateWithBiometrics();
      if (!success) {
        await signOutSoft();
      }
    }
  }

  setManualLogin(false);
}