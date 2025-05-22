import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isNetworkError } from '@/utils/errorHandling/networkChecker';
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';

/**
 * A hook for detecting and managing offline status with network recovery
 * 
 * @returns {Object} Object containing offline status and functions to manage it
 */
export const useSimpleOfflineMode = () => {
  const [isOffline, setIsOffline] = useState<boolean>(false);
  
  // Check initial status on mount
  useEffect(() => {
    // First check navigator.onLine as a quick check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
      return;
    }
    
    // Do a more thorough check in the background
    const checkConnection = async () => {
      try {
        const isConnected = await checkNetworkStatus();
        setIsOffline(!isConnected);
      } catch (error) {
        // If the check itself fails, assume we're offline
        console.warn('Network check failed:', error);
        setIsOffline(true);
      }
    };
    
    checkConnection();
  }, []);
  
  // Add event listeners for online/offline events
  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("You're offline. Some features may be unavailable.");
    };
    
    const handleOnline = async () => {
      // Verify with a real connection check before showing as online
      try {
        const isConnected = await checkNetworkStatus();
        if (isConnected) {
          setIsOffline(false);
          toast.success("You're back online!");
        }
      } catch (error) {
        console.warn('Connection verification failed:', error);
        // Keep offline status if verification fails
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    
    return undefined;
  }, []);
  
  /**
   * Manually check connection status and update state
   */
  const checkConnection = async (): Promise<boolean> => {
    try {
      const isConnected = await checkNetworkStatus();
      setIsOffline(!isConnected);
      
      if (isConnected && isOffline) {
        toast.success("Connection restored!");
      } else if (!isConnected && !isOffline) {
        toast.warning("You're offline. Some features may be unavailable.");
      }
      
      return isConnected;
    } catch (error) {
      console.warn('Connection check failed:', error);
      setIsOffline(true);
      return false;
    }
  };
  
  /**
   * Manually set offline status
   */
  const setOfflineStatus = (status: boolean) => {
    setIsOffline(status);
  };
  
  return {
    isOffline,
    checkConnection,
    setOfflineStatus
  };
};
