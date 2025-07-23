import { authenticateWithBiometrics } from "@/utils/biometricAuth";
import { getSessionStatus } from "@/utils/sessionStatus";
import { Alert } from 'react-native';
import { create } from 'zustand';
import { useAuthStore } from "./useAuthStore";

interface AuthProviderState {
  showSplash: boolean;
  hasAuthenticated: boolean;
  initializeApp: () => Promise<void>;
  setShowSplash: (show: boolean) => void;
}

export const useAuthProviderStore = create<AuthProviderState>((set) => ({
  showSplash: true,
  hasAuthenticated: false,
  
  initializeApp: async () => {
    // Check session to restore
    await useAuthStore.getState().initializeAuth();

    const { session, manualLogin, signOutSoft, setManualLogin } = useAuthStore.getState();

    if (!session) {
      set({ showSplash: false });
      await signOutSoft();
      return;
    }

    if (session && !manualLogin) {
      const loginStatus = await getSessionStatus();

      if (loginStatus === "active") {
        const biometricSuccess = await authenticateWithBiometrics();

        if (!biometricSuccess) {
          Alert.alert(
            "Autenticación fallida",
            "No pudimos validar tu identidad."
          );
          set({ showSplash: false });
          await signOutSoft();
          return;
        } else {
          set({ hasAuthenticated: true });
        }
      }
    }

    setManualLogin(false);
    set({ showSplash: false });
  },

  setShowSplash: (show: boolean) => set({ showSplash: show }),
}));