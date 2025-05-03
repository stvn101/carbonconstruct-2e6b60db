
import { useState, useEffect } from 'react';
import { getCacheMetadata } from '@/services/materialService';
import { CacheStats } from './types';

export const useCacheStats = (materialsCount: number): CacheStats => {
  const [stats, setStats] = useState<CacheStats>({
    lastUpdated: null,
    itemCount: materialsCount || null
  });
  
  useEffect(() => {
    const updateStats = async () => {
      try {
        const metadata = await getCacheMetadata();
        setStats({
          lastUpdated: metadata.lastUpdated,
          itemCount: metadata.count || materialsCount
        });
      } catch (err) {
        console.error('Error fetching cache stats:', err);
      }
    };
    
    updateStats();
    
    // Update stats every minute
    const intervalId = setInterval(updateStats, 60000);
    return () => clearInterval(intervalId);
  }, [materialsCount]);
  
  return stats;
};
