
/**
 * Material Data Mapping Service
 * Maps data between different material formats for consistency
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Maps raw materials data from database to the ExtendedMaterialData format
 * @param materials Raw materials from database
 * @returns Mapped materials in consistent format
 */
export function mapDatabaseMaterials(materials: any[]): ExtendedMaterialData[] {
  if (!materials || !Array.isArray(materials)) {
    return [];
  }

  try {
    return materials.map(material => {
      // Calculate sustainability score if not present
      const sustainabilityScore = material.sustainabilityscore || 
                                  calculateSustainabilityScore(material);
      
      // Determine recyclability if not present
      const recyclability = material.recyclability || 
                            determineRecyclability(material, sustainabilityScore);
      
      // Map to consistent format
      return {
        id: material.id?.toString(),
        name: material.name || material.material || 'Unknown Material',
        factor: typeof material.factor === 'number' ? material.factor : 
                (material.carbon_footprint_kgco2e_kg || 0),
        carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg,
        carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne,
        unit: material.unit || 'kg',
        region: material.region || 'Global',
        tags: Array.isArray(material.tags) ? material.tags : 
              (material.category ? [material.category] : []),
        sustainabilityScore,
        recyclability,
        alternativeTo: material.alternativeto || material.alternativeTo,
        notes: material.notes,
        category: material.category,
        description: material.description
      };
    }).filter(Boolean);
  } catch (error) {
    console.error('Error mapping database materials:', error);
    return [];
  }
}

/**
 * Calculate sustainability score based on material properties
 */
function calculateSustainabilityScore(material: any): number {
  // Basic algorithm for sustainability score calculation
  let score = 50; // Default middle score
  
  // Lower score for higher carbon footprint
  if (material.carbon_footprint_kgco2e_kg) {
    score -= Math.min(material.carbon_footprint_kgco2e_kg * 10, 30);
  }
  
  // Bonus for materials with specific tags
  if (Array.isArray(material.tags)) {
    const sustainableTags = ['recycled', 'renewable', 'sustainable', 'natural'];
    for (const tag of sustainableTags) {
      if (material.tags.includes(tag)) {
        score += 10;
      }
    }
  }
  
  // Cap the score between 0 and 100
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine recyclability based on material properties
 */
function determineRecyclability(material: any, sustainabilityScore: number): 'High' | 'Medium' | 'Low' {
  // Simple determination based on sustainability score
  if (sustainabilityScore >= 70) {
    return 'High';
  } else if (sustainabilityScore >= 40) {
    return 'Medium';
  } else {
    return 'Low';
  }
}
