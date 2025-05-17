
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export interface ApiRequestOptions {
  columns?: string;
  limit?: number;
  offset?: number;
  category?: string;
  region?: string;
  maxRetries?: number;
  onRetry?: (attempt: number) => void;
  timeout?: number;
  forceRefresh?: boolean;
}

export interface MaterialApiResponse {
  data: ExtendedMaterialData[] | null;
  error: Error | null;
}

export interface CategoriesApiResponse {
  data: string[];
  error: Error | null;
}

export interface MaterialMapResult {
  validMaterials: ExtendedMaterialData[];
  invalidCount: number;
}
