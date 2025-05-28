
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { cacheMaterials } from '../cache';
import { generateFallbackMaterials } from '../utils/fallbackMaterials';
import { MaterialFetchStrategies } from './strategies';
import { MaterialCategory } from './types';
import { MaterialView } from '../types/databaseTypes';
import { processAndValidateMaterials } from '../utils/materialProcessing';

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
      const result = await this.querySupabaseView<MaterialView>(
        'materials_view',
        '*',
        'fetchByTag'
      );

      if (result.error) throw result.error;

      // Filter by tag and transform to ExtendedMaterialData
      const filteredData = result.data.filter(item => 
        item.tags && Array.isArray(item.tags) && item.tags.includes(tag)
      );

      return processAndValidateMaterials(filteredData);
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
      const result = await this.querySupabaseView<MaterialView>(
        'materials_view',
        '*',
        'fetchByCategory'
      );

      if (result.error) throw result.error;

      // Filter by category and transform to ExtendedMaterialData
      const filteredData = result.data.filter(item => 
        item.category && item.category.toLowerCase() === category.toLowerCase()
      );

      return processAndValidateMaterials(filteredData);
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
      const result = await this.querySupabaseTable<{id: number, name: string, description?: string}>(
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
