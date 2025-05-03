
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

  // Handle connection check
  const checkConnection = useCallback(async () => {
    if (!mountedRef.current) return;
    
    try {
      // Simple fetch to check connection
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      
      if (mountedRef.current) {
        setIsOffline(!response.ok);
      }
    } catch (err) {
      if (mountedRef.current) {
        setIsOffline(true);
      }
    }
  }, []);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial connection check
    checkConnection();
    
    // Clean up event listeners and set mounted flag on unmount
    return () => {
      mountedRef.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, checkConnection]);

  return { 
    isOffline,
    checkConnection
  };
}
