import { useState, useEffect, useCallback } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { getCacheMetadata, clearMaterialsCache } from '@/services/materialService';
import { toast } from 'sonner';

// Simplified material cache hook - no pagination or complex options
export const useMaterialCache = () => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Refresh cache handler - forces fresh data fetch
  const refreshCache = useCallback(async () => {
    try {
      setLoading(true);
      toast.info("Refreshing material data...");
      
      await clearMaterialsCache();
      const fetchedMaterials = await fetchMaterials(true);
      
      setMaterials(fetchedMaterials);
      setError(null);
      
      toast.success("Material data refreshed successfully!");
    } catch (err) {
      console.error('Failed to refresh cache:', err);
      toast.error("Failed to refresh material data. Using cached data.");
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Main materials loading function - simplified
  const loadMaterials = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Try to load materials from the service
      console.log('Loading materials with forceRefresh:', forceRefresh);
      const fetchedMaterials = await fetchMaterials(forceRefresh);
      
      // Only update if we have materials (otherwise keep what we have)
      if (fetchedMaterials && fetchedMaterials.length > 0) {
        console.log('Setting materials from fetch:', fetchedMaterials.length);
        setMaterials(fetchedMaterials);
        setError(null);
      } else if (materials.length === 0) {
        // If we don't have any materials yet, use static fallback
        console.log('Using static fallback materials');
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
      }
    } catch (err) {
      console.error('Error loading materials:', err);
      
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error(String(err)));
      }
      
      // Fallback to static materials only if we don't have any materials yet
      if (materials.length === 0) {
        console.log('Using static fallback materials due to error');
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
      }
    } finally {
      setLoading(false);
    }
  }, [materials]);
  
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
    console.log('Initial material loading');
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
