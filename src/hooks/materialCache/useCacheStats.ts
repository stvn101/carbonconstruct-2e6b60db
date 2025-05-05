
/**
 * Hook for monitoring material cache statistics
 */
import { useState, useEffect } from 'react';
import { getCacheMetadata } from '@/services/materials/cache';

interface CacheStats {
  lastUpdated: Date | null;
  itemCount: number | null;
}

export const useCacheStats = (materialCount: number): CacheStats => {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
    lastUpdated: null,
    itemCount: null
  });
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchCacheStats = async () => {
      try {
        const metadata = await getCacheMetadata();
        
        if (isMounted) {
          setCacheStats({
            lastUpdated: metadata.lastUpdated,
            itemCount: metadata.count || materialCount // Fall back to material count if necessary
          });
        }
      } catch (error) {
        console.warn('Failed to fetch cache stats:', error);
        
        // If we failed to get stats but have material count, use that
        if (isMounted && materialCount) {
          setCacheStats(prev => ({
            ...prev,
            itemCount: materialCount
          }));
        }
      }
    };
    
    fetchCacheStats();
    
    return () => {
      isMounted = false;
    };
  }, [materialCount]);
  
  return cacheStats;
};
