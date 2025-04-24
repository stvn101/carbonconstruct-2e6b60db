
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
  
  // Enhanced connection check that's more robust
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend) return;
    
    // Prevent multiple simultaneous checks
    if (isChecking) return;
    
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
        if (!backendConnected) {
          toast.success("Connection restored successfully!", { id: "connection-restored", duration: 3000 });
        }
      } else {
        // Increment check attempts
        setCheckAttempts(prev => prev + 1);
        
        // Only show error toast on first check or after significant interval
        if (checkAttempts === 0 || !lastChecked || (new Date().getTime() - lastChecked.getTime() > 30000)) {
          const message = checkAttempts > 2 
            ? "Connection issues persist. Some features may be limited until connection is restored."
            : "Unable to connect to the server. Some features may be unavailable.";
          
          toast.error(message, { 
            id: "connection-check-failed", 
            duration: 5000 
          });
        }
      }
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setBackendConnected(false);
      setCheckAttempts(prev => prev + 1);
      
      // Only show error toast if we haven't shown one recently
      if (!lastChecked || (new Date().getTime() - lastChecked.getTime() > 30000)) {
        toast.error("Connection check failed. Please check your internet connection.", { 
          id: "connection-check-failed", 
          duration: 5000 
        });
      }
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [isOnline, checkBackend, backendConnected, checkAttempts, lastChecked, isChecking]);

  // Check connectivity on mount and when network status changes
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
    }, 2000);
    
    // Set up periodic check only if online and after the initial check
    const intervalCheck = () => {
      if (isOnline && checkBackend) {
        const checkInterval = checkAttempts > 2 ? 15000 : 30000;
        const interval = setInterval(() => {
          checkBackendConnection();
        }, checkInterval);
        return interval;
      }
      return null;
    };
    
    const interval = intervalCheck();
    
    return () => {
      if (connectionCheckTimeoutRef.current) {
        clearTimeout(connectionCheckTimeoutRef.current);
      }
      if (interval) clearInterval(interval);
    };
  }, [isOnline, checkBackend, checkBackendConnection, checkAttempts]);

  // Force a new check when going from offline to online, with debounce
  useEffect(() => {
    if (isOnline && checkBackend) {
      // Add a small delay to prevent immediate check on connection flicker
      const timeout = setTimeout(() => {
        checkBackendConnection();
      }, 1500);
      
      return () => clearTimeout(timeout);
    }
  }, [isOnline, checkBackend, checkBackendConnection]);

  return {
    isOfflineMode: !isOnline || !backendConnected,
    isCheckingConnection: isChecking,
    lastConnectionCheck: lastChecked,
    checkConnection: checkBackendConnection,
    connectionAttempts: checkAttempts
  };
}
