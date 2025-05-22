
import { useEffect, useState } from 'react';
import { fetchMaterials } from '@/services/materials/fetch/materialFetchService';

interface UseBackgroundMaterialRefreshOptions {
  /** Whether the background refresh is enabled */
  enabled?: boolean;
  /** Interval in milliseconds between background refreshes */
  interval?: number;
  /** Callback when refresh is successful */
  onSuccess?: (materials: any[]) => void;
  /** Callback when refresh fails */
  onError?: (error: any) => void;
}

/**
 * Hook to periodically refresh materials in the background
 */
export function useBackgroundMaterialRefresh(options: UseBackgroundMaterialRefreshOptions = {}) {
  const {
    enabled = true,
    interval = 15 * 60 * 1000, // Default: 15 minutes
    onSuccess,
    onError
  } = options;
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  
  useEffect(() => {
    if (!enabled) return;
    
    // Function to refresh materials
    const refreshMaterials = async () => {
      if (isRefreshing) return; // Prevent concurrent refreshes
      
      console.log('Background refresh: Starting materials refresh');
      setIsRefreshing(true);
      
      try {
        const materials = await fetchMaterials(true); // Force refresh
        console.log(`Background refresh: Successfully refreshed ${materials.length} materials`);
        setLastRefreshed(new Date());
        
        // Call success callback if provided
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(materials);
        }
      } catch (error) {
        console.error('Background refresh: Error refreshing materials:', error);
        
        // Call error callback if provided
        if (onError && typeof onError === 'function') {
          onError(error);
        }
      } finally {
        setIsRefreshing(false);
      }
    };
    
    // Perform initial refresh
    refreshMaterials();
    
    // Set up interval for background refreshes
    const intervalId = setInterval(refreshMaterials, interval);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [enabled, interval, onSuccess, onError]);
  
  return {
    isRefreshing,
    lastRefreshed
  };
}
