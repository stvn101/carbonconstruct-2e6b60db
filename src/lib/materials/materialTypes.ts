
/**
 * Type definitions for material data
 */

export interface BaseMaterialData {
  id: string;
  name: string;
  factor?: number;
  unit?: string;
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  region?: string;
}

export interface ExtendedMaterialData extends BaseMaterialData {
  category?: string;
  sustainabilityscore?: number;
  recyclability?: string;
  tags?: string[];
  notes?: string;
  alternativeto?: string;
}

export interface MaterialCategory {
  name: string;
  count: number;
}

export interface MaterialSearchParams {
  query?: string;
  category?: string;
  region?: string;
  sort?: 'name' | 'factor' | 'category';
  direction?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface MaterialSearchResult {
  materials: ExtendedMaterialData[];
  total: number;
  page: number;
  pages: number;
}

export interface MaterialCacheMetadata {
  lastUpdated: string;
  count: number;
  categories: string[];
  regions: string[];
}
