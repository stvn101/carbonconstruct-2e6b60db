
/**
 * Hook for getting material cache statistics
 */
import { useState, useEffect } from 'react';
import { getCacheMetadata } from '@/services/materials/cache';

export function useCacheStats(materialCount: number) {
  const [cacheStats, setCacheStats] = useState<{
    lastUpdated: Date | null;
    itemCount: number | null;
  }>({ lastUpdated: null, itemCount: null });

  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getCacheMetadata();
        setCacheStats({
          lastUpdated: stats?.lastUpdated ? new Date(stats.lastUpdated) : null,
          itemCount: stats?.count || null
        });
      } catch (error) {
        console.error('Error fetching cache stats:', error);
      }
    }
    
    fetchStats();
  }, [materialCount]);

  return cacheStats;
}
