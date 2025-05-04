
/**
 * Types for the material API responses and requests
 */
import { SupabaseMaterial } from '../materialTypes';

/**
 * API response types and interfaces
 */
export interface MaterialApiResponse {
  data: SupabaseMaterial[] | null;
  error: Error | null;
}

export interface CategoriesApiResponse {
  data: string[] | null;
  error: Error | null;
}

/**
 * API request configuration
 */
export interface ApiRequestOptions {
  timeout?: number;
  maxRetries?: number;
  onRetry?: (attempt: number) => void;
}
