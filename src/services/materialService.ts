
/**
 * Simplified Material Service - Main entry point for material-related services
 */

// Re-export types
export type { SupabaseMaterial } from './materials/materialTypes';

// Re-export data fetch functions
export { 
  fetchMaterials, 
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
