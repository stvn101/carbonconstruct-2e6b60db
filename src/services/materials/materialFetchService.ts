
/**
 * Simplified service for fetching materials from the Supabase API
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { cacheMaterials, getCachedMaterials } from './materialCacheService';
import { processDataInBatches } from './materialDataProcessor';
import { SupabaseMaterial } from './materialTypes';
import { isOffline } from '@/utils/errorHandling';

/**
 * Fetch all materials from Supabase with simplified caching
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  console.log('fetchMaterials called with forceRefresh:', forceRefresh);
  try {
    // First try to get materials from cache unless forceRefresh is true
    if (!forceRefresh) {
      const cachedMaterials = await getCachedMaterials();
      if (cachedMaterials && cachedMaterials.length > 0) {
        console.log('Using cached materials:', cachedMaterials.length);
        return cachedMaterials;
      }
    }
    
    // If offline, use fallback without trying network request
    if (isOffline()) {
      console.log('Offline mode detected, using fallback materials');
      return getFallbackMaterials();
    }
    
    console.log('Fetching materials from API');
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No materials returned from API');
      // Use fallback data if API returns nothing
      return getFallbackMaterials();
    }
    
    // Process the data
    console.log('Processing data from API:', data.length, 'rows');
    const processedData = processDataInBatches(data);
    
    // Cache the materials for future use
    cacheMaterials(processedData)
      .then(() => console.log('Materials cached successfully'))
      .catch(err => console.warn('Failed to cache materials:', err));
    
    return processedData;
  } catch (err) {
    console.error('Error loading materials:', err);
    // Use fallback data on error
    return getFallbackMaterials();
  }
}

/**
 * Fetch material categories from Supabase
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  // First check if we're offline
  if (isOffline()) {
    console.log('Offline, returning default categories');
    // Return some sensible default categories
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass'];
  }
  
  try {
    console.log('Fetching categories from API');
    const { data, error } = await supabase
      .from('materials')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extract unique categories
    if (data && data.length > 0) {
      const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort();
      console.log('Categories fetched:', categories);
      return categories;
    }
    
    console.log('No categories found, returning defaults');
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass'];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass'];
  }
}

/**
 * Get fallback materials from static data
 */
function getFallbackMaterials(): ExtendedMaterialData[] {
  console.log('Using fallback materials from MATERIAL_FACTORS');
  return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
    name: value.name || key,
    factor: value.factor,
    unit: value.unit || 'kg',
    region: 'Australia',
    tags: ['construction'],
    sustainabilityScore: 70,
    recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
    alternativeTo: undefined,
    notes: ''
  }));
}
