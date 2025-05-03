
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

// Cache key
const MATERIALS_CACHE_KEY = 'carbonconstruct_materials_cache';
const MATERIALS_CACHE_METADATA_KEY = 'carbonconstruct_materials_cache_meta';

/**
 * Cache materials data in localStorage
 */
export async function cacheMaterials(materials: ExtendedMaterialData[]): Promise<void> {
  if (!materials || materials.length === 0) {
    console.warn('Attempted to cache empty materials array');
    return;
  }
  
  try {
    // Store materials data
    localStorage.setItem(MATERIALS_CACHE_KEY, JSON.stringify(materials));
    
    // Update cache metadata
    const metadata = {
      lastUpdated: new Date().toISOString(),
      count: materials.length,
      version: '1.1' // Increment version when cache structure changes
    };
    
    localStorage.setItem(MATERIALS_CACHE_METADATA_KEY, JSON.stringify(metadata));
    console.log('Materials cached successfully:', materials.length);
  } catch (error) {
    console.error('Error caching materials:', error);
    // Clear partial cache to prevent corrupted data
    localStorage.removeItem(MATERIALS_CACHE_KEY);
    localStorage.removeItem(MATERIALS_CACHE_METADATA_KEY);
  }
}

/**
 * Get cached materials from localStorage
 */
export async function getCachedMaterials(): Promise<ExtendedMaterialData[] | null> {
  try {
    const cachedData = localStorage.getItem(MATERIALS_CACHE_KEY);
    if (!cachedData) return null;
    
    // Parse and validate the cache
    const materials = JSON.parse(cachedData) as ExtendedMaterialData[];
    if (!Array.isArray(materials) || materials.length === 0) {
      return null;
    }
    
    return materials;
  } catch (error) {
    console.error('Error retrieving cached materials:', error);
    return null;
  }
}

/**
 * Clear the materials cache
 */
export async function clearMaterialsCache(): Promise<void> {
  try {
    localStorage.removeItem(MATERIALS_CACHE_KEY);
    localStorage.removeItem(MATERIALS_CACHE_METADATA_KEY);
    console.log('Materials cache cleared');
  } catch (error) {
    console.error('Error clearing materials cache:', error);
  }
}

/**
 * Get cache metadata
 */
export async function getCacheMetadata(): Promise<{ 
  lastUpdated: string; 
  count: number;
  version: string;
} | null> {
  try {
    const metadataJSON = localStorage.getItem(MATERIALS_CACHE_METADATA_KEY);
    if (!metadataJSON) return null;
    
    return JSON.parse(metadataJSON);
  } catch (error) {
    console.error('Error retrieving cache metadata:', error);
    return null;
  }
}
