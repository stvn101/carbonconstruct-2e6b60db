
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
  const dbMaterialId = createDatabaseMaterialId(material.id);
  
  return {
    id: dbMaterialId,
    name: material.name || material.material || 'Unknown Material',
    factor: material.factor || material.carbon_footprint_kgco2e_kg || 1.0,
    carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg || material.factor,
    carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne,
    unit: material.unit || 'kg',
    region: material.region || 'Global',
    sustainabilityScore: material.sustainabilityScore || material.sustainability_score,
    recyclability: material.recyclability || 'Medium',
    alternativeTo: material.alternativeTo,
    notes: material.notes,
    category: material.category || material.applicable_standards,
    tags: Array.isArray(material.tags) ? material.tags : []
  };
}

/**
 * Create a fallback material for when a material can't be found
 */
export function createFallbackMaterial(materialType: string): ExtendedMaterialData {
  // Try to get information from static factors if available
  const staticInfo = MATERIAL_FACTORS[materialType];
  
  return {
    id: `fallback-${materialType}`,
    name: staticInfo ? staticInfo.name : materialType,
    factor: staticInfo ? staticInfo.factor : 1.0,
    unit: staticInfo ? staticInfo.unit || 'kg' : 'kg',
    region: 'Global',
    category: 'Other',
    tags: ['fallback'],
    sustainabilityScore: 50,
    recyclability: 'Medium'
  };
}

/**
 * Normalize material type to ensure consistent lookup
 */
export function normalizeMaterialType(materialType: string): string {
  if (!materialType) return 'unknown';
  
  // Convert to lowercase and remove special characters
  return materialType.toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Universal material resolver that can handle both database and static materials
 */
export async function resolveMaterial(materialIdentifier: string): Promise<ExtendedMaterialData> {
  // Import dynamically to avoid circular dependencies
  const { fetchMaterials } = await import('./fetch/materialFetchService');
  const { getCachedMaterials } = await import('./cache/materialCacheService');
  
  try {
    // Check if it's a database material ID
    if (isDatabaseMaterialId(materialIdentifier)) {
      const dbId = extractDatabaseId(materialIdentifier);
      
      // Try cache first
      const cachedMaterials = await getCachedMaterials();
      if (cachedMaterials && cachedMaterials.length > 0) {
        const found = cachedMaterials.find(m => m.id === dbId);
        if (found) return adaptDatabaseMaterial(found);
      }
      
      // If not in cache or no cache available, fetch from database
      const materials = await fetchMaterials();
      const material = materials.find(m => m.id === dbId);
      if (material) return adaptDatabaseMaterial(material);
    }
    
    // If not a database ID or not found, try as a static material type
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
    
    // Try normalized lookup for static materials
    const normalizedType = normalizeMaterialType(materialIdentifier);
    const normalizedMatch = Object.keys(MATERIAL_FACTORS).find(key => 
      normalizeMaterialType(key) === normalizedType
    );
    
    if (normalizedMatch) {
      const staticInfo = MATERIAL_FACTORS[normalizedMatch];
      return {
        id: normalizedMatch,
        name: staticInfo.name || normalizedMatch,
        factor: staticInfo.factor,
        unit: staticInfo.unit || 'kg',
        region: 'Global',
        category: 'Static',
        sustainabilityScore: 60,
        recyclability: 'Medium'
      };
    }
    
    // Return a fallback material if all else fails
    return createFallbackMaterial(materialIdentifier);
  } catch (error) {
    console.error('Failed to resolve material:', materialIdentifier, error);
    return createFallbackMaterial(materialIdentifier);
  }
}
