
import { useState, useEffect, useCallback } from 'react';

interface OfflineOptions {
  onOffline?: () => void;
  onOnline?: () => void;
  checkInterval?: number;
}

export function useOfflineState(options: OfflineOptions = {}) {
  const { onOffline, onOnline, checkInterval = 30000 } = options;
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(
    navigator.onLine ? new Date() : null
  );
  
  // Check connection status when the component mounts and handle changes
  const checkConnection = useCallback(() => {
    const online = navigator.onLine;
    
    if (online && isOffline) {
      setIsOffline(false);
      setLastOnlineTime(new Date());
      onOnline?.();
    } else if (!online && !isOffline) {
      setIsOffline(true);
      onOffline?.();
    }
  }, [isOffline, onOffline, onOnline]);
  
  // Active ping to verify connection beyond navigator.onLine
  const pingServer = useCallback(async () => {
    if (!navigator.onLine) return;
    
    try {
      // Attempt to fetch a small resource with a cache-busting query param
      const response = await fetch(`/ping?_=${Date.now()}`, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        setIsOffline(true);
        onOffline?.();
      } else if (isOffline) {
        setIsOffline(false);
        setLastOnlineTime(new Date());
        onOnline?.();
      }
    } catch (error) {
      setIsOffline(true);
      onOffline?.();
    }
  }, [isOffline, onOffline, onOnline]);
  
  useEffect(() => {
    // Set up listeners for online/offline events
    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    // Check connection on mount
    checkConnection();
    
    // Set up interval to ping server periodically
    const intervalId = setInterval(pingServer, checkInterval);
    
    // Clean up
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
      clearInterval(intervalId);
    };
  }, [checkConnection, pingServer, checkInterval]);
  
  // Calculate time since last online state
  const getOfflineDuration = useCallback(() => {
    if (!isOffline || !lastOnlineTime) return 0;
    
    return Date.now() - lastOnlineTime.getTime();
  }, [isOffline, lastOnlineTime]);
  
  return {
    isOffline,
    lastOnlineTime,
    getOfflineDuration,
    checkConnection: pingServer // Expose this to allow manual checks
  };
}
