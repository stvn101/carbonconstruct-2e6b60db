
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Process material data in batches to avoid UI blocking
 * @param data Raw material data from API
 * @returns Processed material data
 */
export function processDataInBatches(data: any[]): ExtendedMaterialData[] {
  const BATCH_SIZE = 100;
  const result: ExtendedMaterialData[] = [];

  // Process data in batches
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    
    batch.forEach(item => {
      // Clean and normalize data
      const material: ExtendedMaterialData = {
        id: item.id || `material-${Math.random().toString(36).substring(2, 9)}`,
        name: item.name || 'Unknown Material',
        category: item.category || 'Uncategorized',
        factor: typeof item.factor === 'number' ? item.factor : 
               typeof item.carbon_footprint_kgco2e_kg === 'number' ? item.carbon_footprint_kgco2e_kg : 0,
        unit: item.unit || 'kg',
        carbon_footprint_kgco2e_kg: typeof item.carbon_footprint_kgco2e_kg === 'number' ? 
                                   item.carbon_footprint_kgco2e_kg : 
                                   typeof item.factor === 'number' ? item.factor : 0,
        region: item.region || 'Global'
      };
      
      // Add optional properties if they exist
      if (item.sustainabilityscore !== undefined) material.sustainabilityscore = item.sustainabilityscore;
      if (item.recyclability !== undefined) material.recyclability = item.recyclability;
      if (item.notes !== undefined) material.notes = item.notes;
      if (item.alternativeto !== undefined) material.alternativeto = item.alternativeto;
      
      // Add tags if they exist
      if (Array.isArray(item.tags)) {
        material.tags = item.tags;
      }
      
      result.push(material);
    });
  }

  return result;
}
