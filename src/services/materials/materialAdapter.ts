
/**
 * Material Adapter - Adapts different material data sources into a consistent format
 * This enables seamless handling of materials from different sources (database, static, etc.)
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

// Constants for material source identification
const DB_MATERIAL_PREFIX = 'db-';

/**
 * Check if a material ID is from the database
 */
export function isDatabaseMaterialId(id: string): boolean {
  return id.startsWith(DB_MATERIAL_PREFIX);
}

/**
 * Extract the database ID from a prefixed material ID
 */
export function extractDatabaseId(id: string): string {
  if (!isDatabaseMaterialId(id)) {
    return id;
  }
  return id.substring(DB_MATERIAL_PREFIX.length);
}

/**
 * Create a database material ID with the proper prefix
 */
export function createDatabaseMaterialId(id: string): string {
  if (isDatabaseMaterialId(id)) {
    return id;
  }
  return `${DB_MATERIAL_PREFIX}${id}`;
}

/**
 * Create a fallback material when the requested one is not found
 */
export function createFallbackMaterial(id: string): ExtendedMaterialData {
  return {
    id: id,
    name: `Unknown Material (${id})`,
    factor: 1.0, // Default factor
    unit: 'kg',
    region: 'Global',
    category: 'Unknown',
    sustainabilityScore: 50,
    recyclability: 'Medium',
    description: 'This is a fallback material used when the requested material was not found.'
  };
}

/**
 * Resolve a material from any source (database, static, etc.)
 * This is a placeholder implementation that will be enhanced with actual resolution logic
 */
export async function resolveMaterial(materialIdentifier: string): Promise<ExtendedMaterialData> {
  try {
    // Import cache service dynamically to avoid circular dependencies
    const { getCachedMaterials } = await import('./cache/materialCacheService');
    const { fetchMaterials } = await import('./fetch/materialFetchService');
    
    // Try to get from cache first
    const cachedMaterials = await getCachedMaterials();
    if (cachedMaterials && cachedMaterials.length > 0) {
      // If it's a database material, extract the ID
      const searchId = isDatabaseMaterialId(materialIdentifier) 
        ? extractDatabaseId(materialIdentifier)
        : materialIdentifier;
      
      // Look for the material in the cache
      const material = cachedMaterials.find(m => m.id === searchId);
      if (material) {
        return material;
      }
    }
    
    // If not found in cache, try fetching
    const fetchedMaterials = await fetchMaterials(false);
    const searchId = isDatabaseMaterialId(materialIdentifier)
      ? extractDatabaseId(materialIdentifier)
      : materialIdentifier;
    
    const material = fetchedMaterials.find(m => m.id === searchId);
    if (material) {
      return material;
    }
    
    // If still not found, create a fallback material
    return createFallbackMaterial(materialIdentifier);
  } catch (error) {
    console.error('Error resolving material:', error);
    return createFallbackMaterial(materialIdentifier);
  }
}
