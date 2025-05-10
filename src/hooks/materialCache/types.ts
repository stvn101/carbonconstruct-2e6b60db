
/**
 * Types for material cache functionality
 */

export interface CacheStats {
  lastUpdated: Date | null;
  itemCount: number | null;
}

export interface UseMaterialCacheResult {
  materials: Array<any>; // This will be replaced with ExtendedMaterialData[] in client code
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: CacheStats;
}
