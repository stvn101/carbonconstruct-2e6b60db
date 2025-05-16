
import { useState, useEffect } from 'react';
import { CacheStats } from './types';

export const useCacheStats = (materialCount: number): CacheStats => {
  const [stats, setStats] = useState<CacheStats>({
    lastUpdated: null,
    itemCount: null
  });

  useEffect(() => {
    try {
      // Update item count from current materials array length
      setStats(prev => ({
        ...prev,
        itemCount: materialCount
      }));

      // Get last updated timestamp from localStorage
      const cachedTimestamp = localStorage.getItem('materialsCacheTimestamp');
      
      if (cachedTimestamp) {
        setStats(prev => ({
          ...prev,
          lastUpdated: new Date(cachedTimestamp)
        }));
      }
    } catch (error) {
      console.error('Error getting cache stats:', error);
    }
  }, [materialCount]);

  return stats;
};
