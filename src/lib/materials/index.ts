
import { MATERIAL_FACTORS as BASE_MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { MATERIAL_TYPES, REGIONS } from './types';
import { ExtendedMaterialData } from './materialTypes';

// Re-export types and constants
export { MATERIAL_TYPES, REGIONS } from './types';
export * from './materialTypes';

// Export constants
export const MATERIAL_FACTORS = BASE_MATERIAL_FACTORS;

// Create and export extended materials data
export const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = Object.entries(BASE_MATERIAL_FACTORS).reduce((acc, [key, value]) => {
  // Transform to ExtendedMaterialData format
  acc[key] = {
    name: value.name || key,
    factor: value.factor,
    unit: value.unit || 'kg',
    region: 'Australia', // Default region
    tags: ['construction'], // Default tags
    sustainabilityScore: Math.floor(Math.random() * 40) + 60, // Example data
    recyclability: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as 'High' | 'Medium' | 'Low', // Example data
    alternativeTo: undefined,
    notes: ''
  };
  return acc;
}, {} as Record<string, ExtendedMaterialData>);

// Helper function to filter materials
export const filterMaterials = (predicate: (material: ExtendedMaterialData) => boolean): ExtendedMaterialData[] => {
  return Object.values(EXTENDED_MATERIALS).filter(predicate);
};
