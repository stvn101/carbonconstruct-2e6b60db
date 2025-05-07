
/**
 * Refactored material cache hook that composes smaller, more focused hooks
 */
import { useState, useEffect } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useCacheStats } from './useCacheStats';
import { useRefreshCache } from './useRefreshCache';
import { useLoadMaterials } from './useLoadMaterials';
import { UseMaterialCacheResult } from './types';
import { toast } from 'sonner';

// Enhanced material cache hook with improved error handling and retry logic
export const useMaterialCache = (): UseMaterialCacheResult => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;
  
  // Use composed hooks
  const refreshCache = useRefreshCache(setMaterials, setLoading, setError);
  const loadMaterials = useLoadMaterials(setMaterials, setLoading, setError, materials);
  const cacheStats = useCacheStats(materials.length);
  
  // Automatic retry for failed loads
  useEffect(() => {
    if (error && materials.length === 0 && retryCount < MAX_RETRIES) {
      const retryDelay = Math.min(2000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
      
      console.log(`Auto-retry ${retryCount + 1}/${MAX_RETRIES} in ${retryDelay}ms due to error: ${error.message}`);
      
      const retryTimer = setTimeout(() => {
        console.log(`Executing retry ${retryCount + 1}/${MAX_RETRIES}`);
        loadMaterials(retryCount > 0)
          .then(() => {
            if (materials.length > 0) {
              setError(null);
              toast.success(`Materials loaded successfully on retry ${retryCount + 1}`);
            }
          })
          .catch(err => {
            console.error(`Retry ${retryCount + 1} failed:`, err);
          });
        
        setRetryCount(prevCount => prevCount + 1);
      }, retryDelay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [error, materials.length, retryCount, loadMaterials]);
  
  // Load materials on mount only once
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('Initial material loading');
      loadMaterials(false).then(() => {
        setInitialLoadComplete(true);
        
        // Check if we got a good number of materials
        if (materials.length < 50) {
          console.log('Initial load returned insufficient materials, trying again with force refresh');
          // Try again with force refresh if we didn't get many materials
          loadMaterials(true).catch(err => {
            console.error('Forced refresh after initial load failed:', err);
          });
        }
      });
    }
  }, [loadMaterials, initialLoadComplete, materials.length]);
  
  return { 
    materials, 
    loading, 
    error,
    refreshCache,
    cacheStats
  };
};
