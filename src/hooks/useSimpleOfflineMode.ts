
import { useState, useEffect, useRef, useCallback } from 'react';

export function useSimpleOfflineMode() {
  // Initialize with the current online status
  const [isOffline, setIsOffline] = useState(() => {
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });
  
  // Use refs to prevent unnecessary re-renders and cleanup issues
  const mountedRef = useRef(true);

  // Memoized handlers to prevent re-renders
  const handleOnline = useCallback(() => {
    if (mountedRef.current) {
      setIsOffline(false);
    }
  }, []);
  
  const handleOffline = useCallback(() => {
    if (mountedRef.current) {
      setIsOffline(true);
    }
  }, []);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up event listeners and set mounted flag on unmount
    return () => {
      mountedRef.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]); // Dependencies now include the memoized handlers

  return { isOffline };
}
