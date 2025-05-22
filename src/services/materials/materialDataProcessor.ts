
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Process data in batches to avoid blocking the UI thread
 * @param items Array of items to process
 * @param processFn Function to process each item
 * @param batchSize Number of items to process in each batch
 */
export async function processDataInBatches<T, R>(
  items: T[],
  processFn: (item: T) => R,
  batchSize: number = 50
): Promise<R[]> {
  const results: R[] = [];
  
  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process batch and allow UI thread to update between batches
    const batchResults = await new Promise<R[]>((resolve) => {
      setTimeout(() => {
        const processed = batch.map(processFn);
        resolve(processed);
      }, 0);
    });
    
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Calculate sustainability score based on CO2 footprint
 * @param co2eValue CO2 equivalent value
 * @param maxCO2e Maximum CO2 equivalent value in the dataset
 * @param minCO2e Minimum CO2 equivalent value in the dataset
 */
export function calculateSustainabilityScore(
  co2eValue: number,
  maxCO2e: number = 5000,
  minCO2e: number = 50
): number {
  // Invert the scale: lower CO2e = higher score
  const normalizedValue = Math.max(0, Math.min(1, (maxCO2e - co2eValue) / (maxCO2e - minCO2e)));
  return Math.round(normalizedValue * 100);
}

/**
 * Determine recyclability based on sustainability score
 * @param score Sustainability score
 */
export function determineRecyclability(score?: number): 'High' | 'Medium' | 'Low' {
  if (!score) return 'Medium';
  if (score >= 75) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

/**
 * Enhance material data with additional calculated fields
 * @param material Basic material data
 */
export function enhanceMaterialData(material: any): ExtendedMaterialData {
  const co2eValue = material.carbon_footprint_kgco2e_kg || material.factor || 0;
  const sustainabilityScore = material.sustainabilityScore || 
    calculateSustainabilityScore(co2eValue * 1000);
  
  return {
    ...material,
    sustainabilityScore,
    recyclability: material.recyclability || determineRecyclability(sustainabilityScore),
    tags: material.tags || ['construction'],
    notes: material.notes || '',
    unit: material.unit || 'kg'
  };
}
