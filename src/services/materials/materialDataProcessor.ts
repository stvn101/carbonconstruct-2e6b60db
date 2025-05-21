
/**
 * Material Data Processor
 * Processes and transforms material data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

const BATCH_SIZE = 100; // Process materials in batches of 100

/**
 * Process data in batches to avoid blocking the main thread
 */
export async function processDataInBatches<T, R>(
  items: T[],
  processFn: (item: T) => R,
  batchSize = BATCH_SIZE
): Promise<R[]> {
  const result: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process current batch
    const processedBatch = batch.map(processFn);
    result.push(...processedBatch);
    
    // Allow other operations to run between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return result;
}

/**
 * Calculate sustainability score based on material properties
 */
export function calculateSustainabilityScore(material: ExtendedMaterialData): number {
  // Base score starting point
  let baseScore = 60;
  
  // Adjust based on carbon footprint (lower is better)
  const carbonFootprint = material.carbon_footprint_kgco2e_kg || material.factor || 0;
  if (carbonFootprint < 0.1) baseScore += 15;
  else if (carbonFootprint < 0.5) baseScore += 10;
  else if (carbonFootprint < 1) baseScore += 5;
  else if (carbonFootprint > 2) baseScore -= 5;
  else if (carbonFootprint > 5) baseScore -= 10;
  
  // Adjust based on recyclability
  if (material.recyclability === 'High') baseScore += 15;
  else if (material.recyclability === 'Medium') baseScore += 5;
  else if (material.recyclability === 'Low') baseScore -= 5;
  
  // Adjust based on categories
  if (material.category) {
    const categoryLower = material.category.toLowerCase();
    
    if (categoryLower.includes('timber') || categoryLower.includes('wood')) {
      baseScore += 10; // Renewable material
    }
    
    if (categoryLower.includes('recycled')) {
      baseScore += 15; // Recycled material
    }
  }
  
  // Adjust based on name keywords
  if (material.name) {
    const nameLower = material.name.toLowerCase();
    
    if (
      nameLower.includes('recycled') || 
      nameLower.includes('reclaimed') ||
      nameLower.includes('reused')
    ) {
      baseScore += 10;
    }
    
    if (nameLower.includes('low carbon') || nameLower.includes('low-carbon')) {
      baseScore += 10;
    }
    
    if (nameLower.includes('sustainable') || nameLower.includes('eco')) {
      baseScore += 5;
    }
  }
  
  // Adjust based on tags
  if (material.tags) {
    if (material.tags.includes('sustainable')) baseScore += 5;
    if (material.tags.includes('recycled')) baseScore += 10;
    if (material.tags.includes('local')) baseScore += 5;
  }
  
  // Ensure score is between 0-100
  return Math.min(100, Math.max(0, baseScore));
}

/**
 * Determine recyclability based on material properties
 */
export function determineRecyclability(material: ExtendedMaterialData): 'High' | 'Medium' | 'Low' {
  if (material.recyclability) {
    return material.recyclability;
  }
  
  // Default to medium
  let recyclability: 'High' | 'Medium' | 'Low' = 'Medium';
  
  // Check material name and category
  const nameLower = (material.name || '').toLowerCase();
  const categoryLower = (material.category || '').toLowerCase();
  
  // Materials with typically high recyclability
  if (
    nameLower.includes('steel') ||
    nameLower.includes('metal') ||
    nameLower.includes('aluminum') ||
    nameLower.includes('aluminium') ||
    nameLower.includes('glass') ||
    categoryLower.includes('steel') ||
    categoryLower.includes('metal') ||
    categoryLower.includes('aluminum') ||
    categoryLower.includes('aluminium') ||
    categoryLower.includes('glass')
  ) {
    recyclability = 'High';
  }
  
  // Materials with typically medium recyclability
  else if (
    nameLower.includes('concrete') ||
    nameLower.includes('timber') ||
    nameLower.includes('wood') ||
    nameLower.includes('brick') ||
    categoryLower.includes('concrete') ||
    categoryLower.includes('timber') ||
    categoryLower.includes('wood') ||
    categoryLower.includes('brick')
  ) {
    recyclability = 'Medium';
  }
  
  // Materials with typically low recyclability
  else if (
    nameLower.includes('insulation') ||
    nameLower.includes('plastic') ||
    nameLower.includes('composite') ||
    nameLower.includes('foam') ||
    categoryLower.includes('insulation') ||
    categoryLower.includes('plastic') ||
    categoryLower.includes('composite') ||
    categoryLower.includes('foam')
  ) {
    recyclability = 'Low';
  }
  
  // Check for keywords that indicate higher recyclability
  if (
    nameLower.includes('recycled') ||
    nameLower.includes('recyclable') ||
    (material.tags && (
      material.tags.includes('recycled') ||
      material.tags.includes('recyclable')
    ))
  ) {
    // Upgrade by one level if possible
    if (recyclability === 'Medium') recyclability = 'High';
    else if (recyclability === 'Low') recyclability = 'Medium';
  }
  
  return recyclability;
}

/**
 * Enriches material data with additional information
 */
export function enrichMaterialData(material: ExtendedMaterialData): ExtendedMaterialData {
  // Create a copy to avoid modifying the original
  const enriched = { ...material };
  
  // Calculate sustainability score if not present
  if (!enriched.sustainabilityScore) {
    enriched.sustainabilityScore = calculateSustainabilityScore(material);
  }
  
  // Determine recyclability if not present
  if (!enriched.recyclability) {
    enriched.recyclability = determineRecyclability(material);
  }
  
  // Ensure carbon footprint is set
  if (!enriched.carbon_footprint_kgco2e_kg && enriched.factor) {
    enriched.carbon_footprint_kgco2e_kg = enriched.factor;
  }
  
  // Ensure unit is set
  if (!enriched.unit) {
    enriched.unit = 'kg';
  }
  
  // Ensure region is set
  if (!enriched.region) {
    enriched.region = 'Global';
  }
  
  // Ensure tags array exists
  if (!enriched.tags) {
    enriched.tags = [];
  }
  
  // Add category as tag if not already present
  if (enriched.category && !enriched.tags.includes(enriched.category)) {
    enriched.tags.push(enriched.category);
  }
  
  return enriched;
}
