import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from 'nativewind';
import { Appearance } from 'react-native';
import { create } from 'zustand';



type Theme = "light" | "dark"

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  hydrate: () => Promise<void>
}

const STORAGE_KEY = "APP_THEME"

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: "light",

  setTheme: (theme) => {
    colorScheme.set(theme) 
    AsyncStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },

  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark"
    get().setTheme(next)
  },

  hydrate: async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY)
    const preferred = (stored as Theme) || Appearance.getColorScheme() || "light"
    get().setTheme(preferred)
  },
}))
