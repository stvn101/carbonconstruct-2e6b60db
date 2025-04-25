
import { useState, useEffect, useCallback, useRef } from 'react';
import { checkNetworkStatus, showErrorToast, showSuccessToast } from '@/utils/errorHandling';

/**
 * Improved hook for detecting network status with better reliability for unstable connections
 */
export function useNetworkStatus(options = { showToasts: true }) {
  // Start with navigator.onLine but consider it's not always accurate
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  
  // Use refs to track state between renders and prevent memory leaks
  const wasOnlineRef = useRef(isOnline);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const healthCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const offlineDetectionCountRef = useRef(0);
  
  // Improved debounced status setter with better reliability
  const setOnlineStatus = useCallback((status: boolean) => {
    // Skip updates after unmount
    if (!mountedRef.current) return;
    
    // Clear any pending status changes
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    // Status hasn't changed, no need to update
    if (wasOnlineRef.current === status) return;
    
    if (status) {
      // When going online:
      // 1. Reset detection counter
      // 2. Update status relatively quickly
      // 3. Show toast if needed
      offlineDetectionCountRef.current = 0;
      
      // Increased debounce from 2000ms to 5000ms (5s)
      // This helps ensure we're truly online before updating UI
      debounceTimerRef.current = setTimeout(() => {
        if (!mountedRef.current) return;
        
        setIsOnline(status);
        wasOnlineRef.current = status;
        
        // Only show toast if configured and we were previously offline
        if (options.showToasts) {
          showSuccessToast("Connection restored! You're back online.", 'network-online');
          // Remove any offline toasts
          showErrorToast("", 'network-offline', { duration: 1 });
        }
      }, 5000);
    } else {
      // When going offline:
      // 1. Increment the detection counter
      // 2. Only update after multiple detections
      // 3. Use longer debounce to prevent flickering
      offlineDetectionCountRef.current += 1;
      
      // Require multiple consecutive offline detections
      // This prevents momentary network blips from triggering offline state
      if (offlineDetectionCountRef.current >= 3) {
        // Increased debounce from 3000ms to 6000ms (6s)
        debounceTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          
          setIsOnline(status);
          wasOnlineRef.current = status;
          
          // Show toast if configured
          if (options.showToasts) {
            showErrorToast("You're offline. Some features may be unavailable.", 'network-offline', {
              persistent: true
            });
          }
        }, 6000);
      } else {
        // First/second offline detection, wait before confirming
        debounceTimerRef.current = setTimeout(() => {
          // Reset counter if we're now online
          if (navigator.onLine) {
            offlineDetectionCountRef.current = 0;
          }
        }, 4000);
      }
    }
  }, [options.showToasts]);

  // Effect for listening to network events and performing health checks
  useEffect(() => {
    mountedRef.current = true;
    
    const handleOnline = async () => {
      // Verify we're really online with a health check
      const reallyOnline = await checkNetworkStatus();
      setOnlineStatus(reallyOnline);
    };
    
    const handleOffline = () => {
      setOnlineStatus(false);
    };

    // Listen for standard browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for custom app:offline event
    window.addEventListener('app:offline', handleOffline);

    // Check current status when component mounts
    const checkCurrentStatus = async () => {
      if (!mountedRef.current) return;
      
      const status = await checkNetworkStatus();
      
      // Only update if different from current state
      if (status !== isOnline) {
        setOnlineStatus(status);
      }
    };
    
    // Initial check with slight delay
    const initialCheckTimer = setTimeout(checkCurrentStatus, 1000);
    
    // Periodically check network status (90s instead of 60s)
    // This will help catch cases where browser thinks we're online but we're not
    // while reducing battery usage and network traffic
    healthCheckTimerRef.current = setInterval(checkCurrentStatus, 90000);

    return () => {
      mountedRef.current = false;
      
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (healthCheckTimerRef.current) {
        clearInterval(healthCheckTimerRef.current);
      }
      clearTimeout(initialCheckTimer);
      
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('app:offline', handleOffline);
    };
  }, [isOnline, setOnlineStatus]);

  return { isOnline };
}

export default useNetworkStatus;
