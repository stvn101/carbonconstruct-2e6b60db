
/**
 * Material data types and interfaces shared across material services
 */

// Supabase material type definition - match actual database columns
export interface SupabaseMaterial {
  id: string;
  name: string;
  carbon_footprint_kgco2e_kg: number;
  carbon_footprint_kgco2e_tonne: number;
  category: string;
}

// Material pagination interface
export interface MaterialPagination {
  page: number;
  pageSize: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

// Connection timeout values
export const CONNECTION_TIMEOUT = 15000; // 15 seconds
export const MAX_RETRIES = 2;
export const DEFAULT_PAGE_SIZE = 100;
