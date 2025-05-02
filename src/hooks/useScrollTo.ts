
import { useCallback } from 'react';

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  attempts?: number;
  delay?: number;
  initialDelay?: number;
}

export const useScrollTo = () => {
  const scrollToElement = useCallback((elementId: string, options: ScrollOptions = {}) => {
    const { 
      offset = 80, 
      behavior = 'smooth',
      attempts = 10, // Increased from 5 to 10
      delay = 200,   // Increased from 100 to 200
      initialDelay = 300 // Added new initialDelay parameter
    } = options;
    
    return (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      // Log for debugging
      console.log(`Attempting to scroll to #${elementId} with initialDelay: ${initialDelay}ms`);
      
      // Try to find the element multiple times with a delay
      // This helps with lazy-loaded components
      let currentAttempt = 0;
      
      const attemptScroll = () => {
        // Try with getElementById first (most common)
        let element = document.getElementById(elementId);
        
        // If that fails, try with querySelector for more flexibility
        if (!element) {
          element = document.querySelector(`[id="${elementId}"]`);
        }
        
        // Also try with data-section attribute as fallback
        if (!element) {
          element = document.querySelector(`[data-section="${elementId}"]`);
        }
        
        if (element) {
          console.log(`Found element ${elementId} on attempt ${currentAttempt + 1}, scrolling now...`);
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior
          });
          
          // Force focus on the element for accessibility
          element.setAttribute('tabindex', '-1');
          element.focus({ preventScroll: true });
          
          // Log success for debugging
          console.log(`Scrolled to ${elementId} at position ${offsetPosition}`);
        } else {
          console.log(`Element ${elementId} not found, attempt ${currentAttempt + 1} of ${attempts}`);
          
          // If we haven't reached the max attempts, try again with a delay
          if (currentAttempt < attempts - 1) {
            currentAttempt++;
            setTimeout(attemptScroll, delay);
          } else {
            console.error(`Failed to find element ${elementId} after ${attempts} attempts`);
          }
        }
      };
      
      // Add the initial delay before the first attempt to ensure React has updated the DOM
      // This is crucial for lazy-loaded components
      setTimeout(attemptScroll, initialDelay);
    };
  }, []);

  return { scrollToElement };
};
