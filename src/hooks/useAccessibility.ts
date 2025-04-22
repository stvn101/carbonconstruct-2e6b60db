
import { useEffect } from "react";

interface AccessibilityOptions {
  /**
   * Add keyboard navigation for interactive elements
   */
  enhanceKeyboardNavigation?: boolean;
  
  /**
   * Ensure proper focus management throughout the app
   */
  manageFocus?: boolean;
  
  /**
   * Add additional ARIA attributes to improve screen reader experience
   */
  enhanceAriaAttributes?: boolean;
}

/**
 * Hook to improve accessibility throughout the app
 */
export function useAccessibility(options: AccessibilityOptions = {}) {
  const { 
    enhanceKeyboardNavigation = true,
    manageFocus = true,
    enhanceAriaAttributes = true
  } = options;

  // Enhance keyboard navigation
  useEffect(() => {
    if (!enhanceKeyboardNavigation) return;
    
    // Add a visible outline to focused elements for keyboard users
    const style = document.createElement('style');
    style.innerHTML = `
      body:not(.using-mouse) :focus {
        outline: 2px solid hsl(123, 47%, 42%) !important;
        outline-offset: 2px !important;
      }
    `;
    document.head.appendChild(style);
    
    // Detect if user is using mouse or keyboard
    const handleMouseDown = () => {
      document.body.classList.add('using-mouse');
    };
    
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only remove class if Tab key is pressed
      if (event.key === 'Tab') {
        document.body.classList.remove('using-mouse');
      }
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
      document.head.removeChild(style);
    };
  }, [enhanceKeyboardNavigation]);
  
  // Focus management
  useEffect(() => {
    if (!manageFocus) return;

    // Create a "skip to content" link for keyboard users
    const existingSkipLink = document.getElementById('skip-to-content');
    if (!existingSkipLink) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-to-content';
      skipLink.href = '#main-content';
      skipLink.innerText = 'Skip to content';
      skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-carbon-600 text-white px-4 py-3 rounded-md';
      document.body.prepend(skipLink);
    }

    return () => {
      const skipLink = document.getElementById('skip-to-content');
      if (skipLink) {
        document.body.removeChild(skipLink);
      }
    };
  }, [manageFocus]);
  
  // Enhance ARIA attributes
  useEffect(() => {
    if (!enhanceAriaAttributes) return;
    
    // Find interactive elements missing labels or appropriate ARIA attributes
    const buttons = document.querySelectorAll('button:not([aria-label]):not(:has(*))');
    buttons.forEach((button) => {
      if (!button.textContent?.trim()) {
        console.warn('Button without accessible name found:', button);
      }
    });
    
    // Ensure form fields have associated labels
    const inputs = document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])');
    inputs.forEach((input) => {
      const inputId = input.getAttribute('id');
      if (inputId) {
        const hasLabel = document.querySelector(`label[for="${inputId}"]`);
        if (!hasLabel) {
          console.warn('Input without associated label:', input);
        }
      } else {
        console.warn('Input without id (cannot associate label):', input);
      }
    });
    
  }, [enhanceAriaAttributes]);
  
  return null;
}
