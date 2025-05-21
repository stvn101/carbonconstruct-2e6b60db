
/**
 * Material Data Processing Utilities
 * Functions for processing material data in batches and calculating metrics
 */

import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

const MAX_BATCH_SIZE = 500;

/**
 * Process data in batches to prevent UI freezing
 * @param data Array of items to process
 * @param processFn Function to process each batch
 * @param batchSize Maximum batch size
 */
export async function processDataInBatches<T, R>(
  data: T[],
  processFn: (batch: T[]) => Promise<R[]>,
  batchSize = MAX_BATCH_SIZE
): Promise<R[]> {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  const results: R[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    try {
      // Process each batch and add to results
      const batchResults = await processFn(batch);
      results.push(...batchResults);
      
      // Allow UI to update by yielding control flow
      await new Promise(resolve => setTimeout(resolve, 0));
    } catch (error) {
      console.error(`Error processing batch ${i}-${i + batchSize}:`, error);
    }
  }
  
  return results;
}

/**
 * Calculate a sustainability score based on carbon footprint
 * @param materialData Material data with factor (carbon footprint)
 * @returns Sustainability score (0-100)
 */
export function calculateSustainabilityScore(materialData: { factor?: number }): number {
  if (!materialData || typeof materialData.factor !== 'number') {
    return 50; // Default middle score for unknown materials
  }
  
  const factor = materialData.factor;
  
  // Lower carbon footprint = higher score
  // This is a simple inverse relationship with boundaries
  if (factor <= 0) return 100;
  if (factor >= 10) return 10;
  
  // Scale between 10 and 100 based on factor (0-10)
  return Math.round(100 - factor * 9);
}

/**
 * Determine recyclability category based on material properties
 * @param materialData Material data with category
 * @returns Recyclability level: 'High', 'Medium', or 'Low'
 */
export function determineRecyclability(
  materialData: { category?: string }
): 'High' | 'Medium' | 'Low' {
  if (!materialData || !materialData.category) {
    return 'Medium';
  }
  
  const category = materialData.category.toLowerCase();
  
  // Materials with high recyclability
  if (
    category.includes('wood') ||
    category.includes('timber') ||
    category.includes('metal') ||
    category.includes('steel') ||
    category.includes('aluminum') ||
    category.includes('glass')
  ) {
    return 'High';
  }
  
  // Materials with low recyclability
  if (
    category.includes('composite') ||
    category.includes('insulation') ||
    category.includes('plastic') ||
    category.includes('foam')
  ) {
    return 'Low';
  }
  
  // All other materials default to medium
  return 'Medium';
}

/**
 * Calculate material efficiency score based on multiple factors
 * @param material Material data
 * @returns Efficiency score (0-100)
 */
export function calculateMaterialEfficiency(material: ExtendedMaterialData): number {
  if (!material) return 50;
  
  let score = 50;
  
  // Factor in carbon footprint (30% weight)
  const sustainabilityScore = material.sustainabilityScore || 
                           calculateSustainabilityScore({ factor: material.factor || 0 });
  score += sustainabilityScore * 0.3;
  
  // Factor in recyclability (20% weight)
  const recyclabilityScore = 
    material.recyclability === 'High' ? 100 :
    material.recyclability === 'Medium' ? 50 : 
    material.recyclability === 'Low' ? 20 : 50;
  score += recyclabilityScore * 0.2;
  
  // Local sourcing bonus (10% weight)
  const isLocal = material.region === 'Australia' || material.region === 'Local';
  if (isLocal) score += 10;
  
  // Normalize score to 0-100 range
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Export constants for external use
export const MAX_EFFICIENCY_SCORE = 100;
export { MAX_BATCH_SIZE };
