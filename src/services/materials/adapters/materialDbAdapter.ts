
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { DbMaterial } from '../materialTypes';

/**
 * Adapts material data from the database format to the application format
 */
export function adaptDbMaterialToApp(dbMaterial: DbMaterial): ExtendedMaterialData {
  // Generate a string ID from the numeric ID for backwards compatibility
  const stringId = String(dbMaterial.id);
  
  return {
    id: stringId,
    name: dbMaterial.material,
    factor: dbMaterial.co2e_avg || 0,
    carbon_footprint_kgco2e_kg: dbMaterial.co2e_avg,
    // Convert kg to tonnes if needed
    carbon_footprint_kgco2e_tonne: dbMaterial.co2e_avg ? dbMaterial.co2e_avg / 1000 : undefined, 
    sustainabilityScore: dbMaterial.sustainability_score,
    recyclability: determineRecyclability(dbMaterial.sustainability_score),
    category: dbMaterial.applicable_standards,
    notes: dbMaterial.sustainability_notes,
    // Default values for fields not directly mapping to the database schema
    unit: 'kg',
    region: 'Australia',
    tags: dbMaterial.applicable_standards ? [dbMaterial.applicable_standards] : [],
    alternativeTo: undefined,
  };
}

/**
 * Determine recyclability based on sustainability score
 */
function determineRecyclability(score?: number): 'High' | 'Medium' | 'Low' {
  if (!score) return 'Low';
  if (score >= 70) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}
