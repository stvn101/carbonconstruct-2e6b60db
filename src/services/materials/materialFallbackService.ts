
/**
 * Fallback service for providing material data when API is unavailable
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS, EXTENDED_MATERIALS } from '@/lib/materials';

/**
 * Get comprehensive fallback materials from both static data sources
 */
export function getFallbackMaterials(): ExtendedMaterialData[] {
  console.log('Using fallback materials');
  
  // First try to use the extended materials data which has more detailed information
  if (Object.keys(EXTENDED_MATERIALS).length > 0) {
    console.log('Using EXTENDED_MATERIALS for fallback', Object.keys(EXTENDED_MATERIALS).length, 'items');
    return Object.values(EXTENDED_MATERIALS);
  }
  
  // Fallback to basic material factors if extended isn't available
  console.log('Using MATERIAL_FACTORS for fallback');
  return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
    name: value.name || key,
    factor: value.factor,
    unit: value.unit || 'kg',
    region: 'Australia',
    tags: ['construction'],
    sustainabilityScore: 70,
    recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
    alternativeTo: undefined,
    notes: ''
  }));
}

/**
 * Try to load static test materials for offline/demo scenarios
 */
export function getTestMaterials(): ExtendedMaterialData[] {
  const testMaterials: ExtendedMaterialData[] = [
    {
      name: 'Concrete (General)',
      factor: 0.12,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'structural'],
      sustainabilityScore: 65,
      recyclability: 'Medium',
      notes: 'Standard concrete mix. NCC 2025 compliant.'
    },
    {
      name: 'Steel (Structural)',
      factor: 1.46,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'structural'],
      sustainabilityScore: 72,
      recyclability: 'High',
      notes: 'Structural steel beams and columns.'
    },
    {
      name: 'Timber (Pine)',
      factor: 0.20,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'natural'],
      sustainabilityScore: 85,
      recyclability: 'Medium',
      notes: 'Sustainably sourced pine timber.'
    },
    {
      name: 'Glass (Window)',
      factor: 0.86,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'finishes'],
      sustainabilityScore: 68,
      recyclability: 'High',
      notes: 'Standard window glass.'
    },
    {
      name: 'Brick (Clay)',
      factor: 0.24,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'masonry'],
      sustainabilityScore: 70,
      recyclability: 'Medium',
      notes: 'Standard clay brick.'
    }
  ];
  
  return testMaterials;
}

/**
 * Get default categories when API is unavailable
 */
export function getDefaultCategories(): string[] {
  return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass', 'Masonry', 'Metals', 'Plastics'];
}
