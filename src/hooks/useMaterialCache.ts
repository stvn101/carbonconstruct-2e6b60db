
import { useState, useEffect, useCallback } from 'react';
import { fetchMaterials, fetchMaterialsWithPagination, MaterialPagination } from '@/services/materialService';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { getCacheMetadata, clearMaterialsCache } from '@/services/materialService';
import { useThrottle } from './useDebounce';

// Singleton cache for materials across the application
let GLOBAL_MATERIALS_CACHE: ExtendedMaterialData[] | null = null;
let LAST_FETCH_TIME = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifetime

/**
 * Options for the material cache hook
 */
interface MaterialCacheOptions {
  useStaticFallback?: boolean;
  forceFresh?: boolean;
  usePagination?: boolean;
  initialPagination?: Partial<MaterialPagination>;
}

/**
 * Hook for efficiently loading and caching materials from Supabase with pagination support
 */
export const useMaterialCache = (options: MaterialCacheOptions = {}) => {
  const { 
    useStaticFallback = true, 
    forceFresh = false, 
    usePagination = false,
    initialPagination = { page: 1, pageSize: 50 }
  } = options;
  
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<MaterialPagination>({
    page: initialPagination.page || 1,
    pageSize: initialPagination.pageSize || 50,
    search: initialPagination.search,
    category: initialPagination.category,
    sortBy: initialPagination.sortBy,
    sortDirection: initialPagination.sortDirection || 'asc'
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Throttle pagination changes to prevent too many API calls
  const throttledPagination = useThrottle(pagination, 300);

  // Refresh cache handler - forces fresh data fetch
  const refreshCache = useCallback(async () => {
    try {
      await clearMaterialsCache();
      GLOBAL_MATERIALS_CACHE = null;
      LAST_FETCH_TIME = 0;
      loadMaterials(true);
    } catch (err) {
      console.error('Failed to refresh cache:', err);
    }
  }, []);

  // Update pagination handler
  const updatePagination = useCallback((newPagination: Partial<MaterialPagination>) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);
  
  // Main materials loading function
  const loadMaterials = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    try {
      setLoading(true);
      
      if (usePagination) {
        // Fetch with pagination
        const { data, count } = await fetchMaterialsWithPagination(throttledPagination);
        setMaterials(data);
        setTotalCount(count);
        setError(null);
      } else {
        // Use cache if available and not expired
        if (!forceFresh && !forceRefresh && GLOBAL_MATERIALS_CACHE && (now - LAST_FETCH_TIME) < CACHE_TTL) {
          console.log('Using in-memory cached materials');
          setMaterials(GLOBAL_MATERIALS_CACHE);
        } else {
          console.log('Fetching all materials');
          const fetchedMaterials = await fetchMaterials();
          
          // Update in-memory cache
          GLOBAL_MATERIALS_CACHE = fetchedMaterials;
          LAST_FETCH_TIME = now;
          
          setMaterials(fetchedMaterials);
          setTotalCount(fetchedMaterials.length);
        }
        setError(null);
      }
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
        setTotalCount(staticMaterials.length);
      } else {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      setLoading(false);
    }
  }, [forceFresh, useStaticFallback, usePagination, throttledPagination]);
  
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
  
  // Load materials when dependencies change
  useEffect(() => {
    loadMaterials();
  }, [loadMaterials, throttledPagination]);
  
  return { 
    materials, 
    loading, 
    error,
    pagination,
    updatePagination,
    totalCount,
    refreshCache,
    cacheStats
  };
};
