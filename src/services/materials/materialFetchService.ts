
/**
 * Simplified service for fetching materials from the Supabase API
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS, EXTENDED_MATERIALS } from '@/lib/materials';
import { cacheMaterials, getCachedMaterials } from './materialCacheService';
import { processDataInBatches } from './materialDataProcessor';
import { SupabaseMaterial } from './materialTypes';
import { isOffline } from '@/utils/errorHandling';
import { toast } from 'sonner';

/**
 * Fetch all materials from Supabase with improved caching and fallbacks
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
      toast.info("You're offline. Using fallback material data.", {
        id: "offline-materials",
        duration: 3000
      });
      return getFallbackMaterials();
    }
    
    console.log('Fetching materials from API');
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Supabase error:', error);
      toast.error("Failed to load materials from database. Using fallback data.", {
        id: "materials-error",
        duration: 3000
      });
      return getFallbackMaterials();
    }
    
    if (!data || data.length === 0) {
      console.log('No materials returned from API');
      toast.warning("No materials found in database. Using default materials.", {
        id: "no-materials",
        duration: 3000
      });
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
    toast.error("Error loading materials. Using fallback data.", {
      id: "materials-error",
      duration: 3000
    });
    // Use fallback data on error
    return getFallbackMaterials();
  }
}

/**
 * Fetch material categories from Supabase with improved fallbacks
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  // First check if we're offline
  if (isOffline()) {
    console.log('Offline, returning default categories');
    // Return some sensible default categories
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass', 'Masonry', 'Metals', 'Plastics'];
  }
  
  try {
    console.log('Fetching categories from API');
    const { data, error } = await supabase
      .from('materials')
      .select('category')
      .not('category', 'is', null);
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    // Extract unique categories
    if (data && data.length > 0) {
      const categories = [...new Set(data.map(item => item.category).filter(Boolean))].sort();
      console.log('Categories fetched:', categories);
      return categories;
    }
    
    console.log('No categories found, returning defaults');
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass', 'Masonry', 'Metals', 'Plastics'];
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return some sensible default categories on error
    return ['Concrete', 'Wood', 'Steel', 'Insulation', 'Glass', 'Masonry', 'Metals', 'Plastics'];
  }
}

/**
 * Get comprehensive fallback materials from both static data sources
 */
function getFallbackMaterials(): ExtendedMaterialData[] {
  console.log('Using fallback materials');
  
  // First try to use the extended materials data which has more detailed information
  if (Object.keys(EXTENDED_MATERIALS).length > 0) {
    console.log('Using EXTENDED_MATERIALS for fallback', Object.keys(EXTENDED_MATERIALS).length, 'items');
    return Object.values(EXTENDED_MATERIALS);
  }
  
  // Fallback to basic material factors if extended isn't available
  console.log('Using MATERIAL_FACTORS for fallback');
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

/**
 * Try to load static test materials for offline/demo scenarios
 */
export function getTestMaterials(): ExtendedMaterialData[] {
  const testMaterials: ExtendedMaterialData[] = [
    {
      name: 'Concrete (General)',
      factor: 0.12,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'structural'],
      sustainabilityScore: 65,
      recyclability: 'Medium',
      notes: 'Standard concrete mix. NCC 2025 compliant.'
    },
    {
      name: 'Steel (Structural)',
      factor: 1.46,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'structural'],
      sustainabilityScore: 72,
      recyclability: 'High',
      notes: 'Structural steel beams and columns.'
    },
    {
      name: 'Timber (Pine)',
      factor: 0.20,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'natural'],
      sustainabilityScore: 85,
      recyclability: 'Medium',
      notes: 'Sustainably sourced pine timber.'
    },
    {
      name: 'Glass (Window)',
      factor: 0.86,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'finishes'],
      sustainabilityScore: 68,
      recyclability: 'High',
      notes: 'Standard window glass.'
    },
    {
      name: 'Brick (Clay)',
      factor: 0.24,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction', 'masonry'],
      sustainabilityScore: 70,
      recyclability: 'Medium',
      notes: 'Standard clay brick.'
    }
  ];
  
  return testMaterials;
}
