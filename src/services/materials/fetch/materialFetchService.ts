
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials } from '../cache';
import { handleNetworkError } from '@/utils/errorHandling/networkErrorHandler';
import { generateFallbackMaterials } from '../utils/fallbackMaterials';
import { processAndValidateMaterials } from '../utils/materialProcessing';
import { MaterialView } from '../types/databaseTypes';
import { MaterialFetchStrategies } from './strategies';
import { MaterialCategory } from './types';

/**
 * Service for fetching materials from various sources
 */
class MaterialFetchService extends MaterialFetchStrategies {
  /**
   * Fetches materials from all available sources with fallbacks
   */
  public async fetchMaterials(forceRefresh = true): Promise<ExtendedMaterialData[]> {
    try {
      const materials = await this.fetchWithRetry(
        () => this.fetchWithStrategies(),
        'fetchMaterials'
      );
      
      if (materials.length > 0) {
        await cacheMaterials(materials);
        return materials;
      }
      
      return generateFallbackMaterials();
    } catch (error) {
      console.error('Error in fetchMaterials:', error);
      return generateFallbackMaterials();
    }
  }

  /**
   * Fetches materials by tag
   */
  public async fetchByTag(tag: string): Promise<ExtendedMaterialData[]> {
    try {
      const { data, error } = await supabase
        .from('materials_view')
        .select('*')
        .contains('tags', [tag]);

      if (error) {
        throw handleNetworkError(error, 'fetchByTag');
      }

      return processAndValidateMaterials(data || []);
    } catch (error) {
      console.error(`Error fetching materials with tag ${tag}:`, error);
      return [];
    }
  }

  /**
   * Fetches materials by category
   */
  public async fetchByCategory(category: string): Promise<ExtendedMaterialData[]> {
    try {
      const { data, error } = await supabase
        .from('materials_view')
        .select('*')
        .eq('category', category);

      if (error) {
        throw handleNetworkError(error, 'fetchByCategory');
      }

      return processAndValidateMaterials(data || []);
    } catch (error) {
      console.error(`Error fetching materials in category ${category}:`, error);
      return [];
    }
  }

  /**
   * Fetches material categories
   */
  public async fetchCategories(): Promise<MaterialCategory[]> {
    try {
      const { data, error } = await supabase
        .from('material_categories')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw handleNetworkError(error, 'fetchCategories');
      }

      return (data || []).map(item => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description || undefined
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
}

// Export singleton instance
const materialFetchService = new MaterialFetchService();
export default materialFetchService;

// Export individual functions for backward compatibility
export const {
  fetchMaterials,
  fetchByTag,
  fetchByCategory,
  fetchCategories
} = materialFetchService;

// Re-export types
export type { MaterialCategory, FetchError, FetchResult } from './types';
