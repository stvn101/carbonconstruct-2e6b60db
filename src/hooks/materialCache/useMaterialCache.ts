
/**
 * Hook for cached material data
 */
import { useState, useEffect } from 'react';
import { fetchMaterials } from '@/services/materials/fetch/materialFetchService';
import { getCachedMaterials, cacheMaterials } from '@/services/materials/cache';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { useCacheStats } from './useCacheStats';

export function useMaterialCache() {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get cache statistics
  const cacheStats = useCacheStats(materials.length);
  
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setLoading(true);
        
        // First try to get from cache
        const cachedMaterials = await getCachedMaterials();
        
        if (cachedMaterials && cachedMaterials.length > 0) {
          setMaterials(cachedMaterials);
          setError(null);
          setLoading(false);
          
          // Still fetch fresh data in the background
          fetchMaterials(false)
            .then(freshMaterials => {
              if (freshMaterials.length > 0) {
                setMaterials(freshMaterials);
                cacheMaterials(freshMaterials).catch(console.error);
              }
            })
            .catch(console.error); // Don't set the error state here to avoid flickering
        } else {
          // No cache, fetch directly
          const fetchedMaterials = await fetchMaterials(false);
          setMaterials(fetchedMaterials);
          setError(null);
          
          // Cache the materials for future use
          cacheMaterials(fetchedMaterials).catch(console.error);
        }
      } catch (err) {
        console.error('Error in useMaterialCache:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterials();
  }, []);
  
  const refreshCache = async () => {
    try {
      setLoading(true);
      const freshMaterials = await fetchMaterials(true); // Force refresh
      setMaterials(freshMaterials);
      setError(null);
      
      // Cache the fresh materials
      await cacheMaterials(freshMaterials);
      
      return Promise.resolve();
    } catch (err) {
      console.error('Error refreshing materials cache:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return Promise.reject(err);
    } finally {
      setLoading(false);
    }
  };
  
  return { materials, loading, error, refreshCache, cacheStats };
}
