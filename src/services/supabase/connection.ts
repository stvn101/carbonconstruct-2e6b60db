
import { supabase } from "@/integrations/supabase/client";
import { retryWithBackoff } from "@/utils/errorHandling/timeoutHelper";

/**
 * Check if we can connect to Supabase by making a lightweight request
 */
export async function pingSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count(*)', { count: 'exact', head: true })
      .limit(1)
      .maybeSingle();
    
    return !error;
  } catch (error) {
    console.error('Supabase connection check failed:', error);
    return false;
  }
}

/**
 * Attempt to connect to Supabase with retries
 * @param maxRetries Maximum number of retries
 * @param delayMs Delay between retries in milliseconds
 * @returns Promise resolving to boolean indicating success
 */
export async function checkSupabaseConnectionWithRetry(
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<boolean> {
  try {
    return await retryWithBackoff(
      pingSupabaseConnection,
      maxRetries,
      delayMs
    );
  } catch (error) {
    console.error('Failed to connect to Supabase after retries:', error);
    return false;
  }
}
