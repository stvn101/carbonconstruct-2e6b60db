
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
    name: "Primary",
    colors: [
      {
        name: "background",
        day: "#F8F9FA",
        night: "#212529",
        description: "Main background color"
      },
      {
        name: "foreground",
        day: "#212529",
        night: "#F8F9FA",
        description: "Main text color"
      },
      {
        name: "accent",
        day: "#2B8A3E",
        night: "#2B8A3E",
        description: "Primary accent/action color"
      }
    ]
  },
  {
    name: "Secondary",
    colors: [
      {
        name: "secondary-bg",
        day: "#E9ECEF",
        night: "#343A40",
        description: "Secondary background color"
      },
      {
        name: "muted",
        day: "#6C757D",
        night: "#ADB5BD",
        description: "Muted/subtle text"
      }
    ]
  },
  {
    name: "Components",
    colors: [
      {
        name: "card",
        day: "#FFFFFF",
        night: "#343A40",
        description: "Card background"
      },
      {
        name: "border",
        day: "#DEE2E6",
        night: "#495057",
        description: "Border color"
      }
    ]
  }
];

/**
 * Validates if a color is used consistently
 */
export function validateColorConsistency(
  elementSelector: string,
  propertyName: string,
  expectedColor: string
): boolean {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') return true;
  
  try {
    const elements = document.querySelectorAll(elementSelector);
    let isConsistent = true;
    
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const actualColor = computedStyle.getPropertyValue(propertyName);
      
      // Convert colors to a standard format for comparison
      const normalizedActual = normalizeColor(actualColor);
      const normalizedExpected = normalizeColor(expectedColor);
      
      if (normalizedActual !== normalizedExpected) {
        console.warn(
          `Theme inconsistency detected on ${elementSelector}`,
          `Expected ${propertyName} to be ${expectedColor}`,
          `Got ${actualColor} instead`
        );
        isConsistent = false;
      }
    });
    
    return isConsistent;
  } catch (error) {
    console.error("Error while validating color consistency:", error);
    return false;
  }
}

/**
 * Helper to normalize colors to a standard format
 */
function normalizeColor(color: string): string {
  // This is a simplified implementation
  // In a real app, you'd want to convert all formats (hex, rgb, hsl) to a single format
  return color.toLowerCase().trim();
}

/**
 * Validate all theme colors on the page
 */
export function validateAllThemeColors(): {isValid: boolean, issues: string[]} {
  // Only run in development mode
  if (process.env.NODE_ENV !== 'development') {
    return {isValid: true, issues: []};
  }
  
  const issues: string[] = [];
  const isDark = document.documentElement.classList.contains('dark');
  
  // Check body background
  const bodyBg = window.getComputedStyle(document.body).backgroundColor;
  const expectedBg = isDark ? "#212529" : "#F8F9FA";
  if (normalizeColor(bodyBg) !== normalizeColor(expectedBg)) {
    issues.push(`Body background color mismatch. Expected: ${expectedBg}, Got: ${bodyBg}`);
  }
  
  // Check text color
  const bodyText = window.getComputedStyle(document.body).color;
  const expectedText = isDark ? "#F8F9FA" : "#212529"; 
  if (normalizeColor(bodyText) !== normalizeColor(expectedText)) {
    issues.push(`Body text color mismatch. Expected: ${expectedText}, Got: ${bodyText}`);
  }
  
  // Check primary buttons
  document.querySelectorAll('button.btn-primary').forEach(button => {
    const buttonBg = window.getComputedStyle(button).backgroundColor;
    if (normalizeColor(buttonBg) !== normalizeColor("#2B8A3E")) {
      issues.push(`Button background color mismatch on ${button}`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues
  };
}
