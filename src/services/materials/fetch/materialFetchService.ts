
/**
 * Material fetch service with proper Supabase integration
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { SupabaseMaterial } from '../materialTypes';
import { adaptMaterialFromDatabase } from '@/lib/materialCategories';
import { toast } from 'sonner';

// Cache storage for materials
let materialsCache: ExtendedMaterialData[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch materials from Supabase with caching
 * @param forceRefresh Force a refresh ignoring the cache
 * @returns Promise containing the materials data
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  // Use cache if available and not forcing refresh
  const now = Date.now();
  if (!forceRefresh && materialsCache && now - lastFetchTime < CACHE_DURATION) {
    console.log('Using cached materials data');
    return materialsCache;
  }

  try {
    console.log('Fetching materials from Supabase');
    
    // Fetch from materials_view which should have all the fields we need
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('No materials found in database');
      return getFallbackMaterials();
    }
    
    // Map the data from database format to our application format
    const materials = data.map(item => {
      // Ensure factor exists in each material
      const adaptedMaterial = adaptMaterialFromDatabase(item);
      return {
        ...adaptedMaterial,
        // Ensure the factor field is present and has a valid number
        factor: adaptedMaterial.carbonFootprint || 1.0
      } as ExtendedMaterialData;
    });
    
    // Update cache
    materialsCache = materials;
    lastFetchTime = now;
    
    console.log(`Fetched ${materials.length} materials from database`);
    return materials;
  } catch (error) {
    console.error('Error loading materials:', error);
    
    // Show toast for error
    toast.error("Failed to load materials. Using fallback data.");
    
    // Use fallback if available, otherwise return empty array
    return getFallbackMaterials();
  }
}

/**
 * Fetch material categories from the database
 * @returns Promise with array of category strings
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  try {
    // Use the get_material_categories function we defined in the database
    const { data, error } = await supabase.rpc('get_material_categories');
    
    if (error) {
      console.error('Error fetching material categories:', error);
      return getDefaultCategories();
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.warn('No categories found in database');
      return getDefaultCategories();
    }
    
    return data.map(item => item.category);
  } catch (error) {
    console.error('Error loading categories:', error);
    return getDefaultCategories();
  }
}

/**
 * Get fallback materials for when the database is unavailable
 */
function getFallbackMaterials(): ExtendedMaterialData[] {
  // Return some basic materials as fallback
  return [
    {
      id: 'fallback-concrete',
      name: 'Concrete',
      factor: 0.159,
      carbon_footprint_kgco2e_kg: 0.159,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction'],
      sustainabilityScore: 65,
      recyclability: 'Medium',
      category: 'Concrete'
    },
    {
      id: 'fallback-steel',
      name: 'Steel',
      factor: 2.4,
      carbon_footprint_kgco2e_kg: 2.4,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction'],
      sustainabilityScore: 55,
      recyclability: 'High',
      category: 'Steel'
    },
    {
      id: 'fallback-timber',
      name: 'Timber',
      factor: 0.086,
      carbon_footprint_kgco2e_kg: 0.086,
      unit: 'kg',
      region: 'Australia',
      tags: ['construction'],
      sustainabilityScore: 85,
      recyclability: 'High',
      category: 'Wood'
    }
  ];
}

/**
 * Get default categories for when the database is unavailable
 */
function getDefaultCategories(): string[] {
  return [
    'Concrete',
    'Steel',
    'Wood',
    'Glass',
    'Insulation',
    'Brick',
    'Aluminum',
    'Other'
  ];
}
