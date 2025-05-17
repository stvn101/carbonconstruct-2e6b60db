
/**
 * Provides fallback materials and categories when database connections fail
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Default categories for materials when API can't be reached
 */
export function getDefaultCategories(): string[] {
  return [
    'Concrete',
    'Metals',
    'Wood',
    'Glass',
    'Ceramics',
    'Insulation',
    'Plastics',
    'Aggregate',
    'Other'
  ];
}

/**
 * Generate fallback materials for offline use or when database is unavailable
 */
export function getFallbackMaterials(): ExtendedMaterialData[] {
  return [
    {
      id: '1',
      name: 'Concrete (standard)',
      factor: 0.159,
      carbon_footprint_kgco2e_kg: 0.159,
      carbon_footprint_kgco2e_tonne: 159,
      unit: 'kg',
      region: 'Australia',
      tags: ['Concrete', 'Structural', 'Foundation'],
      sustainabilityScore: 60,
      recyclability: 'Medium',
      notes: 'Standard concrete mix commonly used in construction.',
      category: 'Concrete'
    },
    {
      id: '2',
      name: 'Low-carbon concrete',
      factor: 0.119,
      carbon_footprint_kgco2e_kg: 0.119,
      carbon_footprint_kgco2e_tonne: 119,
      unit: 'kg',
      region: 'Australia',
      tags: ['Concrete', 'Sustainable', 'Foundation'],
      sustainabilityScore: 75,
      recyclability: 'High',
      alternativeTo: 'Concrete (standard)',
      notes: 'Concrete with reduced carbon impact through alternative binders or SCMs.',
      category: 'Concrete'
    },
    {
      id: '3',
      name: 'Steel (virgin)',
      factor: 2.81,
      carbon_footprint_kgco2e_kg: 2.81,
      carbon_footprint_kgco2e_tonne: 2810,
      unit: 'kg',
      region: 'Australia',
      tags: ['Metal', 'Structural'],
      sustainabilityScore: 40,
      recyclability: 'Medium',
      notes: 'Primary steel production from iron ore.',
      category: 'Metals'
    },
    {
      id: '4',
      name: 'Steel (recycled)',
      factor: 0.47,
      carbon_footprint_kgco2e_kg: 0.47,
      carbon_footprint_kgco2e_tonne: 470,
      unit: 'kg',
      region: 'Australia',
      tags: ['Metal', 'Recycled', 'Structural'],
      sustainabilityScore: 80,
      recyclability: 'High',
      alternativeTo: 'Steel (virgin)',
      notes: 'Steel produced from recycled scrap through electric arc furnace process.',
      category: 'Metals'
    },
    {
      id: '5',
      name: 'Timber (softwood)',
      factor: 0.63,
      carbon_footprint_kgco2e_kg: 0.63,
      carbon_footprint_kgco2e_tonne: 630,
      unit: 'kg',
      region: 'Australia',
      tags: ['Wood', 'Natural', 'Renewable'],
      sustainabilityScore: 85,
      recyclability: 'High',
      notes: 'Softwood timber from managed forests.',
      category: 'Wood'
    },
    {
      id: '6',
      name: 'Glass (float)',
      factor: 1.44,
      carbon_footprint_kgco2e_kg: 1.44,
      carbon_footprint_kgco2e_tonne: 1440,
      unit: 'kg',
      region: 'Australia',
      tags: ['Glass', 'Building Envelope'],
      sustainabilityScore: 50,
      recyclability: 'Medium',
      notes: 'Standard architectural flat glass.',
      category: 'Glass'
    },
    {
      id: '7',
      name: 'Brick (standard)',
      factor: 0.24,
      carbon_footprint_kgco2e_kg: 0.24,
      carbon_footprint_kgco2e_tonne: 240,
      unit: 'kg',
      region: 'Australia',
      tags: ['Ceramics', 'Building Envelope'],
      sustainabilityScore: 70,
      recyclability: 'Medium',
      notes: 'Standard fired clay brick.',
      category: 'Ceramics'
    },
    {
      id: '8',
      name: 'Insulation (mineral wool)',
      factor: 1.28,
      carbon_footprint_kgco2e_kg: 1.28,
      carbon_footprint_kgco2e_tonne: 1280,
      unit: 'kg',
      region: 'Australia',
      tags: ['Insulation', 'Building Envelope', 'Thermal'],
      sustainabilityScore: 60,
      recyclability: 'Low',
      notes: 'Standard mineral wool insulation for thermal applications.',
      category: 'Insulation'
    }
  ];
}
