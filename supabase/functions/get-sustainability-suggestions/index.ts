
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client using environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Handle sustainability suggestions API requests
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user information from JWT token
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (user && !error) {
        userId = user.id;
      }
    }

    // Extract request data
    const { materials, transport, energy, options } = await req.json();
    
    // Record usage for tracking
    if (userId) {
      await recordGrokUsage(userId, 'sustainability_suggestions', {
        materialsCount: materials?.length || 0,
        transportCount: transport?.length || 0,
        energyCount: energy?.length || 0,
        optionsFormat: options?.format || 'basic'
      });
    }
    
    // Generate sustainability suggestions
    const suggestions = await generateSustainabilitySuggestions(materials, transport, energy, options);

    // Return the response to the client
    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-sustainability-suggestions function:', error.message);
    
    // Return error response
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error occurred',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to record Grok API usage in the database
async function recordGrokUsage(userId: string, feature: string, metadata: any): Promise<void> {
  try {
    await supabase.from('grok_usage').insert({
      user_id: userId,
      feature,
      metadata,
      tokens_used: estimateTokensUsed(metadata),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log but don't fail the request if usage tracking fails
    console.error('Failed to record Grok usage:', error);
  }
}

// Function to estimate tokens used based on request data
function estimateTokensUsed(metadata: any): number {
  // Simple estimation algorithm - can be refined based on actual usage patterns
  const baseTokens = 100;
  const materialsTokens = (metadata.materialsCount || 0) * 20;
  const transportTokens = (metadata.transportCount || 0) * 15;
  const energyTokens = (metadata.energyCount || 0) * 15;
  
  // Additional tokens for comprehensive format
  const formatMultiplier = metadata.optionsFormat === 'comprehensive' ? 2 : 
                           metadata.optionsFormat === 'detailed' ? 1.5 : 1;
                           
  return Math.ceil((baseTokens + materialsTokens + transportTokens + energyTokens) * formatMultiplier);
}

// Function to generate sustainability suggestions
async function generateSustainabilitySuggestions(materials: any[], transport: any[], energy: any[], options: any): Promise<any> {
  // Implementation would connect to Grok API or use built-in logic
  // For now, we'll return a simple response structure
  const format = options?.format || 'basic';
  
  // Create placeholder suggestions based on materials data
  const suggestions = generatePlaceholderSuggestions(materials, transport, energy, format);
  
  return {
    suggestions: suggestions.general,
    prioritySuggestions: suggestions.priority,
    metadata: {
      source: 'fallback',
      count: suggestions.general.length + suggestions.priority.length,
      categories: {
        material: suggestions.general.filter(s => s.includes('material')).length,
        transport: suggestions.general.filter(s => s.includes('transport')).length,
        energy: suggestions.general.filter(s => s.includes('energy')).length,
        general: suggestions.general.filter(s => !s.includes('material') && !s.includes('transport') && !s.includes('energy')).length,
        priority: suggestions.priority.length
      },
      generatedAt: new Date().toISOString()
    }
  };
}

// Generate placeholder suggestions for development/fallback
function generatePlaceholderSuggestions(materials: any[], transport: any[], energy: any[], format: string): { general: string[], priority: string[] } {
  const generalSuggestions: string[] = [
    "Consider replacing concrete with lower carbon alternatives where structurally feasible",
    "Source materials locally to reduce transportation emissions",
    "Implement renewable energy solutions for construction operations",
    "Prioritize materials with Environmental Product Declarations (EPDs)",
    "Use advanced insulation materials to improve energy efficiency"
  ];
  
  const prioritySuggestions: string[] = [
    "Critical: Replace high-carbon steel with recycled alternatives to meet NCC 2025 requirements",
    "Critical: Improve building envelope design to achieve target NABERS rating"
  ];
  
  if (format === 'detailed' || format === 'comprehensive') {
    generalSuggestions.push(
      "Implement passive design strategies to reduce operational energy needs",
      "Use prefabrication to minimize construction waste and improve efficiency",
      "Select materials with high recycled content and end-of-life recyclability"
    );
  }
  
  if (format === 'comprehensive') {
    generalSuggestions.push(
      "Conduct whole-life carbon assessment to optimize design decisions",
      "Implement digital twin technology for operational optimization",
      "Consider biophilic design elements to improve occupant wellbeing"
    );
  }
  
  return {
    general: generalSuggestions,
    priority: prioritySuggestions
  };
}
