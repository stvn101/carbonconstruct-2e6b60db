
import { useState, useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Hook to determine if dark mode is active, based on theme settings
 * and system preferences.
 */
export function useIsDarkMode() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Determine if dark mode is active based on theme and system preference
    const darkModePreference = window.matchMedia && 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const isDark = theme === 'dark' || 
      (theme === 'system' && darkModePreference);
    
    setIsDarkMode(isDark);
    
    // Listen for changes in system preference if theme is 'system'
    if (theme === 'system' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        setIsDarkMode(mediaQuery.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);
  
  return isDarkMode;
}
