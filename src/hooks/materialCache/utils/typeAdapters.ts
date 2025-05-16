
import { SupabaseMaterial } from '@/services/materials/materialTypes';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Adapts Supabase material data to the ExtendedMaterialData type
 * Ensures all required fields are present with appropriate defaults
 */
export function adaptSupabaseMaterialToExtended(material: SupabaseMaterial): ExtendedMaterialData {
  return {
    id: material.id,
    name: material.name || '',
    factor: material.factor || 1.0, // Default factor if not provided
    unit: material.unit,
    region: material.region,
    tags: material.tags,
    sustainabilityScore: material.sustainabilityscore,
    recyclability: normalizeRecyclabilityValue(material.recyclability),
    alternativeTo: material.alternativeto,
    notes: material.notes,
    category: material.category,
    carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg,
    carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne
  };
}

/**
 * Adapts an array of Supabase materials to ExtendedMaterialData array
 */
export function adaptSupabaseMaterialsToExtended(materials: SupabaseMaterial[]): ExtendedMaterialData[] {
  return materials
    .filter(material => material && typeof material === 'object')
    .map(adaptSupabaseMaterialToExtended);
}

/**
 * Normalize recyclability values to supported enum values
 */
function normalizeRecyclabilityValue(value?: string): 'High' | 'Medium' | 'Low' {
  if (!value) return 'Low';
  
  const normalized = value.toLowerCase();
  if (normalized.includes('high') || normalized.includes('very')) {
    return 'High';
  } else if (normalized.includes('medium') || normalized.includes('mod')) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
