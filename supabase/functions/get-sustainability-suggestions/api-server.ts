
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./cors.ts";
import { generateSuggestions } from "./suggestions.ts";
import { MaterialInput, TransportInput, EnergyInput } from "./types.ts";

export function startServer() {
  serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Parse the request body
      const body = await req.json();
      const { materials = [], transport = [], energy = [] } = body;

      // Generate the suggestions
      const result = generateSuggestions(materials, transport, energy);

      // Return the suggestions with metadata
      return new Response(
        JSON.stringify(result),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error in sustainability suggestions API:", error);
      
      // Return an error response
      return new Response(
        JSON.stringify({
          error: "Failed to generate sustainability suggestions",
          message: error.message,
          suggestions: [
            "Consider using low-carbon materials",
            "Optimize transportation routes",
            "Use renewable energy sources"
          ],
          // Include basic metadata even in error case
          metadata: {
            source: "api-fallback",
            error: true,
            categories: {
              material: 1,
              transport: 1,
              energy: 1,
              general: 0,
              priority: 0
            },
            generatedAt: new Date().toISOString()
          }
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  });
}
