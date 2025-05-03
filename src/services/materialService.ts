
/**
 * Central service that re-exports all material-related functionality
 */

// Re-export all functions from materialCacheService
export { 
  cacheMaterials,
  getCachedMaterials,
  clearMaterialsCache,
  getCacheMetadata 
} from './materials/materialCacheService';

// Re-export all functions from materialFetchService
export { 
  fetchMaterials,
  fetchMaterialCategories
} from './materials/materialFetchService';

// Re-export types
export type { 
  ExtendedMaterialData,
  MaterialCategory,
  MaterialSearchParams,
  MaterialSearchResult
} from '@/lib/materials/materialTypes';
