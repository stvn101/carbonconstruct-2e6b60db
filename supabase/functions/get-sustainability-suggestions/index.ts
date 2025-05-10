import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, handleCors } from "utils";
import {
  generateMaterialSuggestions,
  generateTransportSuggestions,
  generateEnergySuggestions,
  generateGeneralSuggestions
} from "suggestions";

// Define interfaces for the request data
interface Material {
  name: string;
  quantity?: number;
  type?: string;
  [key: string]: unknown;
}

interface TransportItem {
  type: string;
  distance?: number;
  fuel?: string;
  [key: string]: unknown;
}

interface EnergyItem {
  source: string;
  consumption?: number;
  [key: string]: unknown;
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const body = await req.json();
    const { materials, transport, energy } = body;

    console.log('Request received:', { materials, transport, energy });

    // Generate suggestions
    const suggestions = [
      ...generateMaterialSuggestions({ materials }),
      ...generateTransportSuggestions(transport),
      ...generateEnergySuggestions(energy),
      ...generateGeneralSuggestions(),
    ];

    console.log('Generated suggestions:', suggestions);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
