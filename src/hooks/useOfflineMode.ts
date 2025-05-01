
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { checkSupabaseConnection, pingSupabaseConnection } from '@/services/supabase/connection';
import { toast } from 'sonner';

/**
 * Hook to determine if the application should run in offline mode
 * This checks both browser online status and Supabase connectivity
 * with improved reliability and recovery mechanisms
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
    id: '',
    recoveryInProgress: false
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
  
  // Enhanced connection check with fallback mechanisms
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend || !mountedRef.current) return false;
    
    // Prevent multiple simultaneous checks
    if (isChecking) return backendConnected;
    
    setIsChecking(true);
    let isConnected = false;
    
    try {
      // Clear any stale toasts
      toast.dismiss("connection-check-failed");
      
      // Try the main connection check first
      isConnected = await checkSupabaseConnection();
      
      // If that fails, try the simpler ping as fallback
      if (!isConnected) {
        console.log("Primary connection check failed, trying fallback ping...");
        isConnected = await pingSupabaseConnection();
      }
      
      // Only update state if component is still mounted
      if (mountedRef.current) {
        // Don't update state unless it's actually changing to reduce rerenders
        if (isConnected !== backendConnected) {
          setBackendConnected(isConnected);
        }
      
        if (isConnected) {
          // Reset check attempts when connection succeeds
          setCheckAttempts(0);
          
          // Only show success toast if we previously thought we were disconnected
          // and we're not spamming the user with messages
          if (!backendConnected && !toastShownRef.current.success && toastShownRef.current.failure) {
            toast.success("Connection restored successfully!", { 
              id: "connection-restored", 
              duration: 3000 
            });
            
            toastShownRef.current.success = true;
            toastShownRef.current.failure = false;
            toastShownRef.current.recoveryInProgress = false;
            
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
          // and don't show while actively trying to recover
          if (
            !toastShownRef.current.recoveryInProgress && 
            (checkAttempts === 0 || 
             !toastShownRef.current.failure ||
             (now - toastShownRef.current.timestamp > 45000))
          ) {
            const message = checkAttempts > 2 
              ? "Connection issues persist. Attempting to reconnect..."
              : "Unable to connect to the server. Using offline mode.";
            
            toast.error(message, { 
              id: "connection-check-failed", 
              duration: 5000 
            });
            
            toastShownRef.current.failure = true;
            toastShownRef.current.timestamp = now;
            
            // If we're not already in recovery mode, start the recovery process
            if (!toastShownRef.current.recoveryInProgress && mountedRef.current) {
              toastShownRef.current.recoveryInProgress = true;
              scheduleConnectionRecovery();
            }
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

  // New function to schedule connection recovery attempts with exponential backoff
  const scheduleConnectionRecovery = useCallback(() => {
    if (!mountedRef.current) return;
    
    // Clear any existing recovery timer
    if (connectionCheckTimeoutRef.current) {
      clearTimeout(connectionCheckTimeoutRef.current);
    }
    
    // Calculate delay based on attempts (1s, 2s, 4s, 8s, max 15s)
    const delay = Math.min(1000 * Math.pow(2, checkAttempts), 15000);
    
    console.log(`Scheduling connection recovery in ${delay}ms (attempt #${checkAttempts + 1})`);
    
    connectionCheckTimeoutRef.current = setTimeout(() => {
      if (mountedRef.current) {
        connectionCheckTimeoutRef.current = null;
        checkBackendConnection();
      }
    }, delay);
  }, [checkAttempts, checkBackendConnection]);

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
    
    // Set up periodic checks with decreasing frequency as app runs
    const checkInterval = checkAttempts > 2 ? 60000 : 30000; // 30s initially, 60s after repeated failures
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
      }, 1500); // Reduced from 2000ms to 1500ms
      
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
