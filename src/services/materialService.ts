
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

// Connection timeout values
const CONNECTION_TIMEOUT = 15000; // 15 seconds
const MAX_RETRIES = 2;

/**
 * Fetch all materials from Supabase with optimized performance
 */
export async function fetchMaterials(): Promise<ExtendedMaterialData[]> {
  return performDbOperation(
    async () => {
      console.time('Fetch materials');
      
      // Attempt to fetch with timeout
      const fetchWithTimeout = async (retryCount = 0): Promise<ExtendedMaterialData[]> => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);
          
          const { data, error } = await supabase
            .from('materials')
            .select('*');
          
          clearTimeout(timeoutId);
          
          if (error) throw error;
          if (!data) return [];
          
          // Process data in batches to avoid UI freezing
          return processDataInBatches(data);
          
        } catch (err) {
          if (err.name === 'AbortError') {
            console.warn(`Connection timeout. Retry ${retryCount + 1}/${MAX_RETRIES}`);
            if (retryCount < MAX_RETRIES) {
              return fetchWithTimeout(retryCount + 1);
            }
            console.error('Max retries reached. Using fallback data.');
            return []; // Return empty array, the caller will use fallback data
          }
          throw err;
        }
      };
      
      const result = await fetchWithTimeout();
      console.timeEnd('Fetch materials');
      return result;
    },
    'fetch materials',
    { fallbackData: [] }
  );
}

/**
 * Process data in batches to avoid UI freezing
 */
function processDataInBatches(data: SupabaseMaterial[]): ExtendedMaterialData[] {
  const BATCH_SIZE = 50;
  const result: ExtendedMaterialData[] = [];
  
  console.time('Process materials');
  
  for (let i = 0; i < data.length; i += BATCH_SIZE) {
    const batch = data.slice(i, i + BATCH_SIZE);
    
    // Transform the batch from Supabase format to our ExtendedMaterialData format
    const transformedBatch = batch.map((material: SupabaseMaterial) => ({
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
    
    result.push(...transformedBatch);
  }
  
  console.timeEnd('Process materials');
  return result;
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
