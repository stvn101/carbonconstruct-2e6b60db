
/**
 * Entry point for materials cache functionality
 */
export { 
  getCachedMaterials, 
  cacheMaterials, 
  clearMaterialsCache, 
  prefetchMaterials,
  getCacheMetadata,
  type MaterialCacheMetadata
} from './materialCacheService';
export { mapDatabaseMaterials } from './materialDataMapping';
export { default as cacheConstants } from './cacheConstants';
