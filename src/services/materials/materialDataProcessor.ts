
/**
 * Utilities for processing material data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { SupabaseMaterial } from './materialTypes';

/**
 * Process data in batches to avoid UI freezing
 */
export function processDataInBatches(data: SupabaseMaterial[]): ExtendedMaterialData[] {
  const BATCH_SIZE = 50;
  const result: ExtendedMaterialData[] = [];
  
  console.time('Process materials');
  
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    
    // Transform the batch from Supabase format to our ExtendedMaterialData format
    // Adding robust defaults for all fields that might be missing
    const transformedBatch = batch.map((material: SupabaseMaterial) => ({
      name: material.name || 'Unnamed Material',
      factor: material.carbon_footprint_kgco2e_kg || 0,
      // Default to kg if unit is missing
      unit: 'kg', 
      // Default to Australia if region is missing
      region: 'Australia', 
      // Use category as tag if available, otherwise default to construction
      tags: material.category ? [material.category] : ['construction'],
      // Calculate sustainability score if possible, otherwise use default
      sustainabilityScore: calculateSustainabilityScore(material.carbon_footprint_kgco2e_kg),
      // Determine recyclability or default to Medium
      recyclability: determineRecyclability(material.category) as 'High' | 'Medium' | 'Low',
      // These fields might be missing in the database, so default to undefined
      alternativeTo: undefined,
      notes: ''
    }));
    
    result.push(...transformedBatch);
  }
  
  console.timeEnd('Process materials');
  return result;
}

/**
 * Calculate a sustainability score based on carbon footprint
 */
export function calculateSustainabilityScore(carbonFootprint: number | null | undefined): number {
  if (carbonFootprint === null || carbonFootprint === undefined) return 70; // Default score
  
  // Lower carbon footprint means higher sustainability score
  // Capped between 10 and 95
  const inverseScore = Math.max(10, Math.min(95, 100 - (carbonFootprint * 10)));
  return Math.round(inverseScore);
}

/**
 * Determine recyclability based on material category
 */
export function determineRecyclability(category: string | null | undefined): string {
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
