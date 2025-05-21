
/**
 * Main entry point for material services
 * Provides a clean interface to all material-related functionality
 */

// Type exports
export * from './types';

// Core functionality exports
export { getMaterialFactor, getMaterialDetails, batchResolveMaterials, enrichMaterialInput } from './materialResolver';
export { prefetchMaterials, getCachedMaterials, cacheMaterials, clearMaterialsCache } from './cache/materialCacheService';
export { initializeMaterialsSystem } from './materialsInit';
export { resolveMaterial, isDatabaseMaterialId, createDatabaseMaterialId } from './materialAdapter';
export { processDataInBatches, calculateSustainabilityScore, determineRecyclability } from './materialDataProcessor';

// Import dynamic initialization
import './materialsInit';
