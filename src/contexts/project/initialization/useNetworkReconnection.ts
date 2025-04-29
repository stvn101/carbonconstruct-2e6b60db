
import { useEffect } from 'react';

/**
 * Hook to handle network reconnection events
 */
export const useNetworkReconnection = (
  user: any,
  hasInitialized: boolean,
  startDataInitialization: () => Promise<void>,
  resetConnectionRetries: () => void
) => {
  // Listen for online status changes to trigger reconnection
  useEffect(() => {
    const handleOnline = () => {
      if (user && !hasInitialized) {
        // Reset connection retries when network comes back
        resetConnectionRetries();
        // Small delay to let connection stabilize
        setTimeout(() => {
          startDataInitialization();
        }, 2000);
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user, hasInitialized, startDataInitialization, resetConnectionRetries]);
};
