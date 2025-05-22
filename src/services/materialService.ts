
/**
 * Simplified Material Service - Main entry point for material-related services
 */

// Re-export types
export type { SupabaseMaterial } from './materials/materialTypes';

// Re-export data fetch functions
export { 
  fetchMaterials, 
  fetchMaterialCategories 
} from './materials/materialsFetchService';

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

// Background fetch of materials for better availability
// This will prime the cache when the service is first loaded
setTimeout(() => {
  console.log("Preloading materials cache in background");
  import('./materials/materialsFetchService')
    .then(({ fetchMaterials }) => fetchMaterials(false))
    .catch(err => console.error("Failed to preload materials cache:", err));
}, 1000);
