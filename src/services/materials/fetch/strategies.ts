
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
   * Fetches materials from the materials_view (primary source)
   */
  async fetchFromView(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabaseView<MaterialView>(
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
   * Fetches materials from the main materials table (contains 153+ materials)
   */
  async fetchFromMaterialsTable(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabaseTable<DatabaseMaterial>(
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
      'fetchFromMaterialsTable'
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
   * Fetches materials from the backup materials table
   */
  async fetchFromBackupTable(): Promise<FetchResult<ExtendedMaterialData>> {
    const result = await this.querySupabaseTable<any>(
      'materials_backup',
      '*',
      'fetchFromBackupTable'
    );

    if (result.error) {
      return { data: [], error: result.error };
    }

    return {
      data: processAndValidateMaterials(result.data)
    };
  }

  /**
   * Fetches materials from dependent views
   */
  async fetchFromDependentViews(): Promise<FetchResult<ExtendedMaterialData>> {
    // Try dependent_view1 first, then dependent_view2
    for (const viewName of ['dependent_view1', 'dependent_view2'] as const) {
      try {
        const result = await this.querySupabaseView<any>(
          viewName,
          '*',
          `fetchFrom${viewName}`
        );

        if (!result.error && result.data.length > 0) {
          return {
            data: result.data.map((item: any) => ({
              id: item.id?.toString() || 'unknown',
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
      } catch (error) {
        console.warn(`Failed to fetch from ${viewName}:`, error);
        continue;
      }
    }

    return { data: [] };
  }

  /**
   * Try multiple strategies to fetch materials in order of preference
   */
  async fetchWithStrategies(): Promise<FetchResult<ExtendedMaterialData>> {
    const strategies = [
      { name: 'materials_table', fetcher: () => this.fetchFromMaterialsTable() },
      { name: 'materials_view', fetcher: () => this.fetchFromView() },
      { name: 'materials_backup', fetcher: () => this.fetchFromBackupTable() },
      { name: 'dependent_views', fetcher: () => this.fetchFromDependentViews() }
    ];

    let allMaterials: ExtendedMaterialData[] = [];
    const errors: Error[] = [];

    for (const strategy of strategies) {
      try {
        console.log(`Trying strategy: ${strategy.name}`);
        const result = await strategy.fetcher();
        
        if (result.data.length > 0) {
          console.log(`Strategy ${strategy.name} succeeded with ${result.data.length} materials`);
          allMaterials = [...allMaterials, ...result.data];
        }
        
        if (result.error) {
          errors.push(result.error);
        }
      } catch (error) {
        console.warn(`Strategy ${strategy.name} failed:`, error);
        errors.push(error as Error);
      }
    }

    // Remove duplicates based on ID or name
    const uniqueMaterials = allMaterials.filter((material, index, arr) => 
      arr.findIndex(m => m.id === material.id || (m.name === material.name && material.name)) === index
    );

    console.log(`Combined materials from all sources: ${uniqueMaterials.length} unique materials`);

    if (uniqueMaterials.length > 0) {
      return { data: uniqueMaterials };
    }

    // If no materials found, return error from the first strategy
    return { 
      data: [], 
      error: errors[0] || new Error('No materials found in any source') 
    };
  }
}
