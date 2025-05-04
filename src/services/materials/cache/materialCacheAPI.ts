
/**
 * Public API for material cache operations
 */
import materialCacheService from './materialCacheCore';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Caches the provided materials, replacing any existing cached data
 * @param materials The materials to cache
 * @returns A boolean indicating success or failure
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]) {
  try {
    materialCacheService.clearCache(); // Clear first
    // Create a new mechanism to replace the cache
    const result = await materialCacheService.syncMaterialsCache();
    materialCacheService.lastUpdated = new Date();
    return !!result;
  } catch (error) {
    console.error('Error caching materials:', error);
    throw error;
  }
}

/**
 * Retrieves all cached materials
 * @returns An array of ExtendedMaterialData objects
 */
export async function getCachedMaterials() {
  return materialCacheService.getMaterials();
}

/**
 * Clears the materials cache
 * @returns A boolean indicating success or failure
 */
export async function clearMaterialsCache() {
  try {
    materialCacheService.clearCache();
    return true;
  } catch (error) {
    console.error('Failed to clear cache:', error);
    return false;
  }
}

/**
 * Retrieves metadata about the current cache state
 * @returns An object containing last updated timestamp and item count
 */
export async function getCacheMetadata() {
  return {
    lastUpdated: materialCacheService.lastUpdated,
    count: materialCacheService.getMaterialsCount()
  };
}
