
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { performDbOperation } from './supabase';

export interface SupabaseMaterial {
  id: string;
  name: string;
  carbon_footprint_kgco2e_kg: number;
  carbon_footprint_kgco2e_tonne: number;
  category: string;
}

/**
 * Fetch all materials from Supabase
 */
export async function fetchMaterials(): Promise<ExtendedMaterialData[]> {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*');
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Transform the data from Supabase format to our ExtendedMaterialData format
      return data.map((material: SupabaseMaterial) => ({
        name: material.name || 'Unknown',
        factor: material.carbon_footprint_kgco2e_kg || 0,
        unit: 'kg', // Default unit
        region: 'Australia', // Default region for materials
        tags: [material.category || 'construction'], // Use category as tag
        sustainabilityScore: calculateSustainabilityScore(material.carbon_footprint_kgco2e_kg),
        recyclability: determineRecyclability(material.category) as 'High' | 'Medium' | 'Low',
        alternativeTo: undefined,
        notes: ''
      }));
    },
    'fetch materials',
    { fallbackData: [] }
  );
}

/**
 * Calculate a sustainability score based on carbon footprint
 */
function calculateSustainabilityScore(carbonFootprint: number | null | undefined): number {
  if (!carbonFootprint) return 70; // Default score
  
  // Lower carbon footprint means higher sustainability score
  // Capped between 10 and 95
  const inverseScore = Math.max(10, Math.min(95, 100 - (carbonFootprint * 10)));
  return Math.round(inverseScore);
}

/**
 * Determine recyclability based on material category
 */
function determineRecyclability(category: string | null | undefined): string {
  if (!category) return 'Medium';
  
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('metal') || 
      lowerCategory.includes('steel') || 
      lowerCategory.includes('aluminium') || 
      lowerCategory.includes('recycl')) {
    return 'High';
  } else if (lowerCategory.includes('concrete') ||
             lowerCategory.includes('brick') ||
             lowerCategory.includes('ceramic')) {
    return 'Medium';
  } else if (lowerCategory.includes('plastic') ||
             lowerCategory.includes('composite')) {
    return 'Low';
  }
  
  return 'Medium'; // Default
}
