
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { checkSupabaseConnection } from '@/services/supabase/connection';
import { toast } from 'sonner';

/**
 * Hook to determine if the application should run in offline mode
 * This checks both browser online status and Supabase connectivity
 * with improved reliability and memory management
 */
export function useOfflineMode(checkBackend: boolean = true) {
  const { isOnline } = useNetworkStatus();
  const [backendConnected, setBackendConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const connectionCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  
  // Track toast display to prevent toast spam
  const toastShownRef = useRef({
    failure: false,
    success: false,
    timestamp: 0,
    id: ''
  });
  
  // Cleanup function for unmounting
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      
      // Clear any pending timers
      if (connectionCheckTimeoutRef.current) {
        clearTimeout(connectionCheckTimeoutRef.current);
        connectionCheckTimeoutRef.current = null;
      }
      
      // Clear any toasts
      toast.dismiss("connection-check-failed");
      toast.dismiss("connection-restored");
    };
  }, []);
  
  // Enhanced connection check that's more robust
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend || !mountedRef.current) return false;
    
    // Prevent multiple simultaneous checks
    if (isChecking) return backendConnected;
    
    setIsChecking(true);
    try {
      // Clear any stale toasts
      toast.dismiss("connection-check-failed");
      
      const isConnected = await checkSupabaseConnection();
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setBackendConnected(isConnected);
      
        if (isConnected) {
          // Reset check attempts when connection succeeds
          setCheckAttempts(0);
          // Only show success toast if we previously thought we were disconnected
          if (!backendConnected && !toastShownRef.current.success) {
            toast.success("Connection restored successfully!", { id: "connection-restored", duration: 3000 });
            toastShownRef.current.success = true;
            toastShownRef.current.failure = false;
            
            // Reset success toast flag after a reasonable time
            setTimeout(() => {
              if (mountedRef.current) {
                toastShownRef.current.success = false;
              }
            }, 10000);
          }
        } else {
          // Increment check attempts
          setCheckAttempts(prev => prev + 1);
          
          const now = Date.now();
          // Only show error toast on first check or after significant interval
          if (
            checkAttempts === 0 || 
            !toastShownRef.current.failure ||
            (now - toastShownRef.current.timestamp > 30000)
          ) {
            const message = checkAttempts > 2 
              ? "Connection issues persist. Please check your network connection."
              : "Unable to connect to the server. Some features may be unavailable.";
            
            toast.error(message, { 
              id: "connection-check-failed", 
              duration: 5000 
            });
            
            toastShownRef.current.failure = true;
            toastShownRef.current.timestamp = now;
          }
        }
      }
      
      // Only update last checked time if component is still mounted
      if (mountedRef.current) {
        setLastChecked(new Date());
        setIsChecking(false);
      }
      
      return isConnected;
    } catch (error) {
      console.error('Error checking backend connection:', error);
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        setBackendConnected(false);
        setCheckAttempts(prev => prev + 1);
        setIsChecking(false);
        setLastChecked(new Date());
      }
      
      return false;
    }
  }, [isOnline, checkBackend, backendConnected, checkAttempts, isChecking]);

  // Check connectivity on mount and when network status changes with decreased frequency
  useEffect(() => {
    // Skip if component is unmounted
    if (!mountedRef.current) return;
    
    // Clear any existing timeout
    if (connectionCheckTimeoutRef.current) {
      clearTimeout(connectionCheckTimeoutRef.current);
      connectionCheckTimeoutRef.current = null;
    }
    
    // Initial check with slight delay to let app stabilize
    connectionCheckTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        connectionCheckTimeoutRef.current = null;
        checkBackendConnection();
      }
    }, 2000); // Reduced from 3000ms to 2000ms for faster feedback
    
    // Set up less frequent periodic checks
    const checkInterval = checkAttempts > 2 ? 45000 : 60000; // Increased intervals to reduce load
    const interval = setInterval(() => {
      if (mountedRef.current && isOnline && checkBackend) {
        checkBackendConnection();
      }
    }, checkInterval);
    
    return () => {
      if (connectionCheckTimeoutRef.current) {
        clearTimeout(connectionCheckTimeoutRef.current);
      }
      clearInterval(interval);
    };
  }, [isOnline, checkBackend, checkBackendConnection, checkAttempts]);

  // Force a new check when going from offline to online
  useEffect(() => {
    if (!mountedRef.current) return;
    
    if (isOnline && checkBackend && !backendConnected) {
      // Use a slightly longer delay to prevent immediate check on connection flicker
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
    checkConnection: checkBackendConnection,
    connectionAttempts: checkAttempts
  };
}
