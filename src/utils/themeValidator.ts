
/**
 * Theme Validator Utility
 * 
 * This utility helps to ensure theme consistency across the application.
 * It can be used during development to validate theme variables and
 * detect inconsistencies.
 */

export type ThemeColor = {
  name: string;
  day: string;
  night: string;
  description: string;
};

export type ThemeColorCategory = {
  name: string;
  colors: ThemeColor[];
};

// Our standardized color palette
export const themeColorPalette: ThemeColorCategory[] = [
  {
    name: "Primary Colors",
    colors: [
      {
        name: "background",
        day: "#F8F9FA",
        night: "#212529",
        description: "Main background"
      },
      {
        name: "foreground",
        day: "#212529",
        night: "#F8F9FA",
        description: "Main text"
      },
      {
        name: "primary",
        day: "#2B8A3E",
        night: "#2B8A3E",
        description: "Brand accent"
      }
    ]
  },
  {
    name: "UI Components",
    colors: [
      {
        name: "card",
        day: "#FFFFFF",
        night: "#343A40",
        description: "Card background"
      },
      {
        name: "muted",
        day: "#E9ECEF",
        night: "#343A40",
        description: "Muted areas"
      },
      {
        name: "muted-foreground",
        day: "#6C757D",
        night: "#ADB5BD",
        description: "Muted text"
      },
      {
        name: "border",
        day: "#DEE2E6",
        night: "#495057",
        description: "Borders"
      }
    ]
  },
  {
    name: "Semantic Colors",
    colors: [
      {
        name: "destructive",
        day: "#DC3545",
        night: "#DC3545",
        description: "Error/danger"
      },
      {
        name: "success",
        day: "#198754",
        night: "#20C997",
        description: "Success/confirmed"
      },
      {
        name: "warning",
        day: "#FFC107",
        night: "#FFC107",
        description: "Warning/attention"
      }
    ]
  }
];

/**
 * Validates all theme colors on the page
 */
export function validateAllThemeColors(): {isValid: boolean, issues: string[]} {
  // Only run in browser environment
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {isValid: true, issues: []};
  }
  
  const issues: string[] = [];
  const isDark = document.documentElement.classList.contains('dark');
  
  // Check if root element has correct theme class
  if (!document.documentElement.classList.contains('dark') && 
      !document.documentElement.classList.contains('light')) {
    issues.push("Root element missing theme class (dark or light)");
  }
  
  // Check body background
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const expectedBgColor = isDark ? "rgb(33, 37, 41)" : "rgb(248, 249, 250)"; 
  if (!bodyBg.includes(expectedBgColor.substring(0, 10))) {
    issues.push(`Body background color inconsistency. Expected: ${expectedBgColor}, Got: ${bodyBg}`);
  }
  
  // Check text color
  const bodyText = window.getComputedStyle(document.body).color;
  const expectedTextColor = isDark ? "rgb(248, 249, 250)" : "rgb(33, 37, 41)";
  if (!bodyText.includes(expectedTextColor.substring(0, 10))) {
    issues.push(`Body text color inconsistency. Expected: ${expectedTextColor}, Got: ${bodyText}`);
  }
  
  // Check a few key components
  try {
    // Check buttons
    const buttons = document.querySelectorAll('button[class*="btn-primary"], button[class*="bg-primary"]');
    buttons.forEach(button => {
      const buttonStyles = window.getComputedStyle(button);
      if (!buttonStyles.backgroundColor.includes("43, 138, 62") && // RGB values for #2B8A3E
          !buttonStyles.backgroundColor.includes("43,138,62")) {
        issues.push(`Primary button with inconsistent color: ${buttonStyles.backgroundColor}`);
      }
    });
    
    // Check cards
    const cards = document.querySelectorAll('.card, [class*="bg-card"]');
    cards.forEach(card => {
      const cardStyles = window.getComputedStyle(card);
      const expectedCardBg = isDark ? "rgb(52, 58, 64)" : "rgb(255, 255, 255)";
      if (!cardStyles.backgroundColor.includes(expectedCardBg.substring(0, 10))) {
        issues.push(`Card with inconsistent background: ${cardStyles.backgroundColor}`);
      }
    });
  } catch (error) {
    issues.push(`Error during theme validation: ${(error as Error).message}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Helper to normalize colors to a standard format
 */
function normalizeColor(color: string): string {
  // This is a simplified implementation
  return color.toLowerCase().trim();
}
