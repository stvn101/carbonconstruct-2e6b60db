
import { useState, useEffect, useRef } from 'react';

export function useSimpleOfflineMode() {
  // Initialize with the current online status
  const [isOffline, setIsOffline] = useState(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  
  // Use refs to prevent unnecessary re-renders and cleanup issues
  const mountedRef = useRef(true);

  useEffect(() => {
    // Functions to update offline status
    const handleOnline = () => {
      if (mountedRef.current) {
        setIsOffline(false);
      }
    };
    
    const handleOffline = () => {
      if (mountedRef.current) {
        setIsOffline(true);
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners and set mounted flag on unmount
    return () => {
      mountedRef.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Empty dependency array ensures this only runs once

  return { isOffline };
}
