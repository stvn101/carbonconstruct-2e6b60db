
import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { checkNetworkStatus } from '@/utils/errorHandling';
import { useErrorBoundaryContext } from '@/components/error/ErrorBoundaryContext';

export function useEnhancedErrorBoundary(boundaryId: string, onReset?: () => void) {
  const [isChecking, setIsChecking] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const { registerErrorBoundary, unregisterErrorBoundary, resetErrorBoundary } = useErrorBoundaryContext();
  const maxRetries = 3;
  const mountedRef = useRef(true);

  // Register this error boundary with the context
  useEffect(() => {
    registerErrorBoundary(boundaryId);
    return () => {
      mountedRef.current = false;
      unregisterErrorBoundary(boundaryId);
    };
  }, [boundaryId, registerErrorBoundary, unregisterErrorBoundary]);

  const handleReset = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsChecking(true);
    
    try {
      // Check for network connectivity before attempting reset
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        toast.error("You're currently offline. Please check your connection first.", {
          id: `${boundaryId}-offline-error`,
          duration: 5000,
        });
        setIsChecking(false);
        return;
      }
      
      // Track retry attempts to prevent infinite reset loops
      setRetryAttempts(prev => {
        const newCount = prev + 1;
        if (newCount > maxRetries) {
          toast.error("Maximum retry attempts reached. Please reload the page.", {
            id: `${boundaryId}-max-retries`,
            duration: 0, // Persist until dismissed
          });
          return prev;
        }
        return newCount;
      });
      
      resetErrorBoundary(boundaryId);
      onReset?.();
      
    } catch (e) {
      console.error("Error during reset:", e);
      toast.error("Something went wrong during reset. Please try again.", {
        id: `${boundaryId}-reset-error`,
        duration: 3000,
      });
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  }, [boundaryId, onReset, resetErrorBoundary]);

  return {
    isChecking,
    retryAttempts,
    handleReset,
    hasExceededRetries: retryAttempts >= maxRetries
  };
}
