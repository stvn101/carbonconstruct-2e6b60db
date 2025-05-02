
import { useState, useEffect } from 'react';
import { fetchMaterials } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';

// Singleton cache for materials across the application
let GLOBAL_MATERIALS_CACHE: ExtendedMaterialData[] | null = null;
let LAST_FETCH_TIME = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

/**
 * Hook for efficiently loading and caching materials from Supabase
 * Provides a centralized caching mechanism for materials
 */
export const useMaterialCache = (options: { 
  useStaticFallback?: boolean; 
  forceFresh?: boolean; 
} = {}) => {
  const { useStaticFallback = true, forceFresh = false } = options;
  
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadMaterials = async () => {
      const now = Date.now();
      
      try {
        setLoading(true);
        
        // Use cache if available and not expired
        if (!forceFresh && GLOBAL_MATERIALS_CACHE && (now - LAST_FETCH_TIME) < CACHE_TTL) {
          console.log('Using cached materials');
          setMaterials(GLOBAL_MATERIALS_CACHE);
          setLoading(false);
          return;
        }
        
        console.log('Fetching materials from API');
        const fetchedMaterials = await fetchMaterials();
        
        // Update cache
        GLOBAL_MATERIALS_CACHE = fetchedMaterials;
        LAST_FETCH_TIME = now;
        
        setMaterials(fetchedMaterials);
        setError(null);
      } catch (err) {
        console.error('Error loading materials:', err);
        
        // Use static fallback data if enabled
        if (useStaticFallback) {
          console.warn('Using static material fallback data');
          // Convert static material factors to ExtendedMaterialData format
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
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadMaterials();
  }, [forceFresh, useStaticFallback]);
  
  return { materials, loading, error };
};
