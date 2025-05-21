
/**
 * Material Data Processor
 * Provides utilities for processing material data
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { createFallbackMaterial } from './materialAdapter';

/**
 * Process material data in batches to avoid overwhelming the browser
 */
export async function processDataInBatches<T, R>(
  items: T[],
  processFn: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  // Process in batches
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    
    // Process each batch in parallel
    const batchResults = await Promise.all(
      batch.map(item => 
        processFn(item).catch(err => {
          console.error('Error processing item:', err);
          return null as unknown as R;
        })
      )
    );
    
    // Add results from this batch
    results.push(...batchResults.filter(Boolean));
    
    // Allow UI to update between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

/**
 * Calculate sustainability score based on carbon footprint and other factors
 */
export function calculateSustainabilityScore(material: Partial<ExtendedMaterialData>): number {
  if (!material) return 50; // Default mid-range score
  
  // If the material already has a sustainability score, use it
  if (material.sustainabilityScore !== undefined) {
    return material.sustainabilityScore;
  }
  
  // Get the carbon footprint (fallback to factor if not available)
  const carbonFootprint = material.carbon_footprint_kgco2e_kg || material.factor || 1.0;
  
  // Basic inverse relationship - lower carbon footprint = higher score
  // Scale from 0 to 10 kg CO2e/kg
  const baseScore = Math.max(0, Math.min(100, 100 - (carbonFootprint * 10)));
  
  // Adjust for recyclability if available
  let recyclabilityBonus = 0;
  if (material.recyclability) {
    recyclabilityBonus = 
      material.recyclability === 'High' ? 10 :
      material.recyclability === 'Medium' ? 5 : 0;
  }
  
  // Final score with bonus (capped at 100)
  return Math.min(100, baseScore + recyclabilityBonus);
}

/**
 * Determine recyclability based on sustainability score or other factors
 */
export function determineRecyclability(material: Partial<ExtendedMaterialData>): 'High' | 'Medium' | 'Low' {
  if (!material) return 'Low';
  
  // If recyclability is already set, use it
  if (material.recyclability) return material.recyclability;
  
  // Calculate based on sustainability score
  const score = material.sustainabilityScore || calculateSustainabilityScore(material);
  
  if (score >= 75) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

/**
 * Process material data to ensure all required fields are present
 */
export function processMaterialData(material: Partial<ExtendedMaterialData>): ExtendedMaterialData {
  if (!material || typeof material !== 'object') {
    return createFallbackMaterial('unknown');
  }
  
  // Ensure all required fields are present
  const processed: ExtendedMaterialData = {
    id: material.id || `material-${Date.now().toString(36)}`,
    name: material.name || 'Unknown Material',
    factor: material.factor || material.carbon_footprint_kgco2e_kg || 1.0,
    carbon_footprint_kgco2e_kg: material.carbon_footprint_kgco2e_kg || material.factor,
    carbon_footprint_kgco2e_tonne: material.carbon_footprint_kgco2e_tonne,
    unit: material.unit || 'kg',
    region: material.region || 'Global',
    tags: Array.isArray(material.tags) ? material.tags : [],
    sustainabilityScore: material.sustainabilityScore || calculateSustainabilityScore(material),
    recyclability: material.recyclability || determineRecyclability(material),
    category: material.category || 'Other',
    alternativeTo: material.alternativeTo,
    notes: material.notes
  };
  
  return processed;
}
