
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function to generate sustainability suggestions based on project data
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract request data
    const { materials, transport, energy, options } = await req.json();
    
    console.log('Generating sustainability suggestions for:', {
      materialCount: materials?.length || 0,
      transportCount: transport?.length || 0,
      energyCount: energy?.length || 0,
      options
    });
    
    // Basic validation
    if (!materials || !Array.isArray(materials) || materials.length === 0) {
      throw new Error('No materials provided for analysis');
    }

    // Here we will access Grok, but for now let's create a local implementation
    // In a full implementation, this would call a proper AI service with the materials data
    const suggestions = generateSustainabilitySuggestions(materials, transport, energy, options);
    
    // Return the suggestions
    return new Response(JSON.stringify(suggestions), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in sustainability suggestions function:', error);
    
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

/**
 * Generate sustainability suggestions based on project data
 * Note: This is a placeholder implementation that would be replaced with actual AI logic
 */
function generateSustainabilitySuggestions(
  materials: any[], 
  transport: any[] = [], 
  energy: any[] = [], 
  options: any = {}
) {
  // Analyze materials for sustainability issues
  const materialAnalysis = analyzeConstructionMaterials(materials);
  
  // Generate high-priority suggestions
  const prioritySuggestions = generatePrioritySuggestions(materialAnalysis, transport, energy);
  
  // Generate comprehensive report if requested
  const format = options?.format || 'basic';
  const includeLifecycleAnalysis = options?.includeLifecycleAnalysis || false;
  const includeComplianceDetails = options?.includeComplianceDetails || false;
  
  let report = null;
  if (format === 'comprehensive' || format === 'detailed') {
    report = {
      materialAnalysis: materialAnalysis,
      transportAnalysis: analyzeTransport(transport),
      energyAnalysis: analyzeEnergy(energy),
      overallScore: calculateSustainabilityScore(materialAnalysis, transport, energy),
      recommendations: generateDetailedRecommendations(materials, transport, energy),
      complianceStatus: includeComplianceDetails ? checkNccAndNabers(materials, energy) : null,
      lifecycleAnalysis: includeLifecycleAnalysis ? performLifecycleAnalysis(materials) : null
    };
  }
  
  // Return combined results
  return {
    success: true,
    suggestions: generateSuggestions(materials, transport, energy),
    prioritySuggestions,
    report,
    timestamp: new Date().toISOString()
  };
}

/**
 * Analyze construction materials for sustainability
 */
function analyzeConstructionMaterials(materials: any[]) {
  // This would be replaced with actual analysis logic
  const categories: Record<string, any[]> = {};
  const sustainabilityIssues = [];
  const sustainabilityStrengths = [];
  
  // Group materials by type/category
  materials.forEach(material => {
    const category = material.type || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(material);
  });
  
  // Look for common sustainability issues
  if (materials.some(m => m.type?.toLowerCase().includes('concrete'))) {
    sustainabilityIssues.push({
      id: 'high-carbon-concrete',
      title: 'High-carbon concrete detected',
      description: 'Traditional concrete has a significant carbon footprint',
      recommendation: 'Consider low-carbon alternatives like geopolymer concrete'
    });
  }
  
  if (!materials.some(m => m.recycledContent > 30)) {
    sustainabilityIssues.push({
      id: 'low-recycled-content',
      title: 'Low recycled content',
      description: 'Most materials have low recycled content percentage',
      recommendation: 'Source materials with higher recycled content'
    });
  }
  
  // Look for sustainability strengths
  if (materials.some(m => m.type?.toLowerCase().includes('timber') || m.type?.toLowerCase().includes('wood'))) {
    sustainabilityStrengths.push({
      id: 'renewable-materials',
      title: 'Renewable materials',
      description: 'Project includes timber/wood which can sequester carbon',
      impact: 'Positive carbon sequestration'
    });
  }
  
  return {
    categories,
    materialCount: materials.length,
    sustainabilityIssues,
    sustainabilityStrengths,
    averageCarbonFootprint: materials.reduce((sum, m) => sum + (m.carbonFootprint || 0), 0) / materials.length,
    materialWithHighestFootprint: [...materials].sort((a, b) => (b.carbonFootprint || 0) - (a.carbonFootprint || 0))[0]
  };
}

/**
 * Analyze transport sustainability
 */
function analyzeTransport(transport: any[] = []) {
  // Placeholder implementation
  return {
    transportModes: transport.map(t => t.mode).filter((v, i, a) => a.indexOf(v) === i),
    totalDistance: transport.reduce((sum, t) => sum + (t.distance || 0), 0),
    sustainabilityScore: calculateTransportSustainabilityScore(transport)
  };
}

/**
 * Analyze energy sustainability
 */
function analyzeEnergy(energy: any[] = []) {
  // Placeholder implementation
  const renewablePercentage = energy.filter(e => 
    e.type?.toLowerCase().includes('solar') || 
    e.type?.toLowerCase().includes('wind') || 
    e.type?.toLowerCase().includes('renewable')
  ).length / (energy.length || 1) * 100;
  
  return {
    energySources: energy.map(e => e.type).filter((v, i, a) => a.indexOf(v) === i),
    renewablePercentage,
    sustainabilityScore: Math.min(100, renewablePercentage)
  };
}

/**
 * Calculate a transport sustainability score
 */
function calculateTransportSustainabilityScore(transport: any[] = []) {
  if (transport.length === 0) return 0;
  
  // Extremely simplified scoring 
  const modeScores: Record<string, number> = {
    'electric': 90,
    'rail': 80,
    'ship': 70,
    'truck': 50,
    'air': 20
  };
  
  return transport.reduce((score, t) => {
    const modeScore = modeScores[t.mode?.toLowerCase()] || 50;
    return score + modeScore;
  }, 0) / transport.length;
}

/**
 * Calculate overall sustainability score
 */
function calculateSustainabilityScore(materialAnalysis: any, transport: any[] = [], energy: any[] = []) {
  // Score weighting
  const materialWeight = 0.6;
  const transportWeight = 0.25;
  const energyWeight = 0.15;
  
  // Calculate component scores (0-100 scale)
  const materialScore = 100 - Math.min(100, materialAnalysis.averageCarbonFootprint / 10);
  const transportScore = calculateTransportSustainabilityScore(transport);
  const energyScore = energy.length > 0 ? 
    analyzeEnergy(energy).sustainabilityScore : 0;
  
  // Calculate weighted score
  return Math.round(
    materialScore * materialWeight +
    transportScore * transportWeight +
    energyScore * energyWeight
  );
}

/**
 * Generate detailed recommendations
 */
function generateDetailedRecommendations(materials: any[], transport: any[] = [], energy: any[] = []) {
  const recommendations = [];
  
  // Material recommendations
  if (materials.some(m => m.type?.toLowerCase().includes('concrete'))) {
    recommendations.push({
      category: 'materials',
      title: 'Use Low-Carbon Concrete',
      description: 'Replace standard concrete with low-carbon alternatives to reduce embodied carbon',
      impact: 'High',
      priority: 1
    });
  }
  
  // Transport recommendations
  if (transport.some(t => t.distance > 500)) {
    recommendations.push({
      category: 'transport',
      title: 'Source Materials Locally',
      description: 'Look for local suppliers to reduce transport emissions',
      impact: 'Medium',
      priority: 2
    });
  }
  
  // Energy recommendations
  if (!energy.some(e => e.type?.toLowerCase().includes('renewable'))) {
    recommendations.push({
      category: 'energy',
      title: 'Integrate Renewable Energy',
      description: 'Incorporate solar or other renewable energy sources',
      impact: 'High',
      priority: 1
    });
  }
  
  return recommendations;
}

/**
 * Check NCC and NABERS compliance
 */
function checkNccAndNabers(materials: any[], energy: any[] = []) {
  // Extremely simplified compliance check
  const hasInsulation = materials.some(m => m.type?.toLowerCase().includes('insulation'));
  const hasRenewableEnergy = energy.some(e => e.type?.toLowerCase().includes('renewable'));
  
  return {
    ncc: {
      compliant: hasInsulation,
      score: hasInsulation ? 75 : 40,
      details: {
        sectionJ: {
          thermalPerformance: hasInsulation,
          insulationStandards: hasInsulation
        }
      }
    },
    nabers: {
      compliant: hasRenewableEnergy,
      rating: hasRenewableEnergy ? 4 : 2
    }
  };
}

/**
 * Perform lifecycle analysis
 */
function performLifecycleAnalysis(materials: any[]) {
  // Placeholder implementation
  return {
    stages: {
      production: {
        emissions: materials.reduce((sum, m) => sum + (m.carbonFootprint || 0) * (m.quantity || 1), 0),
        percentage: 70
      },
      transport: {
        emissions: materials.reduce((sum, m) => sum + (m.carbonFootprint || 0) * 0.15 * (m.quantity || 1), 0),
        percentage: 15
      },
      construction: {
        emissions: materials.reduce((sum, m) => sum + (m.carbonFootprint || 0) * 0.1 * (m.quantity || 1), 0),
        percentage: 10
      },
      endOfLife: {
        emissions: materials.reduce((sum, m) => sum + (m.carbonFootprint || 0) * 0.05 * (m.quantity || 1), 0),
        percentage: 5
      }
    },
    totalLifecycleEmissions: materials.reduce(
      (sum, m) => sum + (m.carbonFootprint || 0) * 1.3 * (m.quantity || 1), 
      0
    )
  };
}

/**
 * Generate general sustainability suggestions
 */
function generateSuggestions(materials: any[], transport: any[] = [], energy: any[] = []) {
  const suggestions = [
    {
      id: 'material-optimization',
      title: 'Optimize Material Selection',
      description: 'Select low-carbon alternatives for your highest-impact materials',
      details: 'Consider replacing traditional materials with sustainable alternatives like recycled steel, mass timber, or low-carbon concrete.'
    },
    {
      id: 'local-sourcing',
      title: 'Source Materials Locally',
      description: 'Reduce transportation emissions by sourcing locally',
      details: 'Look for suppliers within 200km of your construction site to minimize transport-related emissions.'
    }
  ];
  
  // Add material-specific suggestions
  if (materials.some(m => m.type?.toLowerCase().includes('concrete'))) {
    suggestions.push({
      id: 'concrete-alternatives',
      title: 'Use Supplementary Cementitious Materials (SCMs)',
      description: 'Reduce cement content in concrete by using SCMs',
      details: 'Incorporating fly ash, slag, or silica fume can reduce the carbon footprint of concrete by up to 40%.'
    });
  }
  
  // Add energy-specific suggestions
  if (!energy.some(e => e.type?.toLowerCase().includes('renewable'))) {
    suggestions.push({
      id: 'renewable-energy',
      title: 'Incorporate Renewable Energy',
      description: 'Add solar, wind or other renewable energy sources',
      details: 'On-site renewable energy generation can significantly reduce operational carbon emissions.'
    });
  }
  
  return suggestions;
}

/**
 * Generate high-priority suggestions
 */
function generatePrioritySuggestions(materialAnalysis: any, transport: any[] = [], energy: any[] = []) {
  // Get 1-3 highest impact suggestions
  const prioritySuggestions = [];
  
  // Always suggest improving the material with the highest carbon footprint
  if (materialAnalysis.materialWithHighestFootprint) {
    const material = materialAnalysis.materialWithHighestFootprint;
    prioritySuggestions.push({
      id: 'high-impact-material',
      title: `Replace ${material.name || 'high-carbon material'}`,
      description: `This material has the highest carbon impact in your project`,
      action: `Consider sustainable alternatives with lower embodied carbon`
    });
  }
  
  // Suggest local sourcing if transport has long distances
  if (transport.some(t => t.distance > 300)) {
    prioritySuggestions.push({
      id: 'long-distance-transport',
      title: 'Long-distance transportation detected',
      description: 'Some materials are being transported over 300km',
      action: 'Source materials closer to the construction site'
    });
  }
  
  // Suggest renewable energy if not present
  if (!energy.some(e => e.type?.toLowerCase().includes('renewable'))) {
    prioritySuggestions.push({
      id: 'no-renewables',
      title: 'No renewable energy sources',
      description: 'Your project lacks renewable energy integration',
      action: 'Incorporate solar or other renewable energy sources'
    });
  }
  
  return prioritySuggestions.slice(0, 3); // Return at most 3 suggestions
}
