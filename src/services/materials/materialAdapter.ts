
/**
 * Material Adapter System
 * Provides unified handling for both static and database materials
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { adaptMaterialFromDatabase } from '@/lib/materialCategories';

// Material source types
export type MaterialSourceType = 'static' | 'database' | 'fallback';

// Material identifier format utilities
export function isDatabaseMaterialId(id: string): boolean {
  return id.startsWith('db-');
}

export function extractDatabaseId(materialId: string): string {
  if (isDatabaseMaterialId(materialId)) {
    return materialId.substring(3); // Remove 'db-' prefix
  }
  return materialId;
}

export function createDatabaseMaterialId(originalId: string | number): string {
  // Remove any existing prefix to avoid double prefixing
  const cleanId = String(originalId).replace(/^db-/, '');
  return `db-${cleanId}`;
}

// Material adaptation utilities
export function getStaticMaterialFactor(materialType: string): number {
  const material = MATERIAL_FACTORS[materialType];
  return material ? material.factor : 1.0;
}

/**
 * Adapt a database material to the standard ExtendedMaterialData format
 */
export function adaptDatabaseMaterial(material: any): ExtendedMaterialData {
  if (!material) return createFallbackMaterial('unknown');
  
  // Create a properly formatted database material ID
  const dbId = material.id ? createDatabaseMaterialId(material.id) : undefined;
  
  return {
    id: dbId,
    name: material.name || material.material || 'Unnamed Material',
    factor: material.carbon_footprint_kgco2e_kg || material.factor || 1.0,
    unit: material.unit || 'kg',
    region: material.region || 'Australia',
    tags: Array.isArray(material.tags) ? material.tags : 
          material.category ? [material.category] : ['construction'],
    sustainabilityScore: material.sustainabilityScore || 60,
    recyclability: material.recyclability || 'Medium',
    alternativeTo: material.alternativeTo,
    notes: material.notes || '',
    category: material.category || 'Other'
  };
}

/**
 * Creates a fallback material when a material cannot be resolved
 */
export function createFallbackMaterial(id: string): ExtendedMaterialData {
  return {
    id,
    name: `Unknown Material (${id})`,
    factor: 1.0,
    unit: 'kg',
    region: 'Global',
    tags: ['unknown'],
    sustainabilityScore: 50,
    recyclability: 'Medium',
    category: 'Unknown'
  };
}

/**
 * Resolve a material by its identifier from various sources
 */
export async function resolveMaterial(materialIdentifier: string): Promise<ExtendedMaterialData> {
  if (!materialIdentifier) {
    return createFallbackMaterial('unknown');
  }
  
  try {
    // Import services dynamically to avoid circular dependencies
    const { getCachedMaterials } = await import('./cache');
    const { fetchMaterials } = await import('./fetch/materialFetchService');
    
    // Check if it's a static material
    if (MATERIAL_FACTORS[materialIdentifier]) {
      const staticInfo = MATERIAL_FACTORS[materialIdentifier];
      return {
        id: materialIdentifier,
        name: staticInfo.name || materialIdentifier,
        factor: staticInfo.factor,
        unit: staticInfo.unit || 'kg',
        region: 'Global',
        category: 'Static',
        sustainabilityScore: 60,
        recyclability: 'Medium'
      };
    }
    
    // Check if it's a database material ID
    if (isDatabaseMaterialId(materialIdentifier)) {
      const dbId = extractDatabaseId(materialIdentifier);
      
      // Try to get from cache first
      const cachedMaterials = await getCachedMaterials();
      if (cachedMaterials) {
        const cachedMaterial = cachedMaterials.find(m => m.id === dbId);
        if (cachedMaterial) {
          return cachedMaterial;
        }
      }
      
      // If not in cache, fetch from database
      const fetchedMaterials = await fetchMaterials();
      const fetchedMaterial = fetchedMaterials.find(m => m.id === dbId);
      
      if (fetchedMaterial) {
        return fetchedMaterial;
      }
    }
    
    // If we couldn't resolve the material, create a fallback
    return createFallbackMaterial(materialIdentifier);
  } catch (error) {
    console.error('Error resolving material:', error);
    return createFallbackMaterial(materialIdentifier);
  }
}
