
import { useState, useEffect } from 'react';
import { isNetworkError } from '@/utils/errorHandling/isNetworkError';

export const useNetworkStatus = (error: Error) => {
  const [isChecking, setIsChecking] = useState(false);
  const networkError = isNetworkError(error);

  useEffect(() => {
    if (networkError) {
      setIsChecking(true);
      const timer = setTimeout(() => setIsChecking(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [networkError]);

  return {
    isNetworkError: networkError,
    isChecking
  };
};
