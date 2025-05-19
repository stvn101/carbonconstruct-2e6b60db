
import { Material, SustainableMaterial, MaterialCategory } from './Material.ts';

/**
 * Calculate the percentage of sustainable materials in a project
 */
export function calculateSustainableMaterialPercentage(
  materials: Material[]
): number {
  if (!materials || materials.length === 0) return 0;

  const sustainableMaterials = materials.filter(
    (m) => 'sustainabilityScore' in m && (m as SustainableMaterial).sustainabilityScore > 70
  );

  return (sustainableMaterials.length / materials.length) * 100;
}

/**
 * Identify materials with the highest carbon footprint
 */
export function identifyHighImpactMaterials(
  materials: Material[]
): Material[] {
  if (!materials || materials.length === 0) return [];

  // Sort by carbon footprint * quantity (if available)
  const sortedMaterials = [...materials].sort((a, b) => {
    const impactA = a.carbonFootprint * (a.quantity || 1);
    const impactB = b.carbonFootprint * (b.quantity || 1);
    return impactB - impactA;
  });

  // Return top 30% of materials or at least 3 materials
  const numToReturn = Math.max(3, Math.ceil(materials.length * 0.3));
  return sortedMaterials.slice(0, numToReturn);
}

/**
 * Generate alternative sustainable materials
 */
export function generateMaterialAlternatives(
  material: Material
): SustainableMaterial[] {
  const alternatives: SustainableMaterial[] = [];
  
  // This is a simplified implementation
  // In a real scenario, this would query a database of sustainable alternatives
  
  switch (material.category) {
    case MaterialCategory.CONCRETE:
      alternatives.push({
        ...material,
        id: `alt-${material.id}-1`,
        name: "Low-Carbon Concrete",
        carbonFootprint: material.carbonFootprint * 0.7,
        sustainabilityScore: 85,
        alternativeTo: material.id,
        carbonReduction: 30,
        costDifference: 5,
        availability: 'high',
        recyclable: true,
        recycledContent: 20
      });
      break;
      
    case MaterialCategory.STEEL:
      alternatives.push({
        ...material,
        id: `alt-${material.id}-1`,
        name: "Recycled Steel",
        carbonFootprint: material.carbonFootprint * 0.6,
        sustainabilityScore: 90,
        alternativeTo: material.id,
        carbonReduction: 40,
        costDifference: -2,
        availability: 'high',
        recyclable: true,
        recycledContent: 95
      });
      break;
      
    case MaterialCategory.TIMBER:
      alternatives.push({
        ...material,
        id: `alt-${material.id}-1`,
        name: "FSC Certified Timber",
        carbonFootprint: material.carbonFootprint * 0.5,
        sustainabilityScore: 95,
        alternativeTo: material.id,
        carbonReduction: 50,
        costDifference: 8,
        availability: 'medium',
        recyclable: true,
        recycledContent: 0,
        locallySourced: true
      });
      break;
      
    // Add other category cases as needed
      
    default:
      // For any other category, suggest a generic alternative with 20% improvement
      alternatives.push({
        ...material,
        id: `alt-${material.id}-1`,
        name: `Eco-friendly ${material.name}`,
        carbonFootprint: material.carbonFootprint * 0.8,
        sustainabilityScore: 75,
        alternativeTo: material.id,
        carbonReduction: 20,
        costDifference: 10,
        availability: 'medium',
        recyclable: true
      });
  }
  
  return alternatives;
}
