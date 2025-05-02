
/**
 * Simplified service for fetching materials from the Supabase API
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/materials';
import { cacheMaterials, getCachedMaterials } from './materialCacheService';
import { processDataInBatches } from './materialDataProcessor';
import { SupabaseMaterial } from './materialTypes';

/**
 * Fetch all materials from Supabase with simplified caching
 */
export async function fetchMaterials(): Promise<ExtendedMaterialData[]> {
  try {
    // First try to get materials from cache
    const cachedMaterials = await getCachedMaterials();
    if (cachedMaterials && cachedMaterials.length > 0) {
      console.log('Using cached materials:', cachedMaterials.length);
      return cachedMaterials;
    }
    
    console.log('Fetching materials from API');
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      // Use fallback data if API returns nothing
      return getFallbackMaterials();
    }
    
    // Process the data
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
  try {
    const { data, error } = await supabase
      .from('materials')
      .select('category')
      .not('category', 'is', null);
    
    if (error) throw error;
    
    // Extract unique categories
    if (data && data.length > 0) {
      return [...new Set(data.map(item => item.category).filter(Boolean))].sort();
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Get fallback materials from static data
 */
function getFallbackMaterials(): ExtendedMaterialData[] {
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
