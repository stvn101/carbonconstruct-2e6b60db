
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialFetcher } from './baseFetcher';
import { FetchResult } from './types';
import { DatabaseMaterial, MaterialView } from '../types/databaseTypes';
import { processAndValidateMaterials } from '../utils/materialProcessing';
import { guessCategoryFromName } from '../utils/materialUtils';

/**
 * Service for fetching materials using different strategies
 */
export class MaterialFetchStrategies extends MaterialFetcher {
  /**
   * Fetches materials from the materials_view
   */
  async fetchFromView(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabase<MaterialView>(
      'materials_view',
      '*',
      'fetchFromView'
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    return {
      data: processAndValidateMaterials(result.data)
    };
  }

  /**
   * Fetches materials from the materials table
   */
  async fetchFromTable(): Promise<FetchResult<ExtendedMaterialData>> {
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
      return { data: [], error: result.error };
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
  async fetchFromBackup(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabase<MaterialView>(
      'materials_backup',
      '*',
      'fetchFromBackup'
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    return {
      data: processAndValidateMaterials(result.data)
    };
  }

  /**
   * Try multiple strategies to fetch materials
   */
  async fetchWithStrategies(): Promise<FetchResult<ExtendedMaterialData>> {
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
}
