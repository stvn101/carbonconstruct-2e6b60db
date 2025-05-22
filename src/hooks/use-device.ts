
import { useState, useEffect } from 'react';

// Define breakpoints that match our CSS media queries
const MOBILE_BREAKPOINT = 640; // Matches sm: in Tailwind
const TABLET_BREAKPOINT = 768; // Matches md: in Tailwind

/**
 * A hook that provides information about the user's device based on screen width
 */
export function useDevice() {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  useEffect(() => {
    // Only run this if in the browser environment
    if (typeof window === 'undefined') return;

    // Update the window width when it changes
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    // Add event listener and handle initial sizing
    window.addEventListener('resize', handleResize);
    handleResize();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Determine device type based on window width
  const isMobile = windowWidth <= MOBILE_BREAKPOINT;
  const isTablet = windowWidth > MOBILE_BREAKPOINT && windowWidth <= TABLET_BREAKPOINT;
  const isDesktop = windowWidth > TABLET_BREAKPOINT;
  
  // Detect iOS specifically
  const isIOS = 
    typeof window !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream;
    
  // Detect touch capability
  const hasTouch = 
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return {
    windowWidth,
    isMobile,
    isTablet,
    isDesktop,
    isIOS,
    hasTouch,
  };
}
