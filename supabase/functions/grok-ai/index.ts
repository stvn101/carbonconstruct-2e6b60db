
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle Grok API interactions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract request data
    const { prompt, context, mode } = await req.json();
    
    // Get API key from environment variables
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    
    if (!grokApiKey) {
      throw new Error('GROK_API_KEY is not configured');
    }

    console.log(`Processing ${mode} request with prompt: ${prompt.substring(0, 50)}...`);

    // Prepare the request to Grok API
    const grokRequest = {
      messages: [
        {
          role: "system",
          content: constructSystemPrompt(mode, context)
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: mode === 'creative' ? 0.7 : 0.3,
      max_tokens: 2048
    };

    // Make request to Grok API
    const response = await fetch('https://api.xai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${grokApiKey}`
      },
      body: JSON.stringify(grokRequest)
    });

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Grok API Error: ${errorData.error || response.statusText}`);
    }

    const grokResponse = await response.json();
    console.log('Grok response received successfully');

    // Return the response to the client
    return new Response(JSON.stringify({
      response: grokResponse.choices[0].message.content,
      usage: grokResponse.usage,
      model: grokResponse.model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in grok-ai function:', error.message);
    
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

// Helper function to construct the system prompt based on mode
function constructSystemPrompt(mode: string, context?: any): string {
  const basePrompt = "You are Grok, an AI assistant integrated with CarbonConstruct, a sustainable construction management platform. " +
    "Focus on providing accurate, helpful information about sustainable construction materials, carbon footprint analysis, " +
    "and compliance with building standards like NCC 2025 and NABERS.";
  
  switch (mode) {
    case 'material_analysis':
      return `${basePrompt} Analyze the following construction material data and provide insights on sustainability, carbon footprint, and alternatives: ${JSON.stringify(context)}`;
    
    case 'compliance_check':
      return `${basePrompt} Review the following project details for compliance with NCC 2025 and NABERS standards: ${JSON.stringify(context)}`;
    
    case 'sustainability_advisor':
      return `${basePrompt} Provide practical advice to improve the sustainability of the construction project based on this data: ${JSON.stringify(context)}`;
    
    case 'creative':
      return `${basePrompt} Think creatively about innovative sustainable construction approaches for the following scenario: ${JSON.stringify(context)}`;
    
    default:
      return basePrompt;
  }
}
