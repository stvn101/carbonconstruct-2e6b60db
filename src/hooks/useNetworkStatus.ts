
import { useState, useEffect } from 'react';
import { isNetworkError } from '@/utils/errorHandling/networkChecker';

export const useNetworkStatus = (error?: Error) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const networkError = error ? isNetworkError(error) : false;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (networkError) {
      setIsChecking(true);
      const timer = setTimeout(() => setIsChecking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [networkError]);

  return {
    isNetworkError: networkError,
    isChecking,
    isOnline
  };
};
