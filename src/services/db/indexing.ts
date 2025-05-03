
import { supabase } from '@/integrations/supabase/client';

/**
 * Diagnostic function to analyze query performance
 * This function is safe to run in production as it only logs diagnostics
 */
export async function analyzeQueryPerformance(
  queryName: string, 
  tableName: string,
  conditions: string[]
): Promise<void> {
  try {
    console.log(`Running query analysis for "${queryName}" on table "${tableName}"`);
    console.log(`Conditions: ${conditions.join(', ')}`);
    
    // This is a read-only operation that helps identify missing indexes
    const { data, error } = await supabase
      .rpc('analyze_query_performance', { 
        p_query_name: queryName,
        p_table_name: tableName,
        p_conditions: conditions
      });
    
    if (error) {
      console.error('Error analyzing query:', error);
      return;
    }
    
    if (data) {
      console.log('Query performance analysis:', data);
    }
  } catch (err) {
    console.error('Error in analyzeQueryPerformance:', err);
  }
}

/**
 * Get optimization suggestions for slow queries
 * Helps identify potential indexing improvements
 */
export async function getQueryOptimizationSuggestions(
  tableName: string
): Promise<{ suggestions: string[] } | null> {
  try {
    const { data, error } = await supabase
      .rpc('get_optimization_suggestions', { 
        p_table_name: tableName
      });
    
    if (error) {
      console.error('Error getting optimization suggestions:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in getQueryOptimizationSuggestions:', err);
    return null;
  }
}

/**
 * Check query plan to evaluate if appropriate indexes are being used
 */
export async function checkQueryPlan(
  sqlQuery: string
): Promise<{ plan: any } | null> {
  try {
    const { data, error } = await supabase
      .rpc('explain_query_plan', { 
        p_query: sqlQuery
      });
    
    if (error) {
      console.error('Error checking query plan:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in checkQueryPlan:', err);
    return null;
  }
}
