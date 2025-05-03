
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Default material data to use when offline or API fails
 */
const FALLBACK_MATERIALS: ExtendedMaterialData[] = [
  {
    id: 'concrete-regular',
    name: 'Concrete (Regular)',
    category: 'Concrete',
    factor: 0.109,
    carbon_footprint_kgco2e_kg: 0.109,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'concrete-high-strength',
    name: 'Concrete (High Strength)',
    category: 'Concrete',
    factor: 0.159,
    carbon_footprint_kgco2e_kg: 0.159,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'steel-reinforced',
    name: 'Steel (Reinforced)',
    category: 'Steel',
    factor: 1.46,
    carbon_footprint_kgco2e_kg: 1.46,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'steel-structural',
    name: 'Steel (Structural)',
    category: 'Steel',
    factor: 1.85,
    carbon_footprint_kgco2e_kg: 1.85,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'timber-softwood',
    name: 'Timber (Softwood)',
    category: 'Timber',
    factor: 0.41,
    carbon_footprint_kgco2e_kg: 0.41,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'timber-hardwood',
    name: 'Timber (Hardwood)',
    category: 'Timber',
    factor: 0.86,
    carbon_footprint_kgco2e_kg: 0.86,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'brick-clay',
    name: 'Brick (Clay)',
    category: 'Masonry',
    factor: 0.24,
    carbon_footprint_kgco2e_kg: 0.24,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'insulation-fiberglass',
    name: 'Insulation (Fiberglass)',
    category: 'Insulation',
    factor: 1.35,
    carbon_footprint_kgco2e_kg: 1.35,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'glass-standard',
    name: 'Glass (Standard)',
    category: 'Glass',
    factor: 0.85,
    carbon_footprint_kgco2e_kg: 0.85,
    unit: 'kg',
    region: 'Australia'
  },
  {
    id: 'aluminum-standard',
    name: 'Aluminum (Standard)',
    category: 'Metals',
    factor: 8.24,
    carbon_footprint_kgco2e_kg: 8.24,
    unit: 'kg',
    region: 'Australia'
  }
];

/**
 * Get fallback materials when offline or API fails
 */
export function getFallbackMaterials(): ExtendedMaterialData[] {
  return [...FALLBACK_MATERIALS];
}

/**
 * Get default categories when offline or API fails
 */
export const getDefaultCategories = (): string[] => {
  return ['Concrete', 'Steel', 'Timber', 'Masonry', 'Insulation', 'Glass', 'Metals', 'Other'];
};
