
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials } from '../cache';
import { generateFallbackMaterials } from '../utils/fallbackMaterials';
import { MaterialFetchStrategies } from './strategies';
import { MaterialCategory } from './types';

/**
 * Main service class for fetching materials from various sources
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
      const result = await this.querySupabase(
        'materials_view',
        '*',
        'fetchByTag'
      );

      if (result.error) throw result.error;

      // Filter by tag in memory since Supabase query might not work with arrays
      return result.data.filter(item => 
        item.tags && Array.isArray(item.tags) && item.tags.includes(tag)
      );
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
      const result = await this.querySupabase(
        'materials_view',
        '*',
        'fetchByCategory'
      );

      if (result.error) throw result.error;

      // Filter by category in memory
      return result.data.filter(item => 
        item.category && item.category.toLowerCase() === category.toLowerCase()
      );
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
      const result = await this.querySupabase(
        'material_categories',
        '*',
        'fetchCategories'
      );

      if (result.error) throw result.error;

      return result.data.map(item => ({
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
