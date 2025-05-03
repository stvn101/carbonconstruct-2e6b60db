
import { useState, useEffect, useCallback } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { getCacheMetadata, clearMaterialsCache } from '@/services/materialService';
import { toast } from 'sonner';

// Add debounce utility to prevent multiple refresh attempts
const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function(this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

// Simplified material cache hook with improved error handling
export const useMaterialCache = () => {
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  
  // Limit refresh attempts
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const MAX_REFRESH_ATTEMPTS = 3;
  
  // Refresh cache handler - with debounce to prevent multiple refreshes
  const refreshCache = useCallback(debounce(async () => {
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      toast.error("Too many refresh attempts. Please try again later.");
      return;
    }
    
    try {
      setLoading(true);
      toast.info("Refreshing material data...");
      
      setRefreshAttempts(prev => prev + 1);
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
  }, 500), [refreshAttempts]);
  
  // Main materials loading function - simplified with better error handling
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
          
          if (staticMaterials.length > 0) {
            setMaterials(staticMaterials);
          } else {
            throw new Error('No static materials available');
          }
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Create a minimum set of materials to prevent empty state
          setMaterials([
            {
              name: "Concrete",
              factor: 0.159,
              unit: "kg",
              region: "Australia",
              tags: ["construction"],
              sustainabilityScore: 70,
              recyclability: "Medium" as "High" | "Medium" | "Low"
            },
            {
              name: "Steel",
              factor: 1.77,
              unit: "kg",
              region: "Australia",
              tags: ["construction"],
              sustainabilityScore: 65,
              recyclability: "High" as "High" | "Medium" | "Low"
            }
          ]);
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
          
          if (staticMaterials.length > 0) {
            setMaterials(staticMaterials);
          }
        } catch (staticError) {
          console.error('Error creating static materials:', staticError);
          // Create a minimum set of materials to prevent empty state
          setMaterials([
            {
              name: "Concrete",
              factor: 0.159,
              unit: "kg",
              region: "Australia",
              tags: ["construction"],
              sustainabilityScore: 70,
              recyclability: "Medium" as "High" | "Medium" | "Low"
            },
            {
              name: "Steel",
              factor: 1.77,
              unit: "kg",
              region: "Australia",
              tags: ["construction"],
              sustainabilityScore: 65,
              recyclability: "High" as "High" | "Medium" | "Low"
            }
          ]);
        }
      }
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  }, [materials.length]);
  
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
