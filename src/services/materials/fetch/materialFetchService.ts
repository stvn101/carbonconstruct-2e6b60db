/**
 * Material Fetch Service
 * Handles fetching material data from API and database sources
 */
import { supabase } from '@/integrations/supabase/client';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { cacheMaterials } from '../cache';
import { toast } from 'sonner';
import { handleNetworkError } from '@/utils/errorHandling/networkErrorHandler';
import { 
  guessCategoryFromName, 
  generateDescriptionFromName,
  normalizeRecyclability 
} from '../utils/materialUtils';
import { createFallbackMaterial } from '../utils/fallbackMaterials';
import { DatabaseMaterial, MaterialView } from '../types/databaseTypes';

const DEMO_DELAY = 800; // Simulate network delay in demo mode
const MAX_RETRIES = 3; // Maximum number of retries for fetching materials
const RETRY_DELAY = 1000; // Delay between retries in milliseconds

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  order?: number;
}

export interface FetchError extends Error {
  strategy?: string;
  retryCount?: number;
}

export interface FetchResult<T> {
  data: T[];
  error?: Error;
}

/**
 * Base class for material fetching operations
 */
class MaterialFetcher {
  protected async fetchWithRetry<T>(
    operation: () => Promise<FetchResult<T>>,
    context: string,
    maxRetries = MAX_RETRIES
  ): Promise<T[]> {
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
      try {
        const result = await operation();
        if (result.error) throw result.error;
        return result.data;
      } catch (error) {
        console.error(`Error in ${context} (attempt ${retryCount + 1}):`, error);
        retryCount++;
        
        if (retryCount < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        }
      }
    }
    
    throw new Error(`Failed to fetch after ${maxRetries} attempts`);
  }

  protected async querySupabase<T>(
    table: string,
    query: string,
    context: string
  ): Promise<FetchResult<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(query);

      if (error) {
        throw handleNetworkError(error, context);
      }

      return { data: data || [] };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
}

/**
 * Service for fetching materials from various sources
 */
class MaterialFetchService extends MaterialFetcher {
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
   * Try multiple strategies to fetch materials
   */
  private async fetchWithStrategies(): Promise<FetchResult<ExtendedMaterialData>> {
    const strategies = [
      { name: 'materials_view', fetcher: () => this.fetchFromView() },
      { name: 'materials_backup', fetcher: () => this.fetchFromBackup() },
      { name: 'materials_table', fetcher: () => this.fetchFromTable() }
    ];

    for (const strategy of strategies) {
      try {
        const result = await strategy.fetcher();
        if (result.data.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Strategy ${strategy.name} failed:`, error);
      }
    }

    return { data: [] };
  }

  /**
   * Fetches materials from the materials_view
   */
  private async fetchFromView(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabase<MaterialView>(
      'materials_view',
      '*',
      'fetchFromView'
    );

    if (result.error) {
      return result;
    }

    return {
      data: processAndValidateMaterials(result.data)
    };
  }

  /**
   * Fetches materials from the materials table
   */
  private async fetchFromTable(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabase<DatabaseMaterial>(
      'materials',
      `
        id,
        material,
        description,
        co2e_min,
        co2e_max,
        co2e_avg,
        sustainability_score,
        sustainability_notes,
        applicable_standards,
        ncc_requirements,
        category_id
      `,
      'fetchFromTable'
    );

    if (result.error) {
      return result;
    }

    return {
      data: result.data.map(item => ({
        id: item.id.toString(),
        name: item.material || 'Unknown Material',
        factor: item.co2e_avg || 1,
        unit: 'kg',
        region: 'Australia',
        tags: item.applicable_standards ? [item.applicable_standards] : [],
        sustainabilityScore: item.sustainability_score || 50,
        recyclability: 'Medium' as const,
        notes: item.sustainability_notes || '',
        category: guessCategoryFromName(item.material || ''),
        carbon_footprint_kgco2e_kg: item.co2e_avg || 0,
        carbon_footprint_kgco2e_tonne: item.co2e_avg ? item.co2e_avg * 1000 : 0,
        description: item.description || item.sustainability_notes || ''
      }))
    };
  }

  /**
   * Fetches materials from the backup table
   */
  private async fetchFromBackup(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabase<MaterialView>(
      'materials_backup',
      '*',
      'fetchFromBackup'
    );

    if (result.error) {
      return result;
    }

    return {
      data: processAndValidateMaterials(result.data)
    };
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
        .order('order', { ascending: true });

      if (error) {
        throw handleNetworkError(error, 'fetchCategories');
      }

      return data || [];
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
