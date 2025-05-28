
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export function createFallbackMaterial(
  name: string, 
  factor: number, 
  category: string = 'Other'
): ExtendedMaterialData {
  return {
    id: `fallback-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    factor,
    unit: 'kg',
    region: 'Australia',
    tags: ['fallback'],
    sustainabilityScore: 50,
    recyclability: 'Medium' as const,
    notes: 'Fallback material data',
    category,
    carbon_footprint_kgco2e_kg: factor,
    carbon_footprint_kgco2e_tonne: factor * 1000,
    description: `Fallback data for ${name}`
  };
}

export function generateFallbackMaterials(): ExtendedMaterialData[] {
  return [
    createFallbackMaterial('Concrete', 0.15, 'Concrete'),
    createFallbackMaterial('Steel', 2.5, 'Steel'),
    createFallbackMaterial('Timber', 0.5, 'Timber'),
    createFallbackMaterial('Brick', 0.2, 'Masonry'),
    createFallbackMaterial('Glass', 1.2, 'Glass')
  ];
}
