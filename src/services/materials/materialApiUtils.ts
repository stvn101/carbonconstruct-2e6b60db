
/**
 * Material API Utils
 * Utility functions for handling API calls related to materials
 */
import { SupabaseMaterial } from './materialTypes';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { supabase } from '@/integrations/supabase/client';
import { adaptSupabaseMaterialToExtended } from '@/hooks/materialCache/utils/typeAdapters';
import { CONNECTION_TIMEOUT } from './types';

/**
 * Fetch materials with timeout protection
 */
export async function fetchMaterialsWithTimeout(): Promise<ExtendedMaterialData[]> {
  try {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT);
    });

    const fetchPromise = fetchMaterialsFromView();
    
    // Race between fetch and timeout
    const materials = await Promise.race([fetchPromise, timeoutPromise]) as ExtendedMaterialData[];
    return materials;
  } catch (error) {
    console.error('Error fetching materials with timeout:', error);
    throw error;
  }
}

/**
 * Fetch materials from the materials_view
 */
export async function fetchMaterialsFromView(): Promise<ExtendedMaterialData[]> {
  try {
    const { data, error } = await supabase
      .from('materials_view')
      .select('*');

    if (error) {
      console.error('Error fetching from materials_view:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No materials found in materials_view');
      return [];
    }

    // Convert the data to the expected format
    const materials = data.map(item => {
      // Adapt each item to our ExtendedMaterialData format
      return adaptSupabaseMaterialToExtended({
        id: item.id,
        material: item.name || '',
        co2e_avg: item.carbon_footprint_kgco2e_kg || 0,
        sustainability_score: item.sustainabilityscore || 0,
        sustainability_notes: item.notes || '',
        // Add additional fields as needed
        name: item.name || '',
        factor: item.factor || 0,
        unit: item.unit || '',
        region: item.region || '',
        tags: item.tags || [],
        recyclability: item.recyclability || '',
        category: item.category || ''
      });
    });

    return materials;
  } catch (error) {
    console.error('Error in fetchMaterialsFromView:', error);
    throw error;
  }
}
