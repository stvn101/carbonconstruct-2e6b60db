
/**
 * Material Service - Main entry point for material-related services
 * Re-exports all functionality from the modularized services
 */

// Re-export types
export type { MaterialPagination, SupabaseMaterial } from './materials/materialTypes';

// Re-export data fetch functions
export { 
  fetchMaterials, 
  fetchMaterialsWithPagination, 
  fetchMaterialCategories 
} from './materials/materialFetchService';

// Re-export cache functions
export {
  cacheMaterials,
  getCachedMaterials,
  clearMaterialsCache,
  getCacheMetadata
} from './materials/materialCacheService';

// Re-export data processing functions
export {
  processDataInBatches,
  calculateSustainabilityScore,
  determineRecyclability
} from './materials/materialDataProcessor';
