
import { useState, useEffect, useCallback, useRef } from 'react';
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';
import { pingSupabaseConnection } from '@/services/supabase/connection';
import { toast } from 'sonner';

/**
 * Hook to determine if the application should run in offline mode
 * This checks both browser online status and Supabase connectivity
 * with improved reliability
 */
export function useOfflineMode(checkBackend: boolean = true) {
  const { isOnline } = useNetworkStatus();
  const [backendConnected, setBackendConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const mountedRef = useRef(true);
  
  // Track toast display to prevent spam
  const toastShownRef = useRef({
    failure: false,
    success: false,
    timestamp: 0
  });
  
  // Helper to check navigator.online status
  function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(
      typeof navigator !== 'undefined' ? navigator.onLine : true
    );

    useEffect(() => {
      if (typeof window === 'undefined') return;
      
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);

    return { isOnline };
  }
  
  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      toast.dismiss("connection-check-failed");
      toast.dismiss("connection-restored");
    };
  }, []);
  
  // Connection check with simplified logic and reduced frequency
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend || !mountedRef.current || isChecking) {
      return backendConnected;
    }
    
    setIsChecking(true);
    setConnectionAttempts(prev => prev + 1);
    let isConnected = false;
    
    try {
      // Simplified connection check with longer timeout
      isConnected = await pingSupabaseConnection();
      
      if (mountedRef.current) {
        if (isConnected !== backendConnected) {
          setBackendConnected(isConnected);
          
          const now = Date.now();
          
          if (!isConnected && !toastShownRef.current.failure) {
            // Reduce frequency of offline toasts
            toast.error("Unable to connect to the server. Using offline mode.", { 
              id: "connection-check-failed", 
              duration: 5000 
            });
            
            toastShownRef.current.failure = true;
            toastShownRef.current.timestamp = now;
          } else if (isConnected && !toastShownRef.current.success && toastShownRef.current.failure) {
            toast.success("Connection restored successfully!", { 
              id: "connection-restored", 
              duration: 3000 
            });
            
            toastShownRef.current.success = true;
            toastShownRef.current.failure = false;
            
            // Reset toast flags after a reasonable time
            setTimeout(() => {
              if (mountedRef.current) {
                toastShownRef.current.success = false;
                toastShownRef.current.failure = false; // Reset failure flag too to allow future notifications
              }
            }, 60000); // 1 minute cooldown
          }
        }
        
        setLastChecked(new Date());
        setIsChecking(false);
      }
      
      return isConnected;
    } catch (error) {
      if (mountedRef.current) {
        setBackendConnected(false);
        setIsChecking(false);
        setLastChecked(new Date());
      }
      return false;
    }
  }, [isOnline, checkBackend, backendConnected, isChecking]);

  // Check connectivity less frequently to reduce unnecessary network traffic
  useEffect(() => {
    if (!mountedRef.current) return;
    
    // Initial check with slight delay to let app stabilize
    const initialTimer = setTimeout(() => {
      if (mountedRef.current) {
        checkBackendConnection();
      }
    }, 3000);
    
    // Perform checks less frequently (every 2 minutes instead of every minute)
    const intervalTimer = setInterval(() => {
      if (mountedRef.current && isOnline && checkBackend) {
        checkBackendConnection();
      }
    }, 120000); // 2 minutes
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isOnline, checkBackend, checkBackendConnection]);

  // Force a new check when going from offline to online
  useEffect(() => {
    if (!mountedRef.current) return;
    
    if (isOnline && checkBackend && !backendConnected) {
      const timeout = setTimeout(() => {
        if (mountedRef.current) {
          checkBackendConnection();
        }
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [isOnline, checkBackend, checkBackendConnection, backendConnected]);

  return {
    isOfflineMode: !isOnline || !backendConnected,
    isCheckingConnection: isChecking,
    lastConnectionCheck: lastChecked,
    connectionAttempts,
    checkConnection: checkBackendConnection
  };
}
