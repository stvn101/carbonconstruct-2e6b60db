
/**
 * Service for fetching materials from the Supabase API
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { performDbOperation } from '../supabase';
import { cacheMaterials, getCachedMaterials } from './materialCacheService';
import { MaterialPagination, SupabaseMaterial, CONNECTION_TIMEOUT, MAX_RETRIES } from './materialTypes';
import { processDataInBatches } from './materialDataProcessor';

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
