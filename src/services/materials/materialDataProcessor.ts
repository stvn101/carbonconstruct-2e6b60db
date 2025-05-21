
/**
 * Material Data Processor
 * Processes material data in batches to prevent UI blocking
 */

/**
 * Process a large array of materials in smaller batches
 * This prevents the UI from freezing when processing large datasets
 * 
 * @param items Array of items to process
 * @param processFn Processing function for each batch
 * @param batchSize Size of each batch
 * @returns Processed results
 */
export async function processDataInBatches<T, R>(
  items: T[], 
  processFn: (batch: T[]) => Promise<R[]>,
  batchSize = 50
): Promise<R[]> {
  // If the array is empty, return an empty array
  if (!items || items.length === 0) {
    return [];
  }
  
  // Process small arrays directly
  if (items.length <= batchSize) {
    return processFn(items);
  }
  
  // For larger arrays, process in batches
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process this batch
    const batchResults = await processFn(batch);
    
    // Add results to the accumulator
    results.push(...batchResults);
    
    // Allow the UI to update by yielding to the event loop
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

/**
 * Calculate sustainability score for a material
 * @param material Material data
 * @returns Sustainability score (0-100)
 */
export function calculateSustainabilityScore(material: any): number {
  // Default score
  let score = 50;
  
  // Adjust based on carbon footprint (lower is better)
  if (typeof material.carbon_footprint_kgco2e_kg === 'number') {
    // Scale: 0.1 kg CO2e/kg = excellent (90), 10 kg CO2e/kg = poor (10)
    const carbonScore = 100 - Math.min(10, material.carbon_footprint_kgco2e_kg) * 9;
    score = Math.round(0.7 * score + 0.3 * carbonScore);
  }
  
  // Adjust based on tags
  if (material.tags && Array.isArray(material.tags)) {
    const positiveTags = ['sustainable', 'recycled', 'renewable', 'natural'];
    const negativeTags = ['non-recyclable', 'hazardous', 'high-impact'];
    
    // Boost for positive tags
    for (const tag of material.tags) {
      if (positiveTags.includes(tag.toLowerCase())) {
        score += 5;
      }
      if (negativeTags.includes(tag.toLowerCase())) {
        score -= 10;
      }
    }
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score));
}

/**
 * Determine recyclability rating for a material
 * @param material Material data
 * @returns Recyclability rating: 'High', 'Medium', or 'Low'
 */
export function determineRecyclability(material: any): 'High' | 'Medium' | 'Low' {
  // If explicitly set, use that value
  if (material.recyclability) {
    return material.recyclability as 'High' | 'Medium' | 'Low';
  }
  
  // Check for specific tags
  if (material.tags && Array.isArray(material.tags)) {
    if (material.tags.some(tag => 
      ['highly-recyclable', 'fully-recyclable', 'biodegradable'].includes(tag.toLowerCase()))) {
      return 'High';
    }
    
    if (material.tags.some(tag => 
      ['non-recyclable', 'hazardous'].includes(tag.toLowerCase()))) {
      return 'Low';
    }
  }
  
  // Base on sustainability score if calculated
  if (typeof material.sustainabilityScore === 'number') {
    if (material.sustainabilityScore >= 70) return 'High';
    if (material.sustainabilityScore >= 40) return 'Medium';
    return 'Low';
  }
  
  // Default to medium
  return 'Medium';
}
