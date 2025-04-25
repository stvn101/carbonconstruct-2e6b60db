import { useEffect, useState, useCallback, useRef } from 'react';
import { calculateBackoffDelay, RetryOptions, RetryResult } from './retryUtils';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

/**
 * Improved hook for implementing retry logic with exponential backoff
 * Adds:
 * - Network status awareness to avoid retries when offline
 * - Better timeout management
 * - More reliable memory leak prevention
 * - Improved attempt tracking
 */
export function useRetryCore({
  callback,
  maxRetries,
  onMaxRetriesReached,
  retryCount,
  setRetryCount
}: RetryOptions): RetryResult {
  const [isRetrying, setIsRetrying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const attemptRef = useRef(0);
  const { isOnline } = useNetworkStatus({ showToasts: false });

  // Clean up any existing timeout on unmount
  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    return () => {
      // Clear flag on unmount to prevent state updates
      isMountedRef.current = false;
      
      // Clean up timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Reset attempt counter when retryCount is reset to 0
  useEffect(() => {
    if (retryCount === 0) {
      attemptRef.current = 0;
    }
  }, [retryCount]);

  // Handle retry logic when retry count changes
  useEffect(() => {
    // Skip if we're not in a retry state or if we've reached max retries
    if (retryCount === 0 || retryCount > maxRetries) return;
    
    // Skip retries when offline - no point trying if we know we're offline
    if (!isOnline) {
      // If we're offline, don't increment retry count, but trigger max retries callback
      if (onMaxRetriesReached) {
        onMaxRetriesReached();
      }
      setIsRetrying(false);
      return;
    }

    // Set retrying state
    setIsRetrying(true);
    
    // Clear any existing timeout first
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    try {
      // Calculate delay with improved exponential backoff
      // Now using a more conservative growth curve (1.8 instead of 2)
      // This slows down retry attempts more gradually
      const delay = calculateBackoffDelay(retryCount, 1.8, 2000, 45000);
      
      console.info(`Scheduling retry attempt ${retryCount}/${maxRetries} in ${delay}ms`);
      
      // Set up the next retry attempt
      timeoutRef.current = setTimeout(async () => {
        // Check if component is still mounted before proceeding
        if (!isMountedRef.current) return;
        
        // Skip if we're now offline
        if (!isOnline) {
          setIsRetrying(false);
          if (onMaxRetriesReached) {
            onMaxRetriesReached();
          }
          return;
        }
        
        // Track this attempt
        attemptRef.current += 1;
        
        try {
          console.info(`Executing retry attempt ${attemptRef.current}`);
          await callback();
          
          // If successful, reset retry count only if still mounted
          if (isMountedRef.current) {
            console.info(`Retry attempt ${attemptRef.current} succeeded`);
            setRetryCount(0);
            setIsRetrying(false);
            attemptRef.current = 0;
          }
        } catch (error) {
          // Only proceed if still mounted
          if (!isMountedRef.current) return;
          
          // Log the error with the current attempt count
          console.error(`Retry attempt ${attemptRef.current} failed:`, error);
          
          // If we've reached max retries, trigger the callback and stop
          if (retryCount >= maxRetries) {
            console.warn(`Max retries (${maxRetries}) reached`);
            if (onMaxRetriesReached) {
              onMaxRetriesReached();
            }
            setIsRetrying(false);
          } else {
            // Otherwise, increment retry count for the next attempt
            console.info(`Scheduling next retry (${retryCount + 1}/${maxRetries})`);
            setRetryCount(retryCount + 1);
          }
        }
      }, delay);
    } catch (error) {
      console.error('Error in retry mechanism:', error);
      
      // Only update state if still mounted
      if (isMountedRef.current) {
        setIsRetrying(false);
        
        // If an error occurs in the retry mechanism itself, call the max retries callback
        if (retryCount >= maxRetries && onMaxRetriesReached) {
          onMaxRetriesReached();
        }
      }
    }
    
    // Include all dependencies to ensure the effect runs when needed
  }, [retryCount, callback, maxRetries, onMaxRetriesReached, setRetryCount, isOnline]);

  return {
    isRetrying,
    retryCount
  };
}
