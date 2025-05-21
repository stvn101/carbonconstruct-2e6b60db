
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
    const stats = getCacheMetadata();
    setCacheStats(stats);
  }, [materialCount]);

  return cacheStats;
}
