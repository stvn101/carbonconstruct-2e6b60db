
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { checkSupabaseConnection } from '@/services/supabseFallbackService';
import { toast } from 'sonner';

/**
 * Hook to determine if the application should run in offline mode
 * This checks both browser online status and Supabase connectivity
 */
export function useOfflineMode(checkBackend: boolean = true) {
  const { isOnline } = useNetworkStatus();
  const [backendConnected, setBackendConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [checkAttempts, setCheckAttempts] = useState(0);
  const connectionCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track toast display to prevent toast spam
  const toastShownRef = useRef({
    failure: false,
    success: false,
    timestamp: 0
  });
  
  // Enhanced connection check that's more robust
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend) return false;
    
    // Prevent multiple simultaneous checks
    if (isChecking) return backendConnected;
    
    setIsChecking(true);
    try {
      // Clear any stale toasts
      toast.dismiss("connection-check-failed");
      
      const isConnected = await checkSupabaseConnection();
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
            toastShownRef.current.success = false;
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
      
      return isConnected;
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setBackendConnected(false);
      setCheckAttempts(prev => prev + 1);
      
      return false;
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [isOnline, checkBackend, backendConnected, checkAttempts, isChecking]);

  // Check connectivity on mount and when network status changes with decreased frequency
  useEffect(() => {
    // Clear any existing timeout
    if (connectionCheckTimeoutRef.current) {
      clearTimeout(connectionCheckTimeoutRef.current);
      connectionCheckTimeoutRef.current = null;
    }
    
    // Initial check with slight delay to let app stabilize
    connectionCheckTimeoutRef.current = setTimeout(() => {
      connectionCheckTimeoutRef.current = null;
      checkBackendConnection();
    }, 3000); // Increased from 2000ms to 3000ms for more stability
    
    // Set up less frequent periodic checks
    const checkInterval = checkAttempts > 2 ? 30000 : 60000; // Increased intervals
    const interval = setInterval(() => {
      if (isOnline && checkBackend) {
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

  // Force a new check when going from offline to online, with longer debounce
  useEffect(() => {
    if (isOnline && checkBackend && !backendConnected) {
      // Longer delay to prevent immediate check on connection flicker
      const timeout = setTimeout(() => {
        checkBackendConnection();
      }, 2500); // Increased from 1500ms to 2500ms
      
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
