
import { useEffect } from 'react';

interface UseA11yOptions {
  title?: string;
  announceRouteChanges?: boolean;
  focusMainContentOnRouteChange?: boolean;
}

/**
 * Hook to improve accessibility throughout the app
 */
export function useA11y(options: UseA11yOptions = {}) {
  const { 
    title, 
    announceRouteChanges = true,
    focusMainContentOnRouteChange = true
  } = options;

  // Update document title when component mounts or title changes
  useEffect(() => {
    if (title) {
      const prevTitle = document.title;
      document.title = title.includes('CarbonConstruct') 
        ? title 
        : `${title} | CarbonConstruct`;
      
      return () => {
        document.title = prevTitle;
      };
    }
  }, [title]);

  // Handle page navigation announcements for screen readers
  useEffect(() => {
    if (announceRouteChanges) {
      // Create or use existing aria-live region
      let announcer = document.getElementById('route-announcer');
      
      if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'route-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.padding = '0';
        announcer.style.overflow = 'hidden';
        announcer.style.clip = 'rect(0, 0, 0, 0)';
        announcer.style.whiteSpace = 'nowrap';
        announcer.style.border = '0';
        document.body.appendChild(announcer);
      }
      
      // Announce the page change
      if (title) {
        announcer.textContent = `Navigated to ${title}`;
      }
      
      return () => {
        if (announcer && !announceRouteChanges) {
          document.body.removeChild(announcer);
        }
      };
    }
  }, [announceRouteChanges, title]);
  
  // Focus main content area when route changes
  useEffect(() => {
    if (focusMainContentOnRouteChange) {
      const mainContent = document.querySelector('main') || document.querySelector('#main-content');
      
      if (mainContent) {
        // Only set focus if the element doesn't have focus
        if (document.activeElement !== mainContent) {
          // Add tabIndex if not focusable, but remove it right after
          const hasTabIndex = mainContent.hasAttribute('tabindex');
          
          if (!hasTabIndex) {
            mainContent.setAttribute('tabindex', '-1');
          }
          
          mainContent.focus({ preventScroll: true });
          
          if (!hasTabIndex) {
            mainContent.removeAttribute('tabindex');
          }
        }
      }
    }
  }, [focusMainContentOnRouteChange]);
  
  return null;
}
