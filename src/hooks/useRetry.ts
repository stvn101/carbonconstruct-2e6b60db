
import { useCallback, useEffect, useRef } from 'react';

export const useRetry = (
  options: {
    callback: () => Promise<void>;
    maxRetries: number;
    onMaxRetriesReached?: () => void;
    retryCount: number;
    setRetryCount: (count: number) => void;
  }
) => {
  const { callback, maxRetries, onMaxRetriesReached, retryCount, setRetryCount } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (retryCount < maxRetries) {
      const backoffDelay = Math.min(2000 * Math.pow(2, retryCount), 10000);
      
      timerRef.current = setTimeout(() => {
        setRetryCount(retryCount + 1);
        callback();
      }, backoffDelay);
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
    
    if (retryCount >= maxRetries) {
      onMaxRetriesReached?.();
    }
    
    return undefined;
  }, [retryCount, maxRetries, callback, setRetryCount, onMaxRetriesReached]);

  return {
    isRetrying: retryCount > 0 && retryCount < maxRetries,
    retryCount,
  };
};
