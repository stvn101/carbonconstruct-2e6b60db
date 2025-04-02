
import { useCallback } from 'react';

interface ScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
}

export const useScrollTo = () => {
  const scrollToElement = useCallback((elementId: string, options: ScrollOptions = {}) => {
    const { offset = 80, behavior = 'smooth' } = options;
    
    return (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
      }
      
      const element = document.getElementById(elementId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior
        });
      }
    };
  }, []);

  return { scrollToElement };
};
