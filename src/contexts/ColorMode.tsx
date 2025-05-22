import React, { createContext, useState, useContext, useEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';

type ColorMode = 'light' | 'dark';
type ColorModeContextType = {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType | undefined>(undefined);

export const useColorMode = (): ColorModeContextType => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider');
  }
  return context;
};

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  
  // Convert theme to color mode - handle SSR safely
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Only access window.matchMedia in browser environment
    const darkModePreference = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = theme === 'dark' || 
      (theme === 'system' && darkModePreference);
    
    setIsDarkMode(isDark);
  }, [theme]);
  
  const [colorMode, setColorMode] = useState<ColorMode>(isDarkMode ? 'dark' : 'light');

  // Keep colorMode in sync with theme
  useEffect(() => {
    const newColorMode: ColorMode = isDarkMode ? 'dark' : 'light';
    setColorMode(newColorMode);
  }, [isDarkMode]);

  const toggleColorMode = () => {
    const newMode = colorMode === 'light' ? 'dark' : 'light';
    setColorMode(newMode);
    setTheme(newMode);
  };

  const value = {
    colorMode,
    setColorMode: (mode: ColorMode) => {
      setColorMode(mode);
      setTheme(mode);
    },
    toggleColorMode,
  };

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
};
