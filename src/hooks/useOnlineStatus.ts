
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  // Default to true if running on server or window.navigator is not available
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' && typeof navigator !== 'undefined' 
      ? navigator.onLine 
      : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Application is now online");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Application is now offline");
    };

    // Listen for network status changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check status actively every 30 seconds as a backup
    const intervalId = setInterval(() => {
      // Only update if there's a change to avoid unnecessary renders
      if (navigator.onLine !== isOnline) {
        setIsOnline(navigator.onLine);
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [isOnline]);

  return { isOnline };
}
