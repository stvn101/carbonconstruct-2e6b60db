
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { toast } from 'sonner';
import { EXTENDED_MATERIALS } from '@/lib/materials';

const CACHE_TIME = 3600000; // Cache for 1 hour

/**
 * Fetch materials from Supabase with proper error handling and fallback
 * @param forceRefresh Force refresh the data from the server
 * @returns Promise with array of materials
 */
export async function fetchMaterials(forceRefresh = false): Promise<ExtendedMaterialData[]> {
  // First check local storage cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cachedData = localStorage.getItem('materialsCache');
      const cacheTimestamp = localStorage.getItem('materialsCacheTime');
      
      if (cachedData && cacheTimestamp) {
        const parsedData = JSON.parse(cachedData);
        const cacheTime = parseInt(cacheTimestamp, 10);
        
        // Use cache if it's not too old
        if (Date.now() - cacheTime < CACHE_TIME && parsedData.length > 0) {
          console.log(`Using cached materials (${parsedData.length} items)`);
          return parsedData;
        }
      }
    } catch (err) {
      console.warn("Error reading from materials cache:", err);
    }
  }

  console.log("Fetching materials from Supabase...");
  
  try {
    // First try to use the RPC function which bypasses RLS
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_materials');
    
    if (!rpcError && rpcData && rpcData.length > 0) {
      console.log(`Successfully fetched ${rpcData.length} materials using RPC`);
      
      // Transform the data to match our expected format
      const transformedData = rpcData.map(item => ({
        id: item.id.toString(),
        name: item.material,
        factor: item.co2e_avg / 1000, // Convert to CO2e per kg
        unit: 'kg',
        region: 'Australia',
        tags: item.applicable_standards ? [item.applicable_standards] : ['construction'],
        sustainabilityScore: item.sustainability_score,
        recyclability: determineRecyclability(item.sustainability_score),
        alternativeTo: undefined,
        notes: item.sustainability_notes || ''
      }));
      
      // Cache the data
      try {
        localStorage.setItem('materialsCache', JSON.stringify(transformedData));
        localStorage.setItem('materialsCacheTime', Date.now().toString());
      } catch (err) {
        console.warn("Error writing to materials cache:", err);
      }
      
      return transformedData;
    }
    
    // If RPC fails, try direct table access
    console.log("RPC fetch failed, trying direct table access");
    const { data, error } = await supabase
      .from('materials')
      .select('*');
    
    if (error) {
      console.error("Error fetching materials:", error);
      
      // Try materials_view if the main table isn't accessible
      console.log("Trying materials_view as fallback");
      const { data: viewData, error: viewError } = await supabase
        .from('materials_view')
        .select('*');
        
      if (viewError || !viewData || viewData.length === 0) {
        console.error("Error fetching from materials_view:", viewError);
        throw new Error("Failed to fetch materials from database");
      }
      
      console.log(`Successfully fetched ${viewData.length} materials from materials_view`);
      
      // Cache the data
      try {
        localStorage.setItem('materialsCache', JSON.stringify(viewData));
        localStorage.setItem('materialsCacheTime', Date.now().toString());
      } catch (err) {
        console.warn("Error writing to materials cache:", err);
      }
      
      return viewData;
    }
    
    if (!data || data.length === 0) {
      console.warn("No materials found in database");
      throw new Error("No materials found in database");
    }
    
    console.log(`Successfully fetched ${data.length} materials directly from table`);
    
    // Transform the data to match our expected format
    const transformedData = data.map(item => ({
      id: item.id.toString(),
      name: item.material,
      factor: item.co2e_avg / 1000, // Convert to CO2e per kg
      unit: 'kg',
      region: 'Australia',
      tags: item.applicable_standards ? [item.applicable_standards] : ['construction'],
      sustainabilityScore: item.sustainability_score,
      recyclability: determineRecyclability(item.sustainability_score),
      alternativeTo: undefined,
      notes: item.sustainability_notes || ''
    }));
    
    // Cache the data
    try {
      localStorage.setItem('materialsCache', JSON.stringify(transformedData));
      localStorage.setItem('materialsCacheTime', Date.now().toString());
    } catch (err) {
      console.warn("Error writing to materials cache:", err);
    }
    
    return transformedData;
  } catch (error) {
    console.error("Failed to fetch materials:", error);
    
    // Use fallback data as last resort
    console.log("Using fallback materials data");
    const fallbackMaterials = Object.values(EXTENDED_MATERIALS);
    
    if (!forceRefresh) {
      // Show toast only on automatic fetch, not when user manually refreshes
      toast.error("Unable to load materials from the database", {
        description: "Using local fallback data instead",
        duration: 4000,
      });
    }
    
    return fallbackMaterials;
  }
}

/**
 * Helper function to determine recyclability based on sustainability score
 */
function determineRecyclability(score?: number): 'High' | 'Medium' | 'Low' {
  if (!score) return 'Medium';
  if (score >= 75) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}

/**
 * Fetch material categories from the database
 */
export async function fetchMaterialCategories(): Promise<string[]> {
  try {
    // Try using RPC function first
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_material_categories');
    
    if (!rpcError && rpcData && rpcData.length > 0) {
      return rpcData.map((item: any) => item.category);
    }
    
    // Fall back to direct query
    const { data, error } = await supabase
      .from('material_categories')
      .select('name');
    
    if (error) {
      console.error("Error fetching material categories:", error);
      throw error;
    }
    
    return data.map(item => item.name);
  } catch (error) {
    console.error("Failed to fetch material categories:", error);
    
    // Return some default categories as fallback
    return [
      'Concrete', 
      'Steel', 
      'Timber', 
      'Insulation', 
      'Glass', 
      'Plasterboard',
      'Masonry'
    ];
  }
}
