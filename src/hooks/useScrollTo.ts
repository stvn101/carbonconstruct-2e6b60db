
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
      attempts = 20,        // Significantly increased max attempts from 15 to 20
      delay = 350,          // Increased delay between attempts 
      initialDelay = 1500   // Significantly increased initial delay for lazy-loaded content
    } = options;
    
    return (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation(); // Stop event bubbling
      }
      
      // Enhanced logging for debugging
      console.log(`🔄 Attempting to scroll to #${elementId} with initialDelay: ${initialDelay}ms`);
      
      // First try to directly access the element for immediate feedback
      const immediateElement = document.getElementById(elementId) || 
                              document.querySelector(`#${elementId}`) || 
                              document.querySelector(`[data-section="${elementId}"]`);
      
      if (immediateElement) {
        console.log(`✅ Found element ${elementId} immediately, applying instant pre-scroll...`);
        // Do a quick pre-scroll to give user immediate feedback, will be refined by the complete function
        immediateElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
      
      // Try to find the element multiple times with a delay
      // This helps with lazy-loaded components
      let currentAttempt = 0;
      
      const attemptScroll = () => {
        // Enhanced element finding strategies - much more exhaustive
        let element = null;
        
        // Try multiple strategies to find the element
        const selectors = [
          `#${elementId}`, // ID selector
          `[data-section="${elementId}"]`, // Data attribute
          `.${elementId}-section`, // Class based on ID
          `.features-section-loaded`, // Special class for features
          `[role="${elementId}"]`, // ARIA role
          `section[aria-label="${elementId.charAt(0).toUpperCase() + elementId.slice(1)} Section"]`, // ARIA label
          `section.${elementId}` // Section with class
        ];
        
        // Try each selector until we find the element
        for (const selector of selectors) {
          const found = document.querySelector(selector);
          if (found) {
            element = found;
            console.log(`✅ Found element using selector: ${selector}`);
            break;
          }
        }
        
        if (element) {
          console.log(`✅ Found element ${elementId} on attempt ${currentAttempt + 1}, scrolling now...`);
          
          // Multiple scroll methods for redundancy
          try {
            // Method 1: Standard scroll
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
              top: offsetPosition,
              behavior
            });
            
            // Method 2: Element's scrollIntoView as backup
            setTimeout(() => {
              element?.scrollIntoView({ 
                behavior, 
                block: 'start'
              });
              
              // Force focus on the element for accessibility
              element.setAttribute('tabindex', '-1');
              element.focus({ preventScroll: true });
            }, 100);
            
            // Dispatch a custom event that the scroll occurred
            document.dispatchEvent(new CustomEvent('scrolledToElement', { 
              detail: { id: elementId, success: true } 
            }));
            
            // Log success for debugging
            console.log(`📍 Scrolled to ${elementId} at position ${offsetPosition}`);
          } catch (error) {
            console.error("Error during scroll:", error);
            // Final fallback - use window.scrollTo with estimated position
            const roughEstimate = element.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo(0, roughEstimate);
          }
        } else {
          console.log(`❌ Element ${elementId} not found, attempt ${currentAttempt + 1} of ${attempts}`);
          
          // If we haven't reached the max attempts, try again with a delay
          if (currentAttempt < attempts - 1) {
            currentAttempt++;
            setTimeout(attemptScroll, delay);
          } else {
            console.error(`Failed to find element ${elementId} after ${attempts} attempts`);
            // Dispatch event that scroll failed
            document.dispatchEvent(new CustomEvent('scrollToElementFailed', { 
              detail: { id: elementId } 
            }));
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
