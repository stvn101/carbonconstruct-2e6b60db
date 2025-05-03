
/**
 * Refactored material cache hook that composes smaller, more focused hooks
 */
import { useState, useEffect } from 'react';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useCacheStats } from './useCacheStats';
import { useRefreshCache } from './useRefreshCache';
import { useLoadMaterials } from './useLoadMaterials';
import { UseMaterialCacheResult } from './types';

// Simplified material cache hook with improved error handling
export const useMaterialCache = (): UseMaterialCacheResult => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Use composed hooks
  const refreshCache = useRefreshCache(setMaterials, setLoading, setError);
  const loadMaterials = useLoadMaterials(setMaterials, setLoading, setError, materials);
  const cacheStats = useCacheStats(materials.length);
  
  // Load materials on mount only once
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('Initial material loading');
      loadMaterials().then(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [loadMaterials, initialLoadComplete]);
  
  return { 
    materials, 
    loading, 
    error,
    refreshCache,
    cacheStats
  };
};
