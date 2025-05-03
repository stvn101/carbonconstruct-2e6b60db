/**
 * Hook for managing material cache statistics
 */
import { useState, useEffect } from 'react';
import { getCacheMetadata } from '@/services/materialService';
import { CacheStats } from './types';

export const useCacheStats = (materialsLength: number) => {
  const [cacheStats, setCacheStats] = useState<CacheStats>({
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
    if (materialsLength > 0) {
      loadCacheStats();
    }
  }, [materialsLength]);

  return cacheStats;
};
