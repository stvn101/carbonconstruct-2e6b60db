
/**
 * Theme validation utilities for ensuring consistent theme application across components
 */
import { useTheme } from '@/components/ThemeProvider';

export const themeColorPalette = [
  {
    name: "Primary Colors",
    colors: [
      { name: "background", day: "#F8F9FA", night: "#212529", description: "Main background" },
      { name: "foreground", day: "#212529", night: "#F8F9FA", description: "Main text" },
      { name: "primary", day: "#2B8A3E", night: "#2B8A3E", description: "Primary accent" },
      { name: "primary-foreground", day: "#FFFFFF", night: "#FFFFFF", description: "Text on primary" },
    ]
  },
  {
    name: "UI Components",
    colors: [
      { name: "card", day: "#FFFFFF", night: "#343A40", description: "Card background" },
      { name: "card-foreground", day: "#212529", night: "#F8F9FA", description: "Card text" },
      { name: "popover", day: "#FFFFFF", night: "#343A40", description: "Popover background" },
      { name: "popover-foreground", day: "#212529", night: "#F8F9FA", description: "Popover text" },
      { name: "border", day: "#DEE2E6", night: "#495057", description: "Border color" },
    ]
  },
  {
    name: "Semantic Colors",
    colors: [
      { name: "muted", day: "#E9ECEF", night: "#343A40", description: "Muted background" },
      { name: "muted-foreground", day: "#6C757D", night: "#ADB5BD", description: "Muted text" },
      { name: "accent", day: "#E9ECEF", night: "#343A40", description: "Accent background" },
      { name: "accent-foreground", day: "#212529", night: "#F8F9FA", description: "Accent text" },
      { name: "destructive", day: "#DC3545", night: "#DC3545", description: "Error state" },
      { name: "destructive-foreground", day: "#FFFFFF", night: "#FFFFFF", description: "Error text" },
    ]
  },
];

/**
 * Get the computed style value for a CSS variable
 */
const getComputedThemeValue = (variableName: string): string => {
  try {
    // Get the computed style on the document element
    const styles = getComputedStyle(document.documentElement);
    return styles.getPropertyValue(variableName).trim();
  } catch (e) {
    console.error(`Failed to get computed value for ${variableName}:`, e);
    return '';
  }
};

/**
 * Validate if a theme variable is properly defined and applied
 */
const validateThemeVariable = (variableName: string): { isValid: boolean; value: string } => {
  const value = getComputedThemeValue(`--${variableName}`);
  
  // Check if the value exists and is not just whitespace
  const isValid = Boolean(value && value !== 'initial' && value !== 'inherit');
  
  return { isValid, value };
};

/**
 * Validate all theme colors and identify any inconsistencies
 */
export const validateAllThemeColors = (): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  let allValid = true;
  
  // Validate all color categories
  themeColorPalette.forEach(category => {
    category.colors.forEach(color => {
      const { isValid, value } = validateThemeVariable(color.name);
      
      if (!isValid) {
        issues.push(`"${color.name}" is not properly defined (${value || 'empty'}).`);
        allValid = false;
      }
    });
  });
  
  // Check contrast ratios for accessibility
  const bgColor = getComputedThemeValue('--background');
  const textColor = getComputedThemeValue('--foreground');
  
  if (bgColor && textColor) {
    // This is a simplified check - a real contrast ratio calculation would be more complex
    if (bgColor === textColor) {
      issues.push('Background and foreground colors have identical values, causing contrast issues.');
      allValid = false;
    }
  }
  
  return { isValid: allValid, issues };
};

/**
 * Hook to validate theme and get current theme status
 */
export const useThemeValidator = () => {
  const { theme } = useTheme();
  const validation = validateAllThemeColors();
  
  return {
    theme,
    validation,
    isDark: theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches),
  };
};
