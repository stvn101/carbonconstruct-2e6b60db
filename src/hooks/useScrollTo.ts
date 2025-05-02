
import { useCallback } from 'react';

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  attempts?: number;
  delay?: number;
}

export const useScrollTo = () => {
  const scrollToElement = useCallback((elementId: string, options: ScrollOptions = {}) => {
    const { 
      offset = 80, 
      behavior = 'smooth',
      attempts = 5,
      delay = 100
    } = options;
    
    return (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      // Try to find the element multiple times with a delay
      // This helps with lazy-loaded components
      let currentAttempt = 0;
      
      const attemptScroll = () => {
        const element = document.getElementById(elementId);
        
        if (element) {
          console.log(`Found element ${elementId}, scrolling now...`);
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior
          });
          
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
      
      // Add a small delay before the first attempt to ensure React has updated the DOM
      setTimeout(attemptScroll, delay);
    };
  }, []);

  return { scrollToElement };
};
