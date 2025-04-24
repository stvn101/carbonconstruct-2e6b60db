
import { useState, useEffect, useCallback } from 'react';
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
  
  // Enhanced connection check that's more robust
  const checkBackendConnection = useCallback(async () => {
    if (!isOnline || !checkBackend) return;
    
    setIsChecking(true);
    try {
      // Clear any stale toasts
      toast.dismiss("connection-check-failed");
      
      const isConnected = await checkSupabaseConnection();
      setBackendConnected(isConnected);
      
      if (isConnected) {
        // Only show success toast if we previously thought we were disconnected
        if (!backendConnected) {
          toast.success("Connection restored successfully!", { id: "connection-restored", duration: 3000 });
        }
      } else {
        toast.error("Unable to connect to the server. Some features may be unavailable.", { 
          id: "connection-check-failed", 
          duration: 5000 
        });
      }
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setBackendConnected(false);
      toast.error("Connection check failed. Please try again later.", { 
        id: "connection-check-failed", 
        duration: 5000 
      });
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  }, [isOnline, checkBackend, backendConnected]);

  // Check connectivity on mount and when network status changes
  useEffect(() => {
    // Initial check with slight delay to let app stabilize
    const initialCheck = setTimeout(() => {
      checkBackendConnection();
    }, 1000);
    
    // Set up periodic check every 30 seconds if online
    const interval = isOnline && checkBackend ? 
      setInterval(checkBackendConnection, 30000) : 
      null;
    
    return () => {
      clearTimeout(initialCheck);
      if (interval) clearInterval(interval);
    };
  }, [isOnline, checkBackend, checkBackendConnection]);

  // Force a new check when going from offline to online
  useEffect(() => {
    if (isOnline && checkBackend) {
      checkBackendConnection();
    }
  }, [isOnline, checkBackend, checkBackendConnection]);

  return {
    isOfflineMode: !isOnline || !backendConnected,
    isCheckingConnection: isChecking,
    lastConnectionCheck: lastChecked,
    checkConnection: checkBackendConnection
  };
}
