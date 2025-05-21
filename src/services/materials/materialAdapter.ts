
/**
 * Material Adapter
 * Provides utilities for adapting between different material data formats
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';

const DATABASE_ID_PREFIX = 'db-material-';

/**
 * Checks if a material ID is from the database
 */
export function isDatabaseMaterialId(id: string): boolean {
  return id.startsWith(DATABASE_ID_PREFIX);
}

/**
 * Extracts the database ID from a prefixed ID
 */
export function extractDatabaseId(id: string): string {
  if (!isDatabaseMaterialId(id)) {
    return id;
  }
  
  return id.substring(DATABASE_ID_PREFIX.length);
}

/**
 * Creates a database material ID
 */
export function createDatabaseMaterialId(dbId: string): string {
  return `${DATABASE_ID_PREFIX}${dbId}`;
}

/**
 * Resolves a material from various data sources
 */
export async function resolveMaterial(materialIdentifier: string): Promise<ExtendedMaterialData> {
  // Handle database material IDs
  if (isDatabaseMaterialId(materialIdentifier)) {
    const dbId = extractDatabaseId(materialIdentifier);
    return resolveMaterialFromDatabase(dbId);
  }
  
  // Handle static material types
  if (MATERIAL_FACTORS[materialIdentifier]) {
    return createMaterialFromStatic(materialIdentifier);
  }
  
  // If we can't resolve it, create a fallback
  return createFallbackMaterial(materialIdentifier);
}

/**
 * Resolves a material from the database
 */
async function resolveMaterialFromDatabase(dbId: string): Promise<ExtendedMaterialData> {
  try {
    // Import dynamically to avoid circular dependencies
    const { getCachedMaterials } = await import('./cache/materialCacheAPI');
    
    // Try to get from cache first
    const cachedMaterials = await getCachedMaterials();
    if (cachedMaterials && cachedMaterials.length > 0) {
      const cachedMaterial = cachedMaterials.find(m => m.id === dbId);
      if (cachedMaterial) {
        return cachedMaterial;
      }
    }
    
    // If not in cache, try to get directly from database
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .eq('id', dbId)
      .single();
      
    if (error) {
      console.error('Error resolving material from database:', error);
      return createFallbackMaterial(dbId);
    }
    
    if (!data) {
      return createFallbackMaterial(dbId);
    }
    
    // Convert to ExtendedMaterialData format
    return {
      id: data.id,
      name: data.name || 'Unknown Material',
      factor: data.factor || data.carbon_footprint_kgco2e_kg || 1,
      carbon_footprint_kgco2e_kg: data.carbon_footprint_kgco2e_kg,
      carbon_footprint_kgco2e_tonne: data.carbon_footprint_kgco2e_tonne,
      unit: data.unit || 'kg',
      region: data.region || 'Australia',
      tags: data.tags || [],
      sustainabilityScore: data.sustainabilityscore || 60,
      recyclability: data.recyclability || 'Medium',
      alternativeTo: data.alternativeto,
      notes: data.notes,
      category: data.category,
      description: data.description
    };
  } catch (error) {
    console.error('Error resolving material from database:', error);
    return createFallbackMaterial(dbId);
  }
}

/**
 * Creates a material from static data
 */
function createMaterialFromStatic(materialType: string): ExtendedMaterialData {
  const staticMaterial = MATERIAL_FACTORS[materialType];
  
  return {
    id: materialType,
    name: staticMaterial.name || materialType,
    factor: staticMaterial.factor,
    carbon_footprint_kgco2e_kg: staticMaterial.factor,
    unit: staticMaterial.unit || 'kg',
    region: 'Global', // Static materials are global by default
    tags: ['construction'],
    sustainabilityScore: 60, // Default score
    recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
    category: guessCategoryFromName(staticMaterial.name || materialType),
    description: `Standard construction material: ${staticMaterial.name || materialType}`
  };
}

/**
 * Creates a fallback material for when resolution fails
 */
export function createFallbackMaterial(identifier: string): ExtendedMaterialData {
  return {
    id: identifier,
    name: formatMaterialName(identifier),
    factor: 1.0, // Default factor
    carbon_footprint_kgco2e_kg: 1.0,
    unit: 'kg',
    region: 'Unknown',
    tags: ['unknown'],
    sustainabilityScore: 50,
    recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
    category: 'Other',
    description: `Material data could not be resolved for ${formatMaterialName(identifier)}`
  };
}

/**
 * Formats a material name from an identifier
 */
function formatMaterialName(identifier: string): string {
  // Remove any prefixes
  let name = identifier;
  if (isDatabaseMaterialId(identifier)) {
    name = extractDatabaseId(identifier);
  }
  
  // Convert kebab-case or snake_case to Title Case
  name = name
    .replace(/[-_]/g, ' ')
    .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  
  return name;
}

/**
 * Guesses a category based on material name
 */
function guessCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (
    nameLower.includes('concrete') || 
    nameLower.includes('cement') ||
    nameLower.includes('mortar')
  ) {
    return 'Concrete';
  }
  
  if (
    nameLower.includes('steel') || 
    nameLower.includes('metal') ||
    nameLower.includes('iron')
  ) {
    return 'Steel';
  }
  
  if (
    nameLower.includes('timber') || 
    nameLower.includes('wood')
  ) {
    return 'Timber';
  }
  
  if (
    nameLower.includes('glass') || 
    nameLower.includes('window')
  ) {
    return 'Glass';
  }
  
  if (
    nameLower.includes('insulation') || 
    nameLower.includes('wool') ||
    nameLower.includes('foam')
  ) {
    return 'Insulation';
  }
  
  return 'Other';
}
