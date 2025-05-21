
/**
 * Fallback data provider for when Supabase is unavailable
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';

/**
 * Get fallback materials
 */
export function getFallbackMaterials(): ExtendedMaterialData[] {
  // Generate fallback materials from carbon factors as a last resort
  return Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
    const name = value.name || key;
    const factor = value.factor || 0;
    
    return {
      id: `fallback-${key}`,
      name,
      factor,
      carbon_footprint_kgco2e_kg: factor,
      unit: value.unit || 'kg',
      region: 'Australia',
      tags: ['construction'],
      sustainabilityScore: calculateSimpleSustainabilityScore(factor),
      recyclability: determineSimpleRecyclability(name),
      alternativeTo: name.includes('recycled') ? name.replace('recycled ', '') : undefined,
      notes: 'Fallback data',
      category: determineCategory(name)
    };
  });
}

/**
 * Get default categories
 */
export function getDefaultCategories(): string[] {
  return [
    'Concrete',
    'Steel',
    'Wood',
    'Glass',
    'Insulation',
    'Brick',
    'Aluminum',
    'Other'
  ];
}

// Helper function to calculate a simple sustainability score
function calculateSimpleSustainabilityScore(carbonFootprint: number): number {
  if (carbonFootprint <= 0) return 100;
  if (carbonFootprint > 10) return 20;
  
  return Math.round(100 - (carbonFootprint / 10) * 80);
}

// Helper function to determine recyclability
function determineSimpleRecyclability(name: string): 'High' | 'Medium' | 'Low' {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('recycled') || 
      lowerName.includes('wood') || 
      lowerName.includes('timber')) {
    return 'High';
  }
  
  if (lowerName.includes('steel') || 
      lowerName.includes('aluminum') || 
      lowerName.includes('metal')) {
    return 'Medium';
  }
  
  return 'Low';
}

// Helper function to determine category
function determineCategory(name: string): string {
  const lowerName = name.toLowerCase();
  
  if (lowerName.includes('concrete')) return 'Concrete';
  if (lowerName.includes('steel')) return 'Steel';
  if (lowerName.includes('wood') || lowerName.includes('timber')) return 'Wood';
  if (lowerName.includes('glass')) return 'Glass';
  if (lowerName.includes('insulation')) return 'Insulation';
  if (lowerName.includes('brick')) return 'Brick';
  if (lowerName.includes('aluminum')) return 'Aluminum';
  
  return 'Other';
}
