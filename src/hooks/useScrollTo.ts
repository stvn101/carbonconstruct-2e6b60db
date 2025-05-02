
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
      offset = 100,         // Increased default offset for better positioning
      behavior = 'smooth',
      attempts = 15,        // Increased max attempts from 10 to 15
      delay = 300,          // Increased delay between attempts 
      initialDelay = 800    // Significantly increased initial delay for lazy-loaded content
    } = options;
    
    return (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      // Enhanced logging for debugging
      console.log(`⚡ Attempting to scroll to #${elementId} with initialDelay: ${initialDelay}ms`);
      
      // Try to find the element multiple times with a delay
      // This helps with lazy-loaded components
      let currentAttempt = 0;
      
      const attemptScroll = () => {
        // Enhanced element finding strategies
        let element = null;
        
        // Try with getElementById first (most common)
        element = document.getElementById(elementId);
        
        // If that fails, try with querySelector for more flexibility (by ID)
        if (!element) {
          element = document.querySelector(`#${elementId}`);
        }
        
        // Try with querySelector by data-section attribute as fallback
        if (!element) {
          element = document.querySelector(`[data-section="${elementId}"]`);
        }
        
        // Try finding by class name (new strategy)
        if (!element) {
          element = document.querySelector(`.${elementId}-section`);
        }
        
        // Try finding by features-section-loaded class (specific to our features section)
        if (!element && elementId === 'features') {
          element = document.querySelector(`.features-section-loaded`);
        }
        
        // Added aria role search for accessibility-focused elements
        if (!element) {
          element = document.querySelector(`[role="${elementId}"]`);
        }
        
        if (element) {
          console.log(`✅ Found element ${elementId} on attempt ${currentAttempt + 1}, scrolling now...`);
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
          console.log(`📍 Scrolled to ${elementId} at position ${offsetPosition}`);
        } else {
          console.log(`❌ Element ${elementId} not found, attempt ${currentAttempt + 1} of ${attempts}`);
          
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
      console.log(`⏱️ Waiting ${initialDelay}ms before first attempt...`);
      setTimeout(attemptScroll, initialDelay);
    };
  }, []);

  return { scrollToElement };
};
