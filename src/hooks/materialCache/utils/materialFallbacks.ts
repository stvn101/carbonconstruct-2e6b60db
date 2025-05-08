
/**
 * Utility functions for creating fallback materials when API requests fail
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';

/**
 * Helper function to create a material entry
 */
export const createMaterial = (
  name: string, 
  factor: number, 
  category: string, 
  tags: string[] = ['construction'], 
  sustainabilityScore: number = 70
): ExtendedMaterialData => {
  return {
    name,
    factor,
    unit: 'kg',
    region: 'Australia',
    tags,
    sustainabilityScore,
    recyclability: getRecyclability(name),
    category
  };
};

/**
 * Helper function to determine category from name
 */
export const getCategoryFromName = (name: string): string => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('concrete')) return 'Concrete';
  if (lowerName.includes('steel') || lowerName.includes('metal')) return 'Metals';
  if (lowerName.includes('timber') || lowerName.includes('wood')) return 'Wood';
  if (lowerName.includes('glass')) return 'Glass';
  if (lowerName.includes('brick') || lowerName.includes('ceramic') || lowerName.includes('tile')) return 'Ceramics';
  if (lowerName.includes('insulation')) return 'Insulation';
  if (lowerName.includes('plastic')) return 'Plastics';
  if (lowerName.includes('earth') || lowerName.includes('soil')) return 'Earth';
  return 'Other';
};

/**
 * Helper function to determine recyclability
 */
export const getRecyclability = (name: string): "High" | "Medium" | "Low" => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('recycled')) return 'High';
  if (lowerName.includes('steel') || lowerName.includes('metal')) return 'High';
  if (lowerName.includes('timber') || lowerName.includes('wood')) return 'High';
  if (lowerName.includes('glass')) return 'High';
  if (lowerName.includes('concrete')) return 'Medium';
  if (lowerName.includes('plastic')) return 'Low';
  if (lowerName.includes('earth') || lowerName.includes('soil')) return 'High';
  if (lowerName.includes('ceramic') || lowerName.includes('tile')) return 'Medium';
  
  // Randomized but weighted distribution
  const random = Math.random();
  if (random < 0.4) return 'High';
  if (random < 0.7) return 'Medium';
  return 'Low';
};

/**
 * Creates hard-coded fallback materials as a last resort
 */
export const getHardCodedFallbackMaterials = (): ExtendedMaterialData[] => {
  console.log('Using hard-coded fallback materials');
  return [
    createMaterial("Concrete", 0.159, "Concrete"),
    createMaterial("Steel", 1.77, "Metals"),
    createMaterial("Timber", 0.42, "Wood"),
    createMaterial("Glass", 0.85, "Glass"),
    createMaterial("Aluminium", 8.24, "Metals"),
    createMaterial("Brick", 0.24, "Ceramics"),
    createMaterial("Insulation", 1.86, "Insulation"),
    createMaterial("Low-Carbon Concrete", 0.110, "Concrete", ['sustainable', 'construction'], 85),
    createMaterial("Recycled Steel", 0.98, "Metals", ['recycled', 'construction'], 82)
  ];
};
