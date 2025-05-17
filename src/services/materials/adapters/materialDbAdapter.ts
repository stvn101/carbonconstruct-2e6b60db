
/**
 * Adapter to convert between the database schema and the application model
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export interface DbMaterial {
  id: number;
  category_id?: number;
  material: string;
  description?: string;
  co2e_min?: number;
  co2e_max?: number;
  co2e_avg?: number;
  sustainability_score?: number;
  sustainability_score_is_manual?: boolean;
  applicable_standards?: string;
  ncc_requirements?: string;
  sustainability_notes?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Convert a database material to the application model
 */
export function adaptDbMaterialToApp(dbMaterial: DbMaterial): ExtendedMaterialData {
  return {
    id: String(dbMaterial.id),
    name: dbMaterial.material,
    factor: dbMaterial.co2e_avg || 0,
    carbon_footprint_kgco2e_kg: dbMaterial.co2e_avg,
    carbon_footprint_kgco2e_tonne: dbMaterial.co2e_avg ? dbMaterial.co2e_avg * 1000 : undefined,
    unit: 'kg',
    region: 'Australia',
    category: dbMaterial.applicable_standards || 'Other',
    tags: extractTagsFromDbMaterial(dbMaterial),
    sustainabilityScore: dbMaterial.sustainability_score,
    recyclability: determineRecyclability(dbMaterial.sustainability_score),
    notes: dbMaterial.description || dbMaterial.sustainability_notes || '',
  };
}

/**
 * Extract tags from a database material
 */
function extractTagsFromDbMaterial(dbMaterial: DbMaterial): string[] {
  const tags: string[] = [];
  
  // Extract from various fields to create meaningful tags
  if (dbMaterial.applicable_standards) {
    tags.push(dbMaterial.applicable_standards);
  }
  
  if (dbMaterial.ncc_requirements) {
    tags.push('NCC Compliant');
  }
  
  if (dbMaterial.sustainability_score && dbMaterial.sustainability_score > 80) {
    tags.push('Highly Sustainable');
  } else if (dbMaterial.sustainability_score && dbMaterial.sustainability_score > 60) {
    tags.push('Sustainable');
  }
  
  return tags.length > 0 ? tags : ['construction'];
}

/**
 * Determine recyclability based on sustainability score
 */
function determineRecyclability(score?: number): 'High' | 'Medium' | 'Low' {
  if (!score) return 'Low';
  
  if (score > 80) {
    return 'High';
  } else if (score > 50) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
