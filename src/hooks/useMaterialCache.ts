
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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Refresh cache handler - forces fresh data fetch
  const refreshCache = useCallback(async () => {
    try {
      setLoading(true);
      toast.info("Refreshing material data...");
      
      await clearMaterialsCache();
      const fetchedMaterials = await fetchMaterials(true);
      
      // Ensure we have valid materials before setting them
      if (Array.isArray(fetchedMaterials) && fetchedMaterials.length > 0) {
        setMaterials(fetchedMaterials);
        setError(null);
        toast.success("Material data refreshed successfully!");
      } else {
        throw new Error("Received invalid material data");
      }
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
      if (fetchedMaterials && Array.isArray(fetchedMaterials) && fetchedMaterials.length > 0) {
        console.log('Setting materials from fetch:', fetchedMaterials.length);
        setMaterials(fetchedMaterials);
        setError(null);
      } else if (materials.length === 0) {
        // If we don't have any materials yet, use static fallback
        console.log('Using static fallback materials');
        
        try {
          // Enhanced error handling for material factors
          if (!MATERIAL_FACTORS || typeof MATERIAL_FACTORS !== 'object') {
            throw new Error('MATERIAL_FACTORS not properly defined');
          }
          
          const staticMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
            name: value.name || key,
            factor: value.factor || 0,
            unit: value.unit || 'kg',
            region: 'Australia', // Default region
            tags: ['construction'], // Default tags
            sustainabilityScore: 70,
            recyclability: 'Medium' as 'High' | 'Medium' | 'Low', // Example data
            alternativeTo: undefined,
            notes: ''
          }));
          
          setMaterials(staticMaterials);
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Set to empty array to prevent undefined errors
          setMaterials([]);
          setError(new Error('Failed to load materials data'));
        }
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
        try {
          const staticMaterials = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
            name: value.name || key,
            factor: value.factor || 0,
            unit: value.unit || 'kg',
            region: 'Australia',
            tags: ['construction'],
            sustainabilityScore: 70,
            recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
            alternativeTo: undefined,
            notes: ''
          }));
          
          setMaterials(staticMaterials);
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Set to empty array to prevent undefined errors
          setMaterials([]);
        }
      }
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
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
  
  // Get cache statistics safely
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
        // Keep the existing stats on error
      }
    };
    
    // Only load cache stats if we have materials
    if (materials.length > 0) {
      loadCacheStats();
    }
  }, [materials.length]);
  
  // Load materials on mount only once
  useEffect(() => {
    if (!initialLoadComplete) {
      console.log('Initial material loading');
      loadMaterials();
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
