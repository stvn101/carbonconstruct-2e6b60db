
import { useEffect } from 'react';
import { toast } from 'sonner';
import { addNetworkListeners } from '@/utils/errorHandling';

export const useNetworkEffect = (
  onOffline: () => void,
  onOnline: () => void,
) => {
  useEffect(() => {
    const cleanup = addNetworkListeners(
      () => {
        toast.error("You're offline. Some features may be limited until connection is restored.", {
          id: "offline-status",
          duration: 0
        });
        onOffline();
      },
      () => {
        toast.dismiss("offline-status");
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
