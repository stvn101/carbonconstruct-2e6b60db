
/**
 * Utility functions for material performance service
 */
import { MaterialInput } from '@/lib/carbonExports';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Calculates potential carbon reduction percentage
 */
export function calculatePotentialReduction(
  originalMaterial: MaterialInput, 
  alternative: ExtendedMaterialData
): number {
  const originalImpact = (originalMaterial as any).factor || 1;
  const alternativeImpact = alternative.factor;
  
  if (originalImpact <= 0) return 0;
  
  const reduction = ((originalImpact - alternativeImpact) / originalImpact) * 100;
  return Math.round(reduction * 10) / 10; // Round to 1 decimal place
}

/**
 * Determines cost impact of an alternative material
 */
export function determineCostImpact(material: ExtendedMaterialData): 'lower' | 'similar' | 'higher' {
  // This would typically use actual cost data
  // For now, we'll use a simple heuristic based on sustainability score
  if (!material.sustainabilityScore) return 'similar';
  
  if (material.sustainabilityScore > 80) return 'higher';
  if (material.sustainabilityScore < 50) return 'lower';
  return 'similar';
}

/**
 * Determines availability of an alternative material
 */
export function determineAvailability(material: ExtendedMaterialData): 'low' | 'medium' | 'high' {
  // This would typically use actual supply chain data
  // For now, we'll use a simple heuristic based on recyclability
  if (!material.recyclability) return 'medium';
  
  if (material.recyclability === 'High') return 'high';
  if (material.recyclability === 'Low') return 'low';
  return 'medium';
}

/**
 * Generates recommendation details text
 */
export function generateRecommendationDetails(
  originalMaterial: MaterialInput, 
  alternative: ExtendedMaterialData
): string {
  return `${alternative.name} has a lower carbon footprint compared to ${originalMaterial.type}. ${
    alternative.notes || ''
  }${
    alternative.recyclability === 'High' 
      ? ' Additionally, this material has high recyclability at end of life.'
      : ''
  }`;
}

/**
 * Calculates sustainability score based on material properties
 */
export function calculateSustainabilityScore(material: MaterialInput): number {
  // This would typically be a more complex calculation
  // For now, we'll use a simple estimate between 0-100
  const baseScore = 60;
  
  // Add some random variation
  const variation = Math.floor(Math.random() * 30) - 15; // -15 to +15
  
  const totalScore = baseScore + variation;
  return Math.min(100, Math.max(0, totalScore)); // Ensure score is between 0-100
}

/**
 * Gets category from material type
 */
export function getCategoryFromType(materialType: string): string {
  // Simple mapping, would be more sophisticated in production
  const categoryMap: Record<string, string> = {
    'concrete': 'Structural',
    'timber': 'Structural',
    'steel': 'Structural',
    'glass': 'Envelope',
    'aluminum': 'Envelope',
    'insulation': 'Insulation',
    'brick': 'Masonry',
    'gypsum': 'Interior'
  };
  
  const materialLower = materialType.toLowerCase();
  
  for (const [key, category] of Object.entries(categoryMap)) {
    if (materialLower.includes(key)) {
      return category;
    }
  }
  
  return 'Other';
}
