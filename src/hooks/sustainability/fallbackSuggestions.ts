
/**
 * Fallback Sustainability Suggestions
 * Provides intelligent suggestions when the API is unavailable
 */
import { SuggestionsResponse, SuggestionMetadata } from './types';

interface MaterialInput {
  id?: string;
  type: string;
  quantity?: string | number;
  factor?: number;
  recyclable?: boolean;
  recycledContent?: number;
  locallySourced?: boolean;
}

interface TransportInput {
  id?: string;
  type: string;
  distance?: string | number;
  weight?: string | number;
  factor?: number;
  fuelType?: string;
  electricVehicle?: boolean;
}

interface EnergyInput {
  id?: string;
  type: string;
  amount?: string | number;
  unit?: string;
  factor?: number;
  renewablePercentage?: number;
}

/**
 * Generates fallback sustainability suggestions based on input data
 */
export function generateLocalFallbackSuggestions(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
): SuggestionsResponse {
  const suggestions: string[] = [];
  const prioritySuggestions: string[] = [];
  
  // Generate suggestions based on material choices
  generateMaterialSuggestions(materials, suggestions, prioritySuggestions);
  
  // Generate suggestions based on transport choices
  generateTransportSuggestions(transport, suggestions, prioritySuggestions);
  
  // Generate suggestions based on energy choices
  generateEnergySuggestions(energy, suggestions, prioritySuggestions);
  
  // Add general sustainability suggestions
  addGeneralSustainabilitySuggestions(suggestions);
  
  // Ensure we have at least some suggestions
  if (suggestions.length === 0) {
    suggestions.push(
      "Consider using materials with lower embodied carbon.",
      "Optimize transportation routes to reduce emissions.",
      "Prioritize renewable energy sources for construction operations."
    );
  }
  
  // Ensure we have some priority suggestions
  if (prioritySuggestions.length === 0 && suggestions.length > 0) {
    // Take the first suggestion as a priority suggestion
    prioritySuggestions.push(suggestions[0]);
  }
  
  // Create metadata
  const metadata: SuggestionMetadata = {
    source: 'fallback',
    count: suggestions.length,
    categories: {
      material: countMaterialSuggestions(suggestions),
      transport: countTransportSuggestions(suggestions),
      energy: countEnergySuggestions(suggestions),
      general: countGeneralSuggestions(suggestions),
      priority: prioritySuggestions.length
    },
    generatedAt: new Date().toISOString()
  };
  
  return {
    suggestions,
    prioritySuggestions,
    report: generateFallbackReport(materials, transport, energy, suggestions),
    metadata
  };
}

/**
 * Generate suggestions based on material choices
 */
function generateMaterialSuggestions(
  materials: MaterialInput[],
  suggestions: string[],
  prioritySuggestions: string[]
): void {
  if (!materials || materials.length === 0) {
    suggestions.push("Add construction materials to get sustainability recommendations.");
    return;
  }
  
  // Look for high-impact materials (concrete, steel)
  const highImpactMaterials = materials.filter(m => 
    (m.type.toLowerCase().includes('concrete') || 
     m.type.toLowerCase().includes('steel')) &&
    Number(m.quantity) > 1000
  );
  
  if (highImpactMaterials.length > 0) {
    const concreteMaterials = highImpactMaterials.filter(m => 
      m.type.toLowerCase().includes('concrete')
    );
    
    const steelMaterials = highImpactMaterials.filter(m => 
      m.type.toLowerCase().includes('steel')
    );
    
    if (concreteMaterials.length > 0) {
      suggestions.push(
        "Consider using low-carbon concrete alternatives such as geopolymer concrete or concrete with recycled aggregates.",
        "Optimize concrete mix designs to reduce cement content while maintaining required strength."
      );
      
      prioritySuggestions.push(
        "Priority: Replace traditional concrete with low-carbon alternatives to reduce embodied carbon by up to 50%."
      );
    }
    
    if (steelMaterials.length > 0) {
      suggestions.push(
        "Source steel with high recycled content to reduce embodied carbon.",
        "Consider using steel from electric arc furnace production rather than basic oxygen furnace."
      );
    }
  }
  
  // Check if there are materials with recyclability info
  const materialsWithRecyclabilityInfo = materials.filter(m => m.recyclable !== undefined);
  
  if (materialsWithRecyclabilityInfo.length === 0) {
    suggestions.push(
      "Add recyclability information to your materials to get more targeted recommendations."
    );
  } else {
    const nonRecyclableMaterials = materialsWithRecyclabilityInfo.filter(m => !m.recyclable);
    
    if (nonRecyclableMaterials.length > 0) {
      suggestions.push(
        `Consider replacing non-recyclable materials (${nonRecyclableMaterials.map(m => m.type).join(', ')}) with recyclable alternatives.`
      );
      
      if (nonRecyclableMaterials.length >= 2) {
        prioritySuggestions.push(
          `Priority: Replace the ${nonRecyclableMaterials.length} non-recyclable materials with recyclable alternatives to improve end-of-life sustainability.`
        );
      }
    }
  }
  
  // Check for locally sourced materials
  const materialsWithSourceInfo = materials.filter(m => m.locallySourced !== undefined);
  
  if (materialsWithSourceInfo.length > 0) {
    const nonLocalMaterials = materialsWithSourceInfo.filter(m => !m.locallySourced);
    
    if (nonLocalMaterials.length > 0) {
      suggestions.push(
        "Source materials locally where possible to reduce transportation emissions and support local economies."
      );
    }
  }
  
  // Add general material suggestions
  suggestions.push(
    "Consider using timber from sustainable forests as a low-carbon alternative to steel or concrete where structurally appropriate.",
    "Explore the use of recycled or reclaimed materials to reduce embodied carbon and waste."
  );
}

