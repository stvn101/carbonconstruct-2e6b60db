
/**
 * Material Adapter
 * 
 * Adapts different material data formats to work consistently in the app
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';

// Prefix for database material IDs to distinguish them from static material types
const DB_MATERIAL_PREFIX = 'db-material-';

/**
 * Check if a material ID is a database material
 */
export function isDatabaseMaterialId(id: string): boolean {
  return id.startsWith(DB_MATERIAL_PREFIX);
}

/**
 * Extract the raw database ID from a prefixed material ID
 */
export function extractDatabaseId(id: string): string {
  return id.replace(DB_MATERIAL_PREFIX, '');
}

/**
 * Create a prefixed database material ID
 */
export function createDatabaseMaterialId(id: string): string {
  return `${DB_MATERIAL_PREFIX}${id}`;
}

/**
 * Resolve a material by its identifier (either static type or database id)
 */
export async function resolveMaterial(materialIdentifier: string): Promise<ExtendedMaterialData> {
  // Check if material is a database material
  if (isDatabaseMaterialId(materialIdentifier)) {
    // Extract the database ID and look up in the database
    const dbId = extractDatabaseId(materialIdentifier);
    return getDatabaseMaterialById(dbId);
  }
  
  // Otherwise, lookup in static materials
  if (MATERIAL_FACTORS[materialIdentifier]) {
    const staticMaterial = MATERIAL_FACTORS[materialIdentifier];
    return {
      id: materialIdentifier,
      name: staticMaterial.name || materialIdentifier,
      factor: staticMaterial.factor,
      unit: staticMaterial.unit || 'kg',
      category: guessCategoryFromName(staticMaterial.name || materialIdentifier),
      region: 'Global',
      tags: [guessCategoryFromName(staticMaterial.name || materialIdentifier).toLowerCase()]
    };
  }
  
  // If not found, create a fallback
  return createFallbackMaterial(materialIdentifier);
}

/**
 * Get a material from the database by ID
 */
async function getDatabaseMaterialById(dbId: string): Promise<ExtendedMaterialData> {
  try {
    // Import dynamically to avoid circular dependencies
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .eq('id', dbId)
      .single();
      
    if (error) throw error;
    if (!data) throw new Error(`Material ${dbId} not found`);
    
    // Convert from database format to ExtendedMaterialData
    return convertFromDatabaseFormat(data);
  } catch (error) {
    console.error(`Error fetching material ${dbId}:`, error);
    return createFallbackMaterial(`Unknown (${dbId})`);
  }
}

/**
 * Convert a database material to ExtendedMaterialData format
 */
export function convertFromDatabaseFormat(dbMaterial: any): ExtendedMaterialData {
  // Validate recyclability as one of the allowed values
  let recyclability: 'High' | 'Medium' | 'Low' = 'Medium';
  if (dbMaterial.recyclability) {
    if (['High', 'Medium', 'Low'].includes(dbMaterial.recyclability)) {
      recyclability = dbMaterial.recyclability as 'High' | 'Medium' | 'Low';
    }
  }
  
  return {
    id: dbMaterial.id,
    name: dbMaterial.name || dbMaterial.material || 'Unknown Material',
    factor: dbMaterial.factor || dbMaterial.carbon_footprint_kgco2e_kg || 1,
    carbon_footprint_kgco2e_kg: dbMaterial.carbon_footprint_kgco2e_kg,
    carbon_footprint_kgco2e_tonne: dbMaterial.carbon_footprint_kgco2e_tonne,
    unit: dbMaterial.unit || 'kg',
    region: dbMaterial.region || 'Global',
    tags: dbMaterial.tags || [],
    sustainabilityScore: dbMaterial.sustainabilityscore || dbMaterial.sustainability_score || 50,
    recyclability: recyclability,
    alternativeTo: dbMaterial.alternativeto,
    notes: dbMaterial.notes || dbMaterial.sustainability_notes,
    category: dbMaterial.category,
    description: dbMaterial.notes || dbMaterial.description || dbMaterial.sustainability_notes || ''
  };
}

/**
 * Create a fallback material when the requested one can't be found
 */
export function createFallbackMaterial(name: string): ExtendedMaterialData {
  return {
    id: `fallback-${name.replace(/\s+/g, '-').toLowerCase()}`,
    name: name,
    factor: 1.0, // Default factor
    unit: 'kg',
    region: 'Global',
    tags: [],
    sustainabilityScore: 50,
    recyclability: 'Medium',
    category: 'Other',
    description: `Generic material based on ${name}`
  };
}

/**
 * Guess a category based on material name
 */
function guessCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('concrete') || nameLower.includes('cement')) {
    return 'Concrete';
  }
  
  if (nameLower.includes('steel') || nameLower.includes('metal')) {
    return 'Steel';
  }
  
  if (nameLower.includes('timber') || nameLower.includes('wood')) {
    return 'Timber';
  }
  
  if (nameLower.includes('insulation')) {
    return 'Insulation';
  }
  
  return 'Other';
}
