
/**
 * Material data processor for transformations and calculations
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Process data in batches to prevent UI freezing on large datasets
 */
export function processDataInBatches<T, R>(
  data: T[],
  processFn: (item: T) => R | null,
  batchSize = 100
): R[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  const results: R[] = [];
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    
    batch.forEach(item => {
      const processed = processFn(item);
      if (processed !== null) {
        results.push(processed);
      }
    });
  }
  
  return results;
}

/**
 * Calculate sustainability score from carbon footprint
 */
export function calculateSustainabilityScore(carbonFootprint: number): number {
  if (carbonFootprint <= 0) return 100;
  if (carbonFootprint > 10) return 20;
  
  // Inverse relationship between carbon footprint and sustainability
  // This is a simplified calculation for demonstration
  return Math.round(100 - (carbonFootprint / 10) * 80);
}

/**
 * Determine recyclability based on string or material properties
 */
export function determineRecyclability(
  input?: string | number
): 'High' | 'Medium' | 'Low' {
  if (input === undefined || input === null) return 'Low';
  
  if (typeof input === 'string') {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('high') || lowerInput.includes('recycl') || lowerInput.includes('wood') || lowerInput.includes('timber')) {
      return 'High';
    }
    
    if (lowerInput.includes('medium') || lowerInput.includes('aluminum') || lowerInput.includes('metal') || lowerInput.includes('steel')) {
      return 'Medium';
    }
    
    return 'Low';
  }
  
  if (typeof input === 'number') {
    // When given a number, assume it's a sustainability score (0-100)
    if (input >= 70) return 'High';
    if (input >= 40) return 'Medium';
    return 'Low';
  }
  
  return 'Low';
}
