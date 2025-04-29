
import { useState, useEffect, useCallback } from 'react';
import { showErrorToast, showSuccessToast } from '@/utils/errorHandling';

/**
 * Hook to manage connection retries with exponential backoff
 */
export const useConnectionRetry = (
  user: any, 
  hasInitialized: boolean,
  startDataInitialization: () => Promise<void>
) => {
  const [connectionRetries, setConnectionRetries] = useState(0);
  const [initializationAttempts, setInitializationAttempts] = useState(0);

  // Track initialization attempts
  const incrementAttempts = useCallback(() => {
    setInitializationAttempts(prev => prev + 1);
  }, []);
  
  // Reset retries when connection is restored
  const resetConnectionRetries = useCallback(() => {
    setConnectionRetries(0);
  }, []);

  // Increment retry count when connection fails
  const incrementRetries = useCallback(() => {
    setConnectionRetries(prev => prev + 1);
  }, []);
  
  // Effect for connection retries with exponential backoff
  useEffect(() => {
    if (!user || hasInitialized || connectionRetries === 0) {
      return;
    }
    
    // Use exponential backoff for retries with longer intervals
    // First retry: 15s, second: 45s, third: 90s, subsequent: 3min
    const getRetryInterval = () => {
      if (connectionRetries === 1) return 15000;
      if (connectionRetries === 2) return 45000;
      if (connectionRetries === 3) return 90000;
      return 180000; // 3 minutes for subsequent retries
    };
    
    const interval = getRetryInterval();
    console.log(`Scheduling retry attempt in ${interval/1000}s (retry #${connectionRetries})`);
    
    const timer = setTimeout(() => {
      if (!hasInitialized) {
        startDataInitialization();
      }
    }, interval);
    
    return () => clearTimeout(timer);
  }, [user, hasInitialized, connectionRetries, startDataInitialization]);

  return {
    connectionRetries,
    initializationAttempts,
    incrementAttempts,
    resetConnectionRetries,
    incrementRetries
  };
};
