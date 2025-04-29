
import { useEffect } from 'react';

/**
 * Hook to handle online/offline status changes
 */
export const useNetworkStatusEffect = (
  userId: string | undefined,
  hasInitializedRef: React.MutableRefObject<boolean>,
  reconnectionCountRef: React.MutableRefObject<number>,
  startDataInitialization: () => void
) => {
  useEffect(() => {
    const handleOnline = () => {
      if (userId && !hasInitializedRef.current) {
        // Reset connection retries when network comes back
        reconnectionCountRef.current = 0;
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
  }, [userId, hasInitializedRef, reconnectionCountRef, startDataInitialization]);
};
