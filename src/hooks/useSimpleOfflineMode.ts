
import { useState, useEffect } from 'react';

export function useSimpleOfflineMode() {
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    // Function to update online status
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
      console.log("Network status changed:", navigator.onLine ? "online" : "offline");
    };

    // Add event listeners
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Periodic check as a safety measure
    const intervalId = setInterval(() => {
      const currentOfflineStatus = !navigator.onLine;
      if (currentOfflineStatus !== isOffline) {
        setIsOffline(currentOfflineStatus);
        console.log("Network status periodic check:", navigator.onLine ? "online" : "offline");
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
      clearInterval(intervalId);
    };
  }, [isOffline]);

  return { isOffline };
}
