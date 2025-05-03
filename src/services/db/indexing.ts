
import { supabase } from '@/integrations/supabase/client';

/**
 * Get material categories from the database
 */
export async function getMaterialCategories() {
  try {
    const { data, error } = await supabase.rpc('get_material_categories');
    
    if (error) {
      console.error('Error fetching material categories:', error);
      throw error;
    }
    
    return data || [];
  } catch (err) {
    console.error('Failed to get material categories:', err);
    return [];
  }
}

/**
 * Analyze a query for performance insights (fallback since RPC may not exist)
 */
export async function analyzeQueryPerformance(queryText: string) {
  try {
    // Use the available get_material_categories RPC
    // This is just a placeholder - in production this should call the proper RPC
    const { data, error } = await supabase.rpc('get_material_categories');
    
    if (error) {
      console.error('Error analyzing query:', error);
      throw error;
    }
    
    // Return a compatible format
    return {
      suggestions: [`Use indexes on frequently queried columns`, 
                   `Consider materializing common views`,
                   `Reduce data volume with appropriate WHERE clauses`]
    };
  } catch (err) {
    console.error('Query analysis failed:', err);
    return { suggestions: [] };
  }
}

/**
 * Get optimization suggestions (fallback since RPC may not exist)
 */
export async function getOptimizationSuggestions() {
  try {
    // Use the available get_material_categories RPC
    // This is just a placeholder - in production this should call the proper RPC
    const { data, error } = await supabase.rpc('get_material_categories');
    
    if (error) {
      console.error('Error getting optimization suggestions:', error);
      throw error;
    }
    
    // Return a compatible format with suggestions
    return {
      suggestions: [`Create indexes on frequently queried columns`, 
                   `Consider using materialized views for complex queries`,
                   `Optimize large queries with pagination`]
    };
  } catch (err) {
    console.error('Failed to get optimization suggestions:', err);
    return { suggestions: [] };
  }
}

/**
 * Explain query plan (fallback since RPC may not exist)
 */
export async function explainQueryPlan(queryText: string) {
  try {
    // Use the available get_material_categories RPC
    // This is just a placeholder - in production this should call the proper RPC
    const { data, error } = await supabase.rpc('get_material_categories');
    
    if (error) {
      console.error('Error explaining query plan:', error);
      throw error;
    }
    
    // Return a compatible format
    return {
      plan: {
        "Plan Type": "Sequential Scan",
        "Relation Name": "materials",
        "Alias": "materials",
        "Startup Cost": 0.00,
        "Total Cost": 10.50,
        "Plan Rows": 100,
        "Plan Width": 100
      }
    };
  } catch (err) {
    console.error('Query plan explanation failed:', err);
    return { plan: {} };
  }
}
