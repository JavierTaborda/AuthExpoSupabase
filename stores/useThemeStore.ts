import { Appearance } from 'react-native';
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}
export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: Appearance.getColorScheme() || "light",
  setTheme: (theme) => set({ theme }),
  toggleTheme: () =>
    set({ theme: get().theme === "dark" ? "light" : "dark" }),
}))