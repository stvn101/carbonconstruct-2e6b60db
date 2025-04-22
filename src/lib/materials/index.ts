
import { MATERIAL_FACTORS as BASE_MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { MATERIAL_TYPES, REGIONS } from './types';
import { ExtendedMaterialData } from './materialTypes';

// Re-export types and constants
export { MATERIAL_TYPES, REGIONS } from './types';
export * from './materialTypes';

// Export constants
export const MATERIAL_FACTORS = BASE_MATERIAL_FACTORS;

// Helper function to filter materials
export const filterMaterials = (predicate: (material: ExtendedMaterialData) => boolean): ExtendedMaterialData[] => {
  const materials = Object.entries(BASE_MATERIAL_FACTORS).map(([key, value]) => {
    // Transform to ExtendedMaterialData format
    const extendedMaterial: ExtendedMaterialData = {
      name: value.name || key,
      factor: value.factor,
      unit: value.unit || 'kg',
      region: value.region || 'Australia',
      tags: value.tags || ['construction'],
      notes: value.notes,
      alternativeTo: value.alternativeTo,
      sustainabilityScore: Math.floor(Math.random() * 40) + 60, // Example data
      recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low' // Example data
    };
    
    return extendedMaterial;
  });
  
  return materials.filter(predicate);
};
