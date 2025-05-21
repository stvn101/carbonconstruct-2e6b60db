
/**
 * Material Resolver Service
 * Central service for resolving material factors and information
 * from multiple sources (static data, database, cache)
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { MaterialInput } from '@/lib/carbonTypes';
import { 
  isDatabaseMaterialId, 
  extractDatabaseId, 
  createDatabaseMaterialId,
  resolveMaterial,
  createFallbackMaterial
} from './materialAdapter';

/**
 * Get the emission factor for a material by its type or id
 */
export async function getMaterialFactor(materialIdentifier: string): Promise<number> {
  // Check if the material is null or undefined
  if (!materialIdentifier) return 1.0;
  
  try {
    // Resolve the material from various sources
    const material = await resolveMaterial(materialIdentifier);
    
    // Return the factor (with a safe fallback)
    return material.factor || 1.0;
  } catch (error) {
    console.error('Error resolving material factor:', error);
    
    // Fallback to static factors for resilience
    const staticFactor = MATERIAL_FACTORS[materialIdentifier]?.factor;
    return staticFactor || 1.0;
  }
}

/**
 * Get detailed information about a material
 */
export async function getMaterialDetails(materialIdentifier: string): Promise<ExtendedMaterialData> {
  if (!materialIdentifier) {
    return createFallbackMaterial('unknown');
  }
  
  try {
    return await resolveMaterial(materialIdentifier);
  } catch (error) {
    console.error('Error getting material details:', error);
    return createFallbackMaterial(materialIdentifier);
  }
}

/**
 * Batch resolve multiple materials at once (for performance)
 */
export async function batchResolveMaterials(materialIds: string[]): Promise<Record<string, ExtendedMaterialData>> {
  const result: Record<string, ExtendedMaterialData> = {};
  
  if (!materialIds || materialIds.length === 0) {
    return result;
  }
  
  try {
    // Import cache and fetch services dynamically to avoid circular dependencies
    const { getCachedMaterials } = await import('./cache/materialCacheService');
    const { fetchMaterials } = await import('./fetch/materialFetchService');
    
    // Get all materials at once for efficiency
    let allMaterials: ExtendedMaterialData[] = [];
    
    // First try cache
    allMaterials = await getCachedMaterials() || [];
    
    // If cache is empty, fetch from database
    if (allMaterials.length === 0) {
      allMaterials = await fetchMaterials();
    }
    
    // Process each requested material
    for (const id of materialIds) {
      // Handle database IDs
      if (isDatabaseMaterialId(id)) {
        const dbId = extractDatabaseId(id);
        const found = allMaterials.find(m => m.id === dbId);
        
        if (found) {
          result[id] = found;
        } else {
          // Create fallback for missing database materials
          result[id] = createFallbackMaterial(id);
        }
      } 
      // Handle static material types
      else {
        // Check if it's a static material
        if (MATERIAL_FACTORS[id]) {
          const staticInfo = MATERIAL_FACTORS[id];
          result[id] = {
            id: id,
            name: staticInfo.name || id,
            factor: staticInfo.factor,
            unit: staticInfo.unit || 'kg',
            region: 'Global',
            category: 'Static',
            sustainabilityScore: 60,
            recyclability: 'Medium'
          };
        } else {
          // Create fallback for unknown material types
          result[id] = createFallbackMaterial(id);
        }
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in batch resolving materials:', error);
    
    // Return fallbacks for all requested materials
    return materialIds.reduce((acc, id) => {
      acc[id] = createFallbackMaterial(id);
      return acc;
    }, {} as Record<string, ExtendedMaterialData>);
  }
}

/**
 * Enrich material input with database information
 */
export async function enrichMaterialInput(material: MaterialInput): Promise<MaterialInput> {
  if (!material || !material.type) return material;
  
  try {
    const materialDetails = await getMaterialDetails(material.type);
    
    // Only enrich certain properties to avoid overriding user input
    return {
      ...material,
      unit: material.unit || materialDetails.unit,
      region: material.region || materialDetails.region
    };
  } catch (error) {
    console.error('Error enriching material input:', error);
    return material;
  }
}
