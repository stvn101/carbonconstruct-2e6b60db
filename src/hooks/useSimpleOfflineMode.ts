
import { useState, useEffect } from 'react';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandling/simpleToastHandler';

/**
 * Simplified hook to detect offline status
 */
export function useSimpleOfflineMode() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      showSuccessToast("You're back online!");
    }
    
    function handleOffline() {
      setIsOffline(true);
      showErrorToast("You're offline. Some features may be unavailable.", 5000);
    }
    
    // Set up listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setIsOffline(!navigator.onLine);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    isOffline,
    checkConnection: () => setIsOffline(!navigator.onLine)
  };
}
