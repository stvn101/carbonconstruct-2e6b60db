
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
    await materialCacheService.clearMaterialsCache(); // Clear first
    
    // Store the materials in cache
    const result = await materialCacheService.storeMaterialsInCache(materials);
    
    if (result) {
      // Update metadata using the cache metadata API
      const now = new Date();
      console.log(`Cached ${materials.length} materials successfully at ${now.toISOString()}`);
    } else {
      console.warn('Failed to cache materials, unknown error');
    }
    
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
  return materialCacheService.getMaterialsFromCache();
}

/**
 * Clears the materials cache
 * @returns A boolean indicating success or failure
 */
export async function clearMaterialsCache() {
  try {
    await materialCacheService.clearMaterialsCache();
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
  const metadata = await materialCacheService.getCacheMetadata();
  return {
    lastUpdated: metadata.lastUpdated,
    itemCount: metadata.itemCount
  };
}
