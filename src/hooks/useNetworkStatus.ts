
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

  // Debounced setter for online status
  const setOnlineStatus = useCallback((status: boolean) => {
    // Clear any existing timeout
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a small debounce to prevent flashing on quick network changes
    debounceTimerRef.current = setTimeout(() => {
      // Only update and show toast if status actually changed
      if (wasOnlineRef.current !== status) {
        setIsOnline(status);
        wasOnlineRef.current = status;
        
        // Show appropriate toast
        if (status) {
          toast.dismiss('network-offline');
          toast.success("Connection restored! You're back online.", {
            id: 'network-online',
            duration: 3000
          });
        } else {
          toast.dismiss('network-online');
          toast.error("You're offline. Some features may be unavailable.", { 
            id: 'network-offline',
            duration: 0 // Keep showing until back online
          });
        }
      }
    }, 1000); // 1 second debounce
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  return { isOnline };
}
