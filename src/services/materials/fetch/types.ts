
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

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

// Define valid table names that we actually use
export type ValidTableNames = 'materials_view' | 'materials' | 'materials_backup' | 'material_categories';

export const DEMO_DELAY = 800; // Simulate network delay in demo mode
export const MAX_RETRIES = 3; // Maximum number of retries for fetching materials
export const RETRY_DELAY = 1000; // Delay between retries in milliseconds
