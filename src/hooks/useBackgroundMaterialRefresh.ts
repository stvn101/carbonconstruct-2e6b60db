
/**
 * Hook for background refreshing of material data
 * This hook ensures material data is kept up to date without interrupting the user experience
 */
import { useEffect, useState } from 'react';
import { prefetchMaterials } from '@/services/materials/cache';
import { CACHE_REFRESH_INTERVAL } from '@/services/materials/cache/cacheConstants';

/**
 * Hook that initiates background refresh of materials data at regular intervals
 * @param options Configuration options
 * @returns Status information about the background refresh
 */
export function useBackgroundMaterialRefresh(options: {
  enabled?: boolean;
  interval?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const interval = options.interval || CACHE_REFRESH_INTERVAL;
  const enabled = options.enabled !== false;
  
  // Function to refresh materials
  const refreshMaterials = async () => {
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      setError(null);
      
      // Prefetch materials with force refresh
      await prefetchMaterials(true);
      
      // Update last refreshed time
      const now = new Date();
      setLastRefreshed(now);
      
      // Call success callback if provided
      if (options.onSuccess) {
        options.onSuccess();
      }
    } catch (err) {
      console.error('Error in background refresh:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Call error callback if provided
      if (options.onError) {
        options.onError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Set up the refresh interval
  useEffect(() => {
    // Skip if disabled
    if (!enabled) return;
    
    // Initial refresh after delay to prevent interfering with initial page load
    const initialTimer = setTimeout(() => {
      refreshMaterials().catch(console.error);
    }, 30000); // 30 seconds delay for initial refresh
    
    // Set up regular refresh interval
    const refreshTimer = setInterval(() => {
      refreshMaterials().catch(console.error);
    }, interval);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimer);
      clearInterval(refreshTimer);
    };
  }, [enabled, interval]);
  
  return {
    lastRefreshed,
    isRefreshing,
    error,
    refreshNow: refreshMaterials
  };
}
