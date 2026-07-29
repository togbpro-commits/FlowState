import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { THEMES, ThemeName, ThemeColors } from "./colors";

const STORAGE_KEY = "@togbpro/theme";

interface ThemeContextValue {
  theme: ThemeColors;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES.studio,
  themeName: "studio",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>("studio");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored && stored in THEMES) {
        setThemeName(stored as ThemeName);
      }
    });
  }, []);

  const setTheme = useCallback((name: ThemeName) => {
    setThemeName(name);
    AsyncStorage.setItem(STORAGE_KEY, name);
  }, []);

  return (
    <ThemeContext value={{ theme: THEMES[themeName], themeName, setTheme }}>
      {children}
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  return React.use(ThemeContext);
}
