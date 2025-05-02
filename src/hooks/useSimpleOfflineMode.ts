
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * A simplified hook to determine if the app is currently offline
 * with reduced complexity and network calls
 */
export function useSimpleOfflineMode() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Simple connection check that doesn't make network requests 
  // unless explicitly called
  const checkConnection = useCallback(async () => {
    // Just use navigator.onLine as a base check
    const isOnline = navigator.onLine;
    
    if (isOnline !== !isOffline) {
      setIsOffline(!isOnline);
      
      // Show appropriate toast based on current status
      if (isOnline) {
        toast.success("Connection restored!", {
          id: "connection-restored",
          duration: 3000
        });
      } else {
        toast.error("You're offline. Some features may be limited.", {
          id: "offline-mode", 
          duration: 5000
        });
      }
    }
    
    return isOnline;
  }, [isOffline]);

  // Basic event listeners for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("Connection restored!", {
        id: "connection-restored",
        duration: 3000
      });
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.error("You're offline. Some features may be limited.", {
        id: "offline-mode",
        duration: 5000
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clean up any toasts
      toast.dismiss("offline-mode");
      toast.dismiss("connection-restored");
    };
  }, []);

  return { isOffline, checkConnection };
}
