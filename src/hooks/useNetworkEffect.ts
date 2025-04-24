
import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { addNetworkListeners } from '@/utils/errorHandling';

/**
 * Hook to react to network connectivity changes with improved reliability
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
  const toastIdsRef = useRef<string[]>([]);
  
  // Helper to clear all network-related toasts
  const clearNetworkToasts = useCallback(() => {
    toastIdsRef.current.forEach(id => toast.dismiss(id));
    toastIdsRef.current = [];
  }, []);
  
  // Handle going offline with debouncing
  const handleOffline = useCallback(() => {
    // Prevent duplicate calls if already handled offline
    if (hasCalledOfflineRef.current) return;
    
    hasCalledOfflineRef.current = true;
    hasCalledOnlineRef.current = false;
    
    clearNetworkToasts();
    const id = "offline-status";
    toastIdsRef.current.push(id);
    
    toast.error("You're offline. Some features may be limited until connection is restored.", {
      id,
      duration: 0
    });
    
    // Call the provided callback
    onOffline();
  }, [onOffline, clearNetworkToasts]);
  
  // Handle coming back online with debouncing
  const handleOnline = useCallback(() => {
    // Prevent duplicate calls if already handled online
    if (hasCalledOnlineRef.current) return;
    
    hasCalledOnlineRef.current = true;
    hasCalledOfflineRef.current = false;
    
    clearNetworkToasts();
    const id = "online-status";
    toastIdsRef.current.push(id);
    
    toast.success("You're back online!", { 
      id,
      duration: 3000
    });
    
    // Call the provided callback
    onOnline();
  }, [onOnline, clearNetworkToasts]);

  useEffect(() => {
    // First check the current status
    const isCurrentlyOnline = navigator.onLine;
    
    // Set a small delay to prevent immediate actions on component mount
    setTimeout(() => {
      // Call the appropriate handler based on initial status
      if (!isCurrentlyOnline && !hasCalledOfflineRef.current) {
        handleOffline();
      } else if (isCurrentlyOnline && !hasCalledOnlineRef.current) {
        // Don't show the "back online" toast on initial load if we're already online
        hasCalledOnlineRef.current = true;
      }
    }, 500);
    
    // Set up listeners for future changes
    const cleanup = addNetworkListeners(handleOffline, handleOnline);
    
    return () => {
      cleanup();
      clearNetworkToasts();
    };
  }, [handleOffline, handleOnline, clearNetworkToasts]);
};
