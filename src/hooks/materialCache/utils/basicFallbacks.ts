
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
      factor: 0.107,
      unit: 'kg',
      category: 'Concrete',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityScore: 40,
      recyclability: 'Medium',
    },
    {
      id: 'steel-standard',
      name: 'Standard Steel',
      factor: 1.46,
      unit: 'kg',
      category: 'Steel',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityScore: 30,
      recyclability: 'High',
    },
    {
      id: 'timber-standard',
      name: 'Timber (Pine)',
      factor: 0.68,
      unit: 'kg',
      category: 'Timber',
      region: 'Australia',
      tags: ['structural', 'natural'],
      sustainabilityScore: 70,
      recyclability: 'Medium',
    },
    {
      id: 'glass-standard',
      name: 'Standard Glass',
      factor: 0.85,
      unit: 'kg',
      category: 'Glass',
      region: 'Australia',
      tags: ['finishing'],
      sustainabilityScore: 45,
      recyclability: 'High',
    },
    {
      id: 'brick-standard',
      name: 'Clay Brick',
      factor: 0.24,
      unit: 'kg',
      category: 'Masonry',
      region: 'Australia',
      tags: ['structural', 'common'],
      sustainabilityScore: 50,
      recyclability: 'Medium',
    }
  ];
};
