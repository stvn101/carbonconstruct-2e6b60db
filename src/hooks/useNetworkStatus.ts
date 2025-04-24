
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  // Use ref to track the last state to prevent duplicate toasts
  const wasOnlineRef = useRef(isOnline);
  // Debounce timer to prevent flashing on quick network changes
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  // Track consecutive offline detections to increase confidence
  const offlineDetectionCountRef = useRef(0);
  // Timer for periodic health checks
  const healthCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced setter for online status with improved stability
  const setOnlineStatus = useCallback((status: boolean) => {
    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    if (status) {
      // When going online, reset the counter and apply change more quickly
      offlineDetectionCountRef.current = 0;
      debounceTimerRef.current = setTimeout(() => {
        if (wasOnlineRef.current !== status) {
          setIsOnline(status);
          wasOnlineRef.current = status;
          
          // Show toast only if we were previously offline
          toast.dismiss('network-offline');
          toast.success("Connection restored! You're back online.", {
            id: 'network-online',
            duration: 3000
          });
        }
      }, 500); // Shorter delay for online status for better responsiveness
    } else {
      // When going offline, increase the counter and require multiple detections
      offlineDetectionCountRef.current += 1;
      
      // Only consider offline after consecutive offline detections
      // This prevents momentary network fluctuations from triggering offline state
      if (offlineDetectionCountRef.current >= 2) {
        debounceTimerRef.current = setTimeout(() => {
          if (wasOnlineRef.current !== status) {
            setIsOnline(status);
            wasOnlineRef.current = status;
            
            toast.dismiss('network-online');
            toast.error("You're offline. Some features may be unavailable.", { 
              id: 'network-offline',
              duration: 0 // Keep showing until back online
            });
          }
        }, 1500); // Slightly shorter delay for offline status for better UX
      } else {
        // If it's the first offline detection, set a short timeout to check again
        debounceTimerRef.current = setTimeout(() => {
          // If we're back online by now, reset the counter
          if (navigator.onLine) {
            offlineDetectionCountRef.current = 0;
          }
        }, 1000);
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic health check to detect partial network issues
    healthCheckTimerRef.current = setInterval(() => {
      // If the browser thinks we're online but connectivity is actually partial,
      // this can trigger a more accurate state
      if (navigator.onLine) {
        fetch('/favicon.ico', { 
          method: 'HEAD', 
          cache: 'no-store',
          // Add a timeout to prevent hanging requests
          signal: AbortSignal.timeout(3000)
        })
        .catch(() => {
          // Only consider offline if we can't reach our own server
          // and multiple checks fail
          if (offlineDetectionCountRef.current < 2) {
            offlineDetectionCountRef.current += 1;
          } else {
            setOnlineStatus(false);
          }
        });
      }
    }, 30000); // Check every 30 seconds

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (healthCheckTimerRef.current) {
        clearInterval(healthCheckTimerRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      // Clear toasts on unmount to prevent stuck messages
      toast.dismiss('network-online');
      toast.dismiss('network-offline');
    };
  }, [setOnlineStatus]);

  return { isOnline };
}