/**
 * Generate suggestions based on transport choices
 */
function generateTransportSuggestions(
  transport: TransportInput[],
  suggestions: string[],
  prioritySuggestions: string[]
): void {
  if (!transport || transport.length === 0) {
    suggestions.push("Add transportation information to get sustainability recommendations.");
    return;
  }
  
  // Check for long-distance transportation
  const longDistanceTransport = transport.filter(t => Number(t.distance) > 500);
  
  if (longDistanceTransport.length > 0) {
    suggestions.push(
      "Consider sourcing materials locally to reduce long-distance transportation emissions."
    );
    
    if (longDistanceTransport.length >= 2) {
      prioritySuggestions.push(
        `Priority: Reduce long-distance transportation (${longDistanceTransport.map(t => t.type).join(', ')}) by sourcing materials locally.`
      );
    }
  }
  
  // Check for non-electric vehicles
  const nonElectricVehicles = transport.filter(t => 
    t.electricVehicle === false || 
    (t.fuelType && !t.fuelType.toLowerCase().includes('electric'))
  );
  
  if (nonElectricVehicles.length > 0) {
    suggestions.push(
      "Consider using electric or hybrid vehicles for material transportation to reduce emissions."
    );
  }
  
  // Add general transport suggestions
  suggestions.push(
    "Optimize delivery routes and schedules to minimize transport emissions.",
    "Ensure vehicles are properly maintained for optimal fuel efficiency.",
    "Consider using rail or water transport for heavy materials where feasible, as they typically have lower emissions per ton-kilometer."
  );
}

/**
 * Generate suggestions based on energy choices
 */
function generateEnergySuggestions(
  energy: EnergyInput[],
  suggestions: string[],
  prioritySuggestions: string[]
): void {
  if (!energy || energy.length === 0) {
    suggestions.push("Add energy consumption information to get sustainability recommendations.");
    return;
  }
  
  // Check for renewable energy
  const renewableEnergyItems = energy.filter(e => 
    e.type.toLowerCase().includes('renewable') || 
    e.type.toLowerCase().includes('solar') || 
    e.type.toLowerCase().includes('wind') || 
    (e.renewablePercentage !== undefined && e.renewablePercentage > 50)
  );
  
  if (renewableEnergyItems.length === 0) {
    suggestions.push(
      "Consider using renewable energy sources for construction operations.",
      "Explore on-site renewable energy generation such as solar panels for construction power needs."
    );
    
    prioritySuggestions.push(
      "Priority: Switch to renewable energy sources for construction operations to reduce emissions."
    );
  }
  
  // Check for high energy consumption
  const highEnergyItems = energy.filter(e => Number(e.amount) > 10000);
  
  if (highEnergyItems.length > 0) {
    suggestions.push(
      "Implement energy efficiency measures to reduce high energy consumption.",
      "Use energy-efficient equipment and machinery during construction."
    );
  }
  
  // Add general energy suggestions
  suggestions.push(
    "Install energy monitoring systems to track and optimize energy use during construction.",
    "Consider using battery storage systems to optimize the use of renewable energy."
  );
}

