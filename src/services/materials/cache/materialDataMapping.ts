
/**
 * Functions to map between database and application material data formats
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { SupabaseMaterial } from '../materialTypes';
import { MAX_BATCH_SIZE } from './cacheConstants';
import { calculateSustainabilityScore, determineRecyclability } from '../materialDataProcessor';

interface MaterialSourceData {
  name?: string;
  carbon_footprint_kgco2e_kg?: number;
  factor?: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityscore?: number;
  recyclability?: string;
  alternativeto?: string;
  notes?: string;
  category?: string;
}

/**
 * Maps database materials to application format
 * @param data Raw materials from database
 * @returns Mapped materials in application format
 */
export function mapDatabaseMaterials(data: MaterialSourceData[]): ExtendedMaterialData[] {
  console.time('Map materials');
  
  try {
    if (!data || !Array.isArray(data)) {
      console.error('Invalid data provided to mapDatabaseMaterials:', data);
      return [];
    }
    
    const result: ExtendedMaterialData[] = [];
    
    // Process in batches to prevent UI freezing
    for (let i = 0; i < data.length; i += MAX_BATCH_SIZE) {
      const batch = data.slice(i, i + MAX_BATCH_SIZE);
      
      const mappedBatch = batch.map((item) => {
        if (!item) return null;
        
        try {
          // Create a material with defaults for missing fields
          return {
            name: item.name || 'Unnamed Material',
            factor: (item.carbon_footprint_kgco2e_kg || item.factor) || 0,
            unit: item.unit || 'kg',
            region: item.region || 'Australia',
            tags: Array.isArray(item.tags) ? item.tags : 
                  item.category ? [item.category] : ['construction'],
            sustainabilityScore: item.sustainabilityscore || 
                               calculateSustainabilityScore(item.carbon_footprint_kgco2e_kg || item.factor || 0),
            recyclability: item.recyclability || 
                         determineRecyclability(item.category || '') as 'High' | 'Medium' | 'Low',
            alternativeTo: item.alternativeto || undefined,
            notes: item.notes || '',
            category: item.category || 'Other'
          };
        } catch (itemError) {
          console.warn('Error mapping material item:', itemError, item);
          return null;
        }
      }).filter((item): item is ExtendedMaterialData => item !== null);
      
      result.push(...mappedBatch);
    }
    
    console.timeEnd('Map materials');
    return result;
  } catch (error) {
    console.error('Error in mapDatabaseMaterials:', error);
    return [];
  }
}
