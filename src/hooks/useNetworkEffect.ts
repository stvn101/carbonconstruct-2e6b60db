
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { addNetworkListeners } from '@/utils/errorHandling';

/**
 * Hook to react to network connectivity changes
 * 
 * @param onOffline Function to call when the network goes offline
 * @param onOnline Function to call when the network comes back online
 */
export const useNetworkEffect = (
  onOffline: () => void,
  onOnline: () => void,
) => {
  const hasCalledOnlineRef = useRef(false);
  const hasCalledOfflineRef = useRef(false);

  useEffect(() => {
    // First check the current status
    const isCurrentlyOnline = navigator.onLine;
    
    // Call the appropriate handler based on initial status
    if (!isCurrentlyOnline && !hasCalledOfflineRef.current) {
      hasCalledOfflineRef.current = true;
      onOffline();
      toast.error("You're offline. Some features may be limited until connection is restored.", {
        id: "offline-status-initial",
        duration: 0
      });
    } else if (isCurrentlyOnline && !hasCalledOnlineRef.current) {
      hasCalledOnlineRef.current = true;
    }
    
    // Set up listeners for future changes
    const cleanup = addNetworkListeners(
      () => {
        // Prevent duplicate calls if already handled offline
        if (hasCalledOfflineRef.current) return;
        
        hasCalledOfflineRef.current = true;
        hasCalledOnlineRef.current = false;
        toast.error("You're offline. Some features may be limited until connection is restored.", {
          id: "offline-status",
          duration: 0
        });
        onOffline();
      },
      () => {
        // Prevent duplicate calls if already handled online
        if (hasCalledOnlineRef.current) return;
        
        hasCalledOnlineRef.current = true;
        hasCalledOfflineRef.current = false;
        toast.dismiss("offline-status");
        toast.dismiss("offline-status-initial");
        toast.success("You're back online!", { 
          id: "online-status",
          duration: 3000
        });
        onOnline();
      }
    );
    
    return cleanup;
  }, [onOffline, onOnline]);
};
