
import { useState, useEffect } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { checkSupabaseConnection } from '@/services/supabseFallbackService';

/**
 * Hook to determine if the application should run in offline mode
 * This checks both browser online status and Supabase connectivity
 */
export function useOfflineMode(checkBackend: boolean = true) {
  const { isOnline } = useNetworkStatus();
  const [backendConnected, setBackendConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Check backend connectivity
  const checkBackendConnection = async () => {
    if (!isOnline || !checkBackend) return;
    
    setIsChecking(true);
    try {
      const isConnected = await checkSupabaseConnection();
      setBackendConnected(isConnected);
    } catch (error) {
      console.error('Error checking backend connection:', error);
      setBackendConnected(false);
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  // Check connectivity on mount and when network status changes
  useEffect(() => {
    checkBackendConnection();
    
    // Set up periodic check every 30 seconds if online
    const interval = isOnline && checkBackend ? 
      setInterval(checkBackendConnection, 30000) : 
      null;
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline, checkBackend]);

  // Force a new check when going from offline to online
  useEffect(() => {
    if (isOnline && checkBackend) {
      checkBackendConnection();
    }
  }, [isOnline]);

  return {
    isOfflineMode: !isOnline || !backendConnected,
    isCheckingConnection: isChecking,
    lastConnectionCheck: lastChecked,
    checkConnection: checkBackendConnection
  };
}
