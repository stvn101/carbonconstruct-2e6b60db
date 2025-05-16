
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Creates a set of basic fallback materials when data cannot be loaded
 * @returns ExtendedMaterialData[] - Basic material data
 */
export const createBasicFallbackMaterials = (): ExtendedMaterialData[] => {
  return [
    {
      id: 'concrete-standard',
      name: 'Standard Concrete',
      carbon_footprint_kgco2e_kg: 0.107,
      carbon_footprint_kgco2e_tonne: 107,
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityscore: 40,
      recyclability: 'Medium',
      unit: 'kg'
    },
    {
      id: 'steel-standard',
      name: 'Standard Steel',
      carbon_footprint_kgco2e_kg: 1.46,
      carbon_footprint_kgco2e_tonne: 1460,
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityscore: 30,
      recyclability: 'High',
      unit: 'kg'
    },
    {
      id: 'timber-standard',
      name: 'Timber (Pine)',
      carbon_footprint_kgco2e_kg: 0.68,
      carbon_footprint_kgco2e_tonne: 680,
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'natural'],
      sustainabilityscore: 70,
      recyclability: 'Medium',
      unit: 'kg'
    },
    {
      id: 'glass-standard',
      name: 'Standard Glass',
      carbon_footprint_kgco2e_kg: 0.85,
      carbon_footprint_kgco2e_tonne: 850,
      category: 'Glass',
      region: 'Australia',
      tags: ['finishing'],
      sustainabilityscore: 45,
      recyclability: 'High',
      unit: 'kg'
    },
    {
      id: 'brick-standard',
      name: 'Clay Brick',
      carbon_footprint_kgco2e_kg: 0.24,
      carbon_footprint_kgco2e_tonne: 240, 
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityscore: 50,
      recyclability: 'Medium',
      unit: 'kg'
    }
  ];
};
