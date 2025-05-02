
import { useState, useEffect, useCallback } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { getCacheMetadata, clearMaterialsCache } from '@/services/materialService';

// Simplified material cache hook - no pagination or complex options
export const useMaterialCache = () => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Refresh cache handler - forces fresh data fetch
  const refreshCache = useCallback(async () => {
    try {
      await clearMaterialsCache();
      loadMaterials(true);
    } catch (err) {
      console.error('Failed to refresh cache:', err);
    }
  }, []);
  
  // Main materials loading function - simplified
  const loadMaterials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      const fetchedMaterials = await fetchMaterials();
      setMaterials(fetchedMaterials);
      setError(null);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      
      // Fallback to static materials
      const staticMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        name: value.name || key,
        factor: value.factor,
        unit: value.unit || 'kg',
        region: 'Australia',
        tags: ['construction'],
        sustainabilityScore: 70,
        recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
        alternativeTo: undefined,
        notes: ''
      }));
      
      setMaterials(staticMaterials);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Cache statistics information
  const [cacheStats, setCacheStats] = useState<{
    lastUpdated: Date | null;
    itemCount: number | null;
  }>({
    lastUpdated: null,
    itemCount: null
  });
  
  // Get cache statistics
  useEffect(() => {
    const loadCacheStats = async () => {
      try {
        const metadata = await getCacheMetadata();
        if (metadata) {
          setCacheStats({
            lastUpdated: new Date(metadata.lastUpdated),
            itemCount: metadata.count
          });
        }
      } catch (err) {
        console.warn('Failed to load cache statistics:', err);
      }
    };
    
    loadCacheStats();
  }, [materials]);
  
  // Load materials on mount
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials]);
  
  return { 
    materials, 
    loading, 
    error,
    refreshCache,
    cacheStats
  };
};