/**
 * Add general sustainability suggestions
 */
function addGeneralSustainabilitySuggestions(suggestions: string[]): void {
  const generalSuggestions = [
    "Implement a comprehensive waste management plan to minimize construction waste.",
    "Consider life cycle assessment (LCA) when selecting materials and systems.",
    "Integrate water conservation measures into the construction process.",
    "Design for disassembly to enable future material reuse and recycling.",
    "Consider NCC 2025 energy efficiency requirements in design decisions.",
    "Target NABERS 5-star or higher rating for optimal building performance.",
    "Implement Building Information Modeling (BIM) to optimize resource use and reduce waste.",
    "Consider embodied carbon alongside operational carbon in design decisions."
  ];
  
  // Add a few general suggestions (not all to avoid overwhelming)
  const numberOfSuggestionsToAdd = Math.min(3, generalSuggestions.length);
  
  for (let i = 0; i < numberOfSuggestionsToAdd; i++) {
    const randomIndex = Math.floor(Math.random() * generalSuggestions.length);
    const suggestion = generalSuggestions.splice(randomIndex, 1)[0];
    suggestions.push(suggestion);
  }
}

/**
 * Count suggestions by category (helper functions)
 */
function countMaterialSuggestions(suggestions: string[]): number {
  return suggestions.filter(s => 
    s.toLowerCase().includes('material') || 
    s.toLowerCase().includes('concrete') ||
    s.toLowerCase().includes('steel') ||
    s.toLowerCase().includes('timber') ||
    s.toLowerCase().includes('recyclable')
  ).length;
}

function countTransportSuggestions(suggestions: string[]): number {
  return suggestions.filter(s => 
    s.toLowerCase().includes('transport') || 
    s.toLowerCase().includes('vehicle') ||
    s.toLowerCase().includes('delivery') ||
    s.toLowerCase().includes('distance')
  ).length;
}

function countEnergySuggestions(suggestions: string[]): number {
  return suggestions.filter(s => 
    s.toLowerCase().includes('energy') || 
    s.toLowerCase().includes('renewable') ||
    s.toLowerCase().includes('solar') ||
    s.toLowerCase().includes('wind') ||
    s.toLowerCase().includes('power')
  ).length;
}

function countGeneralSuggestions(suggestions: string[]): number {
  return suggestions.length - 
    countMaterialSuggestions(suggestions) - 
    countTransportSuggestions(suggestions) - 
    countEnergySuggestions(suggestions);
}

/**
 * Generate a simple fallback report
 */
function generateFallbackReport(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[],
  suggestions: string[]
): any {
  // Calculate total carbon impact (simplified)
  let totalMaterialCarbon = 0;
  let totalTransportCarbon = 0;
  let totalEnergyCarbon = 0;
  
  materials.forEach(material => {
    totalMaterialCarbon += (Number(material.quantity) || 0) * (material.factor || 1);
  });
  
  transport.forEach(t => {
    totalTransportCarbon += (Number(t.distance) || 0) * (Number(t.weight) || 0) * (t.factor || 0.1) / 1000;
  });
  
  energy.forEach(e => {
    totalEnergyCarbon += (Number(e.amount) || 0) * (e.factor || 0.5);
  });
  
  // Generate fallback report
  return {
    generatedAt: new Date().toISOString(),
    suggestions,
    prioritySuggestions: [],
    materialRecommendations: [],
    transportRecommendations: [],
    energyRecommendations: [],
    impactSummary: {
      totalCarbonFootprint: totalMaterialCarbon + totalTransportCarbon + totalEnergyCarbon,
      materialFootprint: totalMaterialCarbon,
      transportFootprint: totalTransportCarbon,
      energyFootprint: totalEnergyCarbon,
      topContributors: identifyTopContributors(materials, transport, energy)
    },
    materialAnalysis: generateMaterialAnalysis(materials)
  };
}

/**
 * Identify top contributors to carbon footprint
 */
