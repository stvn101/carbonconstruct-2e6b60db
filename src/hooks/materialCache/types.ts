
/**
 * Types for material cache functionality
 */

export interface CacheStats {
  lastUpdated: Date | null;
  itemCount: number | null;
}

export interface UseMaterialCacheResult {
  materials: any[];
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: CacheStats;
}
