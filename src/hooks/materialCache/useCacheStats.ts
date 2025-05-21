
/**
 * Hook to track cache statistics
 */
import { useState, useEffect } from 'react';
import { getCacheMetadata } from '@/services/materials/cache';

export interface CacheStats {
  lastUpdated: Date | null;
  itemCount: number | null;
  status: 'fresh' | 'stale' | 'unknown';
  ageInMinutes: number | null;
}

export function useCacheStats(currentItemCount: number = 0): CacheStats {
  const [stats, setStats] = useState<CacheStats>({
    lastUpdated: null,
    itemCount: currentItemCount > 0 ? currentItemCount : null,
    status: 'unknown',
    ageInMinutes: null
  });
  
  useEffect(() => {
    // Function to fetch cache metadata
    const fetchCacheStats = async () => {
      try {
        const metadata = await getCacheMetadata();
        
        // Calculate age in minutes if we have a timestamp
        let ageInMinutes = null;
        let status: 'fresh' | 'stale' | 'unknown' = 'unknown';
        
        if (metadata.lastUpdated) {
          const now = new Date();
          const diffMs = now.getTime() - metadata.lastUpdated.getTime();
          ageInMinutes = Math.floor(diffMs / (1000 * 60));
          
          // Determine if cache is fresh (less than 30 minutes old)
          status = ageInMinutes < 30 ? 'fresh' : 'stale';
        }
        
        setStats({
          lastUpdated: metadata.lastUpdated,
          itemCount: metadata.itemCount !== null ? metadata.itemCount : currentItemCount,
          status,
          ageInMinutes
        });
      } catch (err) {
        console.error('Failed to fetch cache stats:', err);
      }
    };
    
    fetchCacheStats();
    
    // Update stats every 5 minutes
    const interval = setInterval(fetchCacheStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentItemCount]);
  
  // Update item count if provided count changes
  useEffect(() => {
    if (currentItemCount > 0) {
      setStats(prev => ({
        ...prev,
        itemCount: currentItemCount
      }));
    }
  }, [currentItemCount]);
  
  return stats;
}
