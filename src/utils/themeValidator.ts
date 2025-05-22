
/**
 * Utility functions to validate theme consistency
 */

interface ValidationResult {
  isValid: boolean;
  issues: string[];
}

/**
 * Theme color palette for display in the theme test component
 * Provides a visual reference for all theme colors with their day/night values
 */
export const themeColorPalette = [
  {
    name: "Primary Colors",
    colors: [
      {
        name: "Primary",
        day: "hsl(var(--primary))",
        night: "hsl(var(--primary))",
        description: "Main brand color"
      },
      {
        name: "Primary Foreground",
        day: "hsl(var(--primary-foreground))",
        night: "hsl(var(--primary-foreground))",
        description: "Text on primary"
      },
      {
        name: "Secondary",
        day: "hsl(var(--secondary))",
        night: "hsl(var(--secondary))",
        description: "Secondary UI elements"
      },
      {
        name: "Secondary Foreground",
        day: "hsl(var(--secondary-foreground))",
        night: "hsl(var(--secondary-foreground))",
        description: "Text on secondary"
      }
    ]
  },
  {
    name: "UI Colors",
    colors: [
      {
        name: "Background",
        day: "hsl(var(--background))",
        night: "hsl(var(--background))",
        description: "Page background"
      },
      {
        name: "Foreground",
        day: "hsl(var(--foreground))",
        night: "hsl(var(--foreground))",
        description: "Main text color"
      },
      {
        name: "Card",
        day: "hsl(var(--card))",
        night: "hsl(var(--card))",
        description: "Card backgrounds"
      },
      {
        name: "Card Foreground",
        day: "hsl(var(--card-foreground))",
        night: "hsl(var(--card-foreground))",
        description: "Card text"
      }
    ]
  },
  {
    name: "Accent Colors",
    colors: [
      {
        name: "Accent",
        day: "hsl(var(--accent))",
        night: "hsl(var(--accent))",
        description: "Accent elements"
      },
      {
        name: "Accent Foreground",
        day: "hsl(var(--accent-foreground))",
        night: "hsl(var(--accent-foreground))",
        description: "Text on accent"
      },
      {
        name: "Destructive",
        day: "hsl(var(--destructive))",
        night: "hsl(var(--destructive))",
        description: "Error states"
      },
      {
        name: "Destructive Foreground",
        day: "hsl(var(--destructive-foreground))",
        night: "hsl(var(--destructive-foreground))",
        description: "Text on destructive"
      }
    ]
  },
  {
    name: "UI Utility Colors",
    colors: [
      {
        name: "Muted",
        day: "hsl(var(--muted))",
        night: "hsl(var(--muted))",
        description: "Subtle backgrounds"
      },
      {
        name: "Muted Foreground",
        day: "hsl(var(--muted-foreground))",
        night: "hsl(var(--muted-foreground))",
        description: "Subtle text"
      },
      {
        name: "Border",
        day: "hsl(var(--border))",
        night: "hsl(var(--border))",
        description: "Borders and dividers"
      },
      {
        name: "Ring",
        day: "hsl(var(--ring))",
        night: "hsl(var(--ring))",
        description: "Focus rings"
      }
    ]
  }
];

/**
 * Validates that all theme colors are correctly defined and applied
 * @returns ValidationResult with any issues found
 */
export function validateAllThemeColors(): ValidationResult {
  const issues: string[] = [];
  const root = document.documentElement;
  const style = getComputedStyle(root);
  
  // Core theme colors that should be defined
  const requiredColors = [
    'background',
    'foreground',
    'card',
    'card-foreground',
    'popover',
    'popover-foreground',
    'primary',
    'primary-foreground',
    'secondary',
    'secondary-foreground',
    'muted',
    'muted-foreground',
    'accent',
    'accent-foreground',
    'destructive',
    'destructive-foreground',
    'border',
    'input',
    'ring',
  ];
  
  // Check if all required colors are defined
  for (const color of requiredColors) {
    const colorValue = style.getPropertyValue(`--${color}`).trim();
    if (!colorValue) {
      issues.push(`Missing theme color definition: --${color}`);
    }
  }
  
  // Check contrast ratios for accessibility
  const backgroundHsl = style.getPropertyValue('--background').trim();
  const foregroundHsl = style.getPropertyValue('--foreground').trim();
  
  if (backgroundHsl && foregroundHsl) {
    try {
      const backgroundRgb = hslToRgb(backgroundHsl);
      const foregroundRgb = hslToRgb(foregroundHsl);
      const contrast = calculateContrastRatio(backgroundRgb, foregroundRgb);
      
      if (contrast < 4.5) {
        issues.push(`Insufficient contrast ratio (${contrast.toFixed(2)}) between background and foreground colors. WCAG AA requires at least 4.5:1.`);
      }
    } catch (error) {
      issues.push(`Error calculating contrast: ${(error as Error).message}`);
    }
  }
  
  // Check for consistent dark mode styling
  const isDarkMode = document.documentElement.classList.contains('dark');
  if (isDarkMode) {
    // Sample some key elements to ensure they have dark mode styling
    const dropdowns = document.querySelectorAll('[data-radix-popper-content-wrapper]');
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = dropdowns[i] as HTMLElement;
      const bgColor = window.getComputedStyle(dropdown).backgroundColor;
      
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        issues.push('Dropdowns have transparent backgrounds in dark mode, which may cause readability issues');
        break;
      }
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

/**
 * Convert HSL color string to RGB values
 * @param hsl HSL color string like "210 100% 50%"
 * @returns RGB values as [r, g, b]
 */
function hslToRgb(hsl: string): [number, number, number] {
  const [h, s, l] = hsl.split(' ').map(val => {
    return parseFloat(val.replace('%', '')) / (val.includes('%') ? 100 : 1);
  });
  
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hueToRgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hueToRgb(p, q, h + 1/3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1/3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ];
}

/**
 * Calculate the contrast ratio between two colors
 * @param rgb1 RGB values of first color
 * @param rgb2 RGB values of second color
 * @returns Contrast ratio (1-21)
 */
function calculateContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  // Calculate luminance for a color
  const luminance = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map(val => {
      val /= 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Detects if device is iOS
 */
export function isIOS(): boolean {
  return typeof navigator !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;
}

/**
 * Helper to apply iOS-specific styles
 */
export function applyIOSSpecificStyles() {
  if (isIOS()) {
    document.documentElement.classList.add('ios');
  }
}
