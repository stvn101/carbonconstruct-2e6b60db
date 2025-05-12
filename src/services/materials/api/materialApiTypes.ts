
/**
 * Type definitions for the Material API client
 */

/**
 * Interface for API request options
 */
export interface ApiRequestOptions {
  /**
   * Maximum number of retries for the request
   */
  maxRetries?: number;
  
  /**
   * Timeout in milliseconds
   */
  timeout?: number;
  
  /**
   * Callback function to run on retry
   */
  onRetry?: (attempt: number) => void;

  /**
   * Maximum number of records to return
   */
  limit?: number;
  
  /**
   * Number of records to skip
   */
  offset?: number;
  
  /**
   * Specific columns to select
   */
  columns?: string;
  
  /**
   * Filter by category
   */
  category?: string;
  
  /**
   * Filter by region
   */
  region?: string;
}

/**
 * Interface for material API response
 */
export interface MaterialApiResponse<T> {
  /**
   * The data returned by the API
   */
  data?: T[];
  
  /**
   * Any error that occurred during the request
   */
  error?: Error;
}

/**
 * Interface for categories API response
 */
export interface CategoriesApiResponse {
  /**
   * The categories returned by the API
   */
  categories?: string[];
  
  /**
   * Any error that occurred during the request
   */
  error?: Error;
}
