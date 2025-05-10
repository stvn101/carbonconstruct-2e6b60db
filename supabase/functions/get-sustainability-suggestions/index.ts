
import { serve } from "https://deno.land/std@0.200.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const body = await req.json();
    const { materials, transport, energy } = body;

    console.log('Request received:', { materials, transport, energy });

    // Generate some sample suggestions based on input
    const suggestions: string[] = [];

    // Material suggestions
    if (materials && materials.length > 0) {
      suggestions.push(
        "Consider replacing concrete with engineered wood products for appropriate applications.",
        "Look into low-carbon cement alternatives that can reduce emissions by up to 30%.",
        "Source locally produced materials to reduce transportation carbon footprint."
      );
    }

    // Transport suggestions
    if (transport && transport.length > 0) {
      suggestions.push(
        "Optimize delivery routes to minimize fuel consumption.",
        "Consider using electric vehicles for short-distance material transport.",
        "Implement a just-in-time delivery system to reduce unnecessary trips."
      );
    }

    // Energy suggestions
    if (energy && energy.length > 0) {
      suggestions.push(
        "Install solar panels or wind turbines on-site to generate clean energy during construction.",
        "Use energy-efficient machinery and equipment during construction.",
        "Implement an energy management system to monitor and optimize energy usage."
      );
    }

    // General suggestions
    suggestions.push(
      "Conduct a detailed life cycle assessment to identify further carbon reduction opportunities.",
      "Establish a carbon monitoring system for ongoing tracking and reporting.",
      "Train your workforce on sustainable construction practices to improve overall efficiency."
    );

    console.log('Generated suggestions:', suggestions);

    return new Response(
      JSON.stringify({
        success: true,
        suggestions: suggestions,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
