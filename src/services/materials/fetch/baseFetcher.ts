
import { supabase } from '@/integrations/supabase/client';
import { handleNetworkError } from '@/utils/errorHandling/networkErrorHandler';
import { FetchResult, ValidTableNames, MAX_RETRIES, RETRY_DELAY } from './types';

/**
 * Base class for material fetching operations
 */
export class MaterialFetcher {
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
    table: ValidTableNames,
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

      return { data: (data || []) as T[] };
    } catch (error) {
      return { data: [], error: error as Error };
    }
  }
}
