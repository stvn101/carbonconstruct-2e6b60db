
import { SupabaseMaterial } from '@/services/materials/materialTypes';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Adapts Supabase material data to the ExtendedMaterialData type
 * Ensures all required fields are present with appropriate defaults
 */
export function adaptSupabaseMaterialToExtended(material: SupabaseMaterial): ExtendedMaterialData {
  return {
    id: material.id?.toString() || '',
    name: material.name || material.material || '',
    factor: material.factor || material.co2e_avg || 1.0, // Default factor if not provided
    unit: material.unit || 'kg',
    region: material.region || 'Global',
    tags: material.tags || [],
    sustainabilityScore: material.sustainabilityScore || material.sustainability_score || 50,
    recyclability: normalizeRecyclabilityValue(material.recyclability || ''),
    alternativeTo: material.alternativeTo || '',
    notes: material.notes || material.sustainability_notes || '',
    category: material.category || '',
    carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg || material.co2e_avg || 0,
    carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne || 0,
    description: material.description || material.notes || material.sustainability_notes || ''
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
