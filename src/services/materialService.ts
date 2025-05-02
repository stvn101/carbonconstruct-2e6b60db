
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { performDbOperation } from './supabase';
import { cacheMaterials, getCachedMaterials } from './materialCache';

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
const DEFAULT_PAGE_SIZE = 100;

// Material pagination interface
export interface MaterialPagination {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

/**
 * Fetch materials with pagination support
 */
export async function fetchMaterialsWithPagination(
  pagination: MaterialPagination
): Promise<{ data: ExtendedMaterialData[], count: number }> {
  return performDbOperation(
    async () => {
      const { page, pageSize, search, category, sortBy, sortDirection } = pagination;
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;
      
      console.log(`Fetching materials page ${page} (${start}-${end})`);
      
      let query = supabase
        .from('materials')
        .select('*', { count: 'exact' });
      
      // Apply filters if provided
      if (search) {
        query = query.ilike('name', `%${search}%`);
      }
      
      if (category) {
        query = query.eq('category', category);
      }
      
      // Apply sorting
      if (sortBy) {
        query = query.order(sortBy, { ascending: sortDirection === 'asc' });
      } else {
        query = query.order('name', { ascending: true });
      }
      
      // Apply pagination
      query = query.range(start, end);
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      // Process and return the data
      const processedData = data ? processDataInBatches(data) : [];
      return { data: processedData, count: count || 0 };
    },
    'fetch materials with pagination',
    { fallbackData: { data: [], count: 0 } }
  );
}

/**
 * Fetch all materials from Supabase with optimized performance and caching
 */
export async function fetchMaterials(): Promise<ExtendedMaterialData[]> {
  return performDbOperation(
    async () => {
      console.time('Fetch materials');
      
      // First try to get materials from cache
      try {
        const cachedMaterials = await getCachedMaterials();
        if (cachedMaterials && cachedMaterials.length > 0) {
          console.log('Using cached materials:', cachedMaterials.length);
          console.timeEnd('Fetch materials');
          return cachedMaterials;
        }
      } catch (cacheError) {
        console.warn('Cache retrieval failed, falling back to API:', cacheError);
      }
      
      // Attempt to fetch with timeout
      const fetchWithTimeout = async (retryCount = 0): Promise<ExtendedMaterialData[]> => {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT);
          
          console.log('Fetching all materials from API');
          const { data, error, count } = await supabase
            .from('materials')
            .select('*', { count: 'exact' });
          
          clearTimeout(timeoutId);
          
          if (error) throw error;
          if (!data) return [];
          
          console.log(`Fetched ${count} materials from API`);
          
          // Process data in batches to avoid UI freezing
          const processedData = processDataInBatches(data);
          
          // Cache the materials for future use
          try {
            await cacheMaterials(processedData);
            console.log('Materials cached successfully');
          } catch (cacheError) {
            console.warn('Failed to cache materials:', cacheError);
          }
          
          return processedData;
          
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
 * Fetch material categories from Supabase
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  return performDbOperation(
    async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      // Extract unique categories
      if (data) {
        const categories = data
          .map(item => item.category)
          .filter(Boolean)
          .filter((value, index, self) => self.indexOf(value) === index)
          .sort();
          
        return categories;
      }
      
      return [];
    },
    'fetch material categories',
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