function identifyTopContributors(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
): { name: string; impact: number; category: string }[] {
  const contributors: { name: string; impact: number; category: string }[] = [];
  
  // Add materials
  materials.forEach(material => {
    const impact = (Number(material.quantity) || 0) * (material.factor || 1);
    if (impact > 0) {
      contributors.push({
        name: material.type,
        impact,
        category: 'material'
      });
    }
  });
  
  // Add transport
  transport.forEach(t => {
    const impact = (Number(t.distance) || 0) * (Number(t.weight) || 0) * (t.factor || 0.1) / 1000;
    if (impact > 0) {
      contributors.push({
        name: t.type,
        impact,
        category: 'transport'
      });
    }
  });
  
  // Add energy
  energy.forEach(e => {
    const impact = (Number(e.amount) || 0) * (e.factor || 0.5);
    if (impact > 0) {
      contributors.push({
        name: e.type,
        impact,
        category: 'energy'
      });
    }
  });
  
  // Sort by impact (highest first) and return top 5
  return contributors.sort((a, b) => b.impact - a.impact).slice(0, 5);
}

/**
 * Generate material analysis
 */
function generateMaterialAnalysis(materials: MaterialInput[]): any {
  if (!materials || materials.length === 0) {
    return null;
  }
  
  // Calculate total impact
  const totalImpact = materials.reduce((sum, material) => {
    return sum + ((Number(material.quantity) || 0) * (material.factor || 1));
  }, 0);
  
  // Identify high impact materials (those contributing >10% to total)
  const highImpactMaterials = materials
    .map(material => {
      const impact = (Number(material.quantity) || 0) * (material.factor || 1);
      const percentage = totalImpact > 0 ? (impact / totalImpact) * 100 : 0;
      
      return {
        id: material.id || `material-${Math.random().toString(36).substr(2, 9)}`,
        name: material.type,
        impact,
        percentage,
        quantity: Number(material.quantity) || 0,
        factor: material.factor || 1,
        recyclable: material.recyclable || false
      };
    })
    .filter(material => material.percentage >= 10)
    .sort((a, b) => b.impact - a.impact);
  
  return {
    totalImpact,
    highImpactMaterials,
    sustainabilityScore: calculateOverallSustainabilityScore(materials),
    sustainabilityPercentage: materials.filter(m => m.recyclable).length / materials.length * 100,
    recommendations: generateMaterialRecommendations(materials),
    alternatives: {} // Empty for fallback, would be populated by real service
  };
}

/**
 * Calculate overall sustainability score
 */
function calculateOverallSustainabilityScore(materials: MaterialInput[]): number {
  if (!materials || materials.length === 0) {
    return 0;
  }
  
  // Base score starts at 50
  let baseScore = 50;
  
  // Adjust for recyclable materials
  const recyclableMaterials = materials.filter(m => m.recyclable);
  if (recyclableMaterials.length > 0) {
    baseScore += (recyclableMaterials.length / materials.length) * 20;
  }
  
  // Adjust for recycled content
  const materialsWithRecycledContent = materials.filter(m => 
    m.recycledContent !== undefined && m.recycledContent > 0
  );
  
  if (materialsWithRecycledContent.length > 0) {
    const avgRecycledContent = materialsWithRecycledContent.reduce(
      (sum, m) => sum + (m.recycledContent || 0), 0
    ) / materialsWithRecycledContent.length;
    
    baseScore += avgRecycledContent * 0.2; // Up to 20 points for 100% recycled content
  }
  
  // Adjust for locally sourced materials
  const locallySourcedMaterials = materials.filter(m => m.locallySourced);
  if (locallySourcedMaterials.length > 0) {
    baseScore += (locallySourcedMaterials.length / materials.length) * 15;
  }
  
  return Math.min(100, Math.max(0, baseScore));
}

/**
 * Generate material recommendations
 */
function generateMaterialRecommendations(materials: MaterialInput[]): string[] {
  const recommendations: string[] = [];
  
  // Check if concrete is used
  const concreteMaterials = materials.filter(m => 
    m.type.toLowerCase().includes('concrete')
  );
  
  if (concreteMaterials.length > 0) {
    recommendations.push(
      "Consider using low-carbon concrete alternatives.",
      "Optimize concrete mix designs to reduce cement content."
    );
  }
  
  // Check if steel is used
  const steelMaterials = materials.filter(m => 
    m.type.toLowerCase().includes('steel')
  );
  
  if (steelMaterials.length > 0) {
    recommendations.push(
      "Source steel with high recycled content.",
      "Consider using locally produced steel to reduce transportation emissions."
    );
  }
  
  // Add general recommendation
  recommendations.push(
    "Prioritize materials with Environmental Product Declarations (EPDs).",
    "Consider the use of bio-based materials where appropriate."
  );
  
  return recommendations;
}
