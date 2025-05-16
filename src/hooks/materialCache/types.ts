
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export interface UseMaterialCacheResult {
  materials: ExtendedMaterialData[];
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: {
    lastUpdated: Date | null;
    itemCount: number | null;
  };
}

export interface MaterialsByRegion {
  [key: string]: number;
}

export interface MaterialOption {
  id: string;
  name: string;
}

export interface CacheStats {
  lastUpdated: Date | null;
  itemCount: number | null;
}
