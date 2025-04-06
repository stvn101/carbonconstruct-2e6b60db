
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const materialSuggestions = {
  "concrete": [
    "Consider using low-carbon concrete alternatives that include recycled materials or supplementary cementitious materials like fly ash or slag.",
    "Optimize concrete mix designs to reduce cement content while maintaining required strength properties.",
    "Explore geopolymer concrete which can reduce carbon emissions by up to 80% compared to traditional Portland cement concrete.",
  ],
  "steel": [
    "Source recycled steel which has significantly lower embodied carbon than virgin steel.",
    "Consider using high-strength steel that allows for reduced material quantities.",
    "Investigate electric arc furnace (EAF) produced steel which has a lower carbon footprint than basic oxygen furnace (BOF) steel.",
  ],
  "wood": [
    "Source timber from sustainably managed forests with FSC or PEFC certification.",
    "Consider engineered wood products like CLT or glulam which can replace more carbon-intensive materials.",
    "Evaluate using reclaimed or salvaged wood for architectural features.",
  ],
  "brick": [
    "Look for locally-produced bricks to minimize transportation emissions.",
    "Consider unfired or low-fired clay bricks which require less energy to produce.",
    "Investigate reclaimed bricks which have minimal additional carbon impact.",
  ],
  "insulation": [
    "Choose natural insulation materials like cellulose, wood fiber, or sheep's wool.",
    "Consider high-recycled content options like mineral wool made with slag.",
    "Ensure proper installation to maximize thermal efficiency benefits.",
  ],
  "glass": [
    "Optimize window-to-wall ratios to balance natural light with thermal performance.",
    "Select high-performance double or triple-glazed units with low-e coatings.",
    "Consider using recycled glass content where appropriate.",
  ],
  "aluminum": [
    "Source aluminum with high recycled content.",
    "Consider alternatives to aluminum where possible, as virgin aluminum is highly energy-intensive.",
    "Specify low-carbon aluminum produced using renewable energy.",
  ]
};

const transportSuggestions = [
  "Prioritize local sourcing of materials to minimize transportation distances.",
  "Optimize delivery schedules to ensure full loads and reduce the number of trips.",
  "Consider rail or water transport for bulk materials where possible, as these modes have lower carbon emissions than road transport.",
  "Use electric or alternative fuel vehicles for site deliveries when feasible.",
  "Implement a materials logistics plan to reduce unnecessary movement of materials within the site.",
  "Consider consolidated delivery centers for urban projects to reduce congestion and emissions.",
  "Require suppliers to report on and reduce their transportation emissions.",
];

const energySuggestions = [
  "Power construction equipment with renewable energy sources where possible.",
  "Implement an energy management system to monitor and minimize on-site energy use.",
  "Use energy-efficient temporary site facilities and lighting.",
  "Train site workers on energy-saving practices and equipment operation.",
  "Consider hybrid or electric construction equipment to reduce diesel consumption.",
  "Install smart meters to track energy usage patterns and identify reduction opportunities.",
  "Schedule high-energy activities during off-peak periods when the grid may have lower carbon intensity.",
  "Explore on-site renewable energy generation for construction power needs.",
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { materials, transport, energy } = await req.json();
    
    const suggestions: string[] = [];
    
    // Process materials
    if (materials && materials.length > 0) {
      const materialTypes = materials.map((m: any) => m.type.toLowerCase());
      
      // Add material-specific suggestions based on what's in the project
      materialTypes.forEach((type: string) => {
        const typeKey = Object.keys(materialSuggestions).find(key => type.includes(key));
        if (typeKey && materialSuggestions[typeKey as keyof typeof materialSuggestions]) {
          // Add one random suggestion for this material type
          const typeSuggestions = materialSuggestions[typeKey as keyof typeof materialSuggestions];
          const randomSuggestion = typeSuggestions[Math.floor(Math.random() * typeSuggestions.length)];
          suggestions.push(randomSuggestion);
        }
      });
    }
    
    // Add transport suggestions if transport is used
    if (transport && transport.length > 0) {
      // Add 2 random transport suggestions
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * transportSuggestions.length);
        const suggestion = transportSuggestions[randomIndex];
        if (!suggestions.includes(suggestion)) {
          suggestions.push(suggestion);
        }
      }
    }
    
    // Add energy suggestions if energy is used
    if (energy && energy.length > 0) {
      // Add 2 random energy suggestions
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * energySuggestions.length);
        const suggestion = energySuggestions[randomIndex];
        if (!suggestions.includes(suggestion)) {
          suggestions.push(suggestion);
        }
      }
    }
    
    // Ensure we have at least 5 suggestions by adding general ones if needed
    const generalSuggestions = [
      "Perform a whole-life carbon assessment to identify the biggest emission reduction opportunities.",
      "Consider design for disassembly to allow materials to be reused at end-of-life.",
      "Implement a construction waste management plan to minimize landfill waste.",
      "Set carbon reduction targets and regularly monitor progress.",
      "Engage with suppliers early to identify lower-carbon material options.",
      "Consider carbon offsetting for unavoidable emissions as part of a broader reduction strategy.",
      "Conduct regular carbon footprint assessments throughout the construction process.",
      "Invest in training for project teams on carbon reduction strategies and sustainable construction practices.",
    ];
    
    while (suggestions.length < 5) {
      const randomIndex = Math.floor(Math.random() * generalSuggestions.length);
      const suggestion = generalSuggestions[randomIndex];
      if (!suggestions.includes(suggestion)) {
        suggestions.push(suggestion);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        suggestions,
        message: "These are AI-generated suggestions to reduce the carbon footprint of your construction project."
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
