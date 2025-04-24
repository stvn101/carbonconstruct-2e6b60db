import { useEffect, useState, useCallback } from 'react';
import { calculateBackoffDelay, RetryOptions, RetryResult } from './retryUtils';

/**
 * Hook for implementing retry logic with exponential backoff
 * @param options Retry configuration options
 * @returns Retry state and control functions
 */
export function useRetryCore({
  callback,
  maxRetries,
  onMaxRetriesReached,
  retryCount,
  setRetryCount
}: RetryOptions): RetryResult {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryTimeoutId, setRetryTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Clean up any existing timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [retryTimeoutId]);

  // Handle retry logic when retry count changes
  useEffect(() => {
    // Skip if we're not in a retry state or if we've reached max retries
    if (retryCount === 0 || retryCount > maxRetries) return;

    // Set retrying state
    setIsRetrying(true);
    
    try {
      // Calculate delay with exponential backoff
      const delay = calculateBackoffDelay(retryCount);
      
      // Clear any existing timeout
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
      
      // Set up the next retry attempt
      const timeoutId = setTimeout(async () => {
        try {
          await callback();
          // If successful, reset retry count
          setRetryCount(0);
          setIsRetrying(false);
        } catch (error) {
          // If we've reached max retries, trigger the callback and stop
          if (retryCount >= maxRetries) {
            if (onMaxRetriesReached) {
              onMaxRetriesReached();
            }
            setIsRetrying(false);
          } else {
            // Otherwise, increment retry count for the next attempt
            setRetryCount(retryCount + 1);
          }
        }
      }, delay);
      
      setRetryTimeoutId(timeoutId);
    } catch (error) {
      console.error('Error in retry mechanism:', error);
      setIsRetrying(false);
      
      // If an error occurs in the retry mechanism itself, call the max retries callback
      if (retryCount >= maxRetries && onMaxRetriesReached) {
        onMaxRetriesReached();
      }
    }
    
    // Only include retryCount in the dependency array so this effect runs when it changes
  }, [retryCount, callback, maxRetries, onMaxRetriesReached, setRetryCount]);

  return {
    isRetrying,
    retryCount
  };
}
