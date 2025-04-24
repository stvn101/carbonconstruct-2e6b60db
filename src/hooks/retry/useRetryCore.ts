
import { useCallback, useEffect, useRef } from 'react';
import { calculateBackoffDelay, RetryOptions, RetryResult } from './retryUtils';

export const useRetryCore = (options: RetryOptions): RetryResult => {
  const { callback, maxRetries, onMaxRetriesReached, retryCount, setRetryCount } = options;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (retryCount < maxRetries) {
      const backoffDelay = calculateBackoffDelay(retryCount);
      
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
