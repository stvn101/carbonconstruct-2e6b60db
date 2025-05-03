
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { checkNetworkStatus } from '@/utils/errorHandling/networkChecker';
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';
import ErrorTrackingService from '@/services/error/errorTrackingService';

export function useErrorBoundaryState(feature?: string, onReset?: () => void) {
  const [key, setKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleReset = useCallback(async () => {
    if (!mountedRef.current) return;
    setIsChecking(true);

    try {
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        toast.error("You're currently offline. Please check your connection.", {
          id: "offline-reset-error",
          duration: 5000,
        });
        setIsChecking(false);
        return;
      }
      
      const canConnect = await checkSupabaseConnectionWithRetry(2, 1000);
      
      if (!canConnect) {
        toast.error("Cannot connect to the server. Please try again when you have better connectivity.", {
          id: "connection-reset-error",
          duration: 5000,
        });
        setIsChecking(false);
        return;
      }

      setKey(prevKey => prevKey + 1);
      setHasError(false);
      onReset?.();
      
      toast.success("Reset successful! Trying again...", {
        id: "reset-success",
        duration: 3000,
      });
    } catch (e) {
      console.error("Error checking connection:", e);
      toast.error("Something went wrong. Please try again.", {
        id: "reset-error",
        duration: 3000,
      });
    } finally {
      if (mountedRef.current) {
        setIsChecking(false);
      }
    }
  }, [onReset]);

  const handleError = useCallback((error: Error, info: { componentStack: string }) => {
    setHasError(true);
    
    ErrorTrackingService.captureException(error, { 
      feature,
      componentStack: info.componentStack,
      url: window.location.href,
      route: window.location.pathname
    });
  }, [feature]);

  return {
    key,
    hasError,
    isChecking,
    handleReset,
    handleError
  };
}
