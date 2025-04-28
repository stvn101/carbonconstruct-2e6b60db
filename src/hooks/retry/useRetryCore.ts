
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { isNetworkError } from '@/utils/errorHandling';
import { useOfflineMode } from '@/hooks/useOfflineMode';

interface RetryOptions<T> {
  fn: () => Promise<T>;
  retries?: number;
  delay?: number;
  errorMessage?: string;
  successMessage?: string;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
  shouldRetry?: (error: unknown) => boolean;
}

const getErrorMessage = (error: Error, defaultMessage: string = 'Something went wrong') => {
  return error.message || defaultMessage;
};

export function useRetryCore<T>(options: RetryOptions<T>) {
  const { 
    fn, 
    retries = 3, 
    delay = 1000, 
    errorMessage = 'Operation failed',
    successMessage,
    onSuccess,
    onError,
    shouldRetry
  } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { isOfflineMode } = useOfflineMode();
  const attemptRef = useRef(0);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    if (!isMounted.current) return;
    setLoading(true);
    setError(null);
    attemptRef.current = 0;
    setAttempts(0);

    const attempt = async (): Promise<void> => {
      try {
        attemptRef.current++;
        setAttempts(attemptRef.current);
        const result = await fn();
        if (isMounted.current) {
          setData(result);
          setError(null);
          setLoading(false);
          if (successMessage) {
            toast.success(successMessage);
          }
          onSuccess?.(result);
        }
      } catch (err: any) {
        if (attemptRef.current <= retries && (!shouldRetry || shouldRetry(err))) {
          if (isMounted.current) {
            console.warn(`Attempt ${attemptRef.current} failed. Retrying in ${delay}ms`, err);
            await new Promise(resolve => setTimeout(resolve, delay));
            if (isMounted.current) {
              await attempt();
            }
          }
        } else {
          if (isMounted.current) {
            handleError(err);
            setLoading(false);
            onError?.(err);
          }
        }
      }
    };

    await attempt();
  }, [fn, retries, delay, successMessage, errorMessage, onSuccess, onError, shouldRetry, isOfflineMode]);

  const handleError = (error: unknown) => {
    const customError = error instanceof Error ? error : new Error(String(error));
    // Use isNetworkError utility function since isOffline is no longer available
    const shouldShowToasts = isNetworkError(customError) && !isOfflineMode;
    
    if (shouldShowToasts) {
      toast.error(getErrorMessage(customError));
    }
    
    throw customError;
  };

  return { 
    data, 
    error, 
    loading, 
    attempts, 
    execute,
    isRetrying: attempts > 0 && loading
  };
}
