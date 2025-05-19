
import { Material } from "./Material.ts";
import { TransportItem } from "./Transport.ts";
import { EnergyItem } from "./Energy.ts";
import { 
  ReportFormat, 
  SustainabilityReport, 
  ReportRequestOptions,
  MaterialRecommendation,
  TransportRecommendation,
  EnergyRecommendation,
  LifecycleAnalysis,
  ImplementationStep
} from "./Report.ts";

// Calculate the completeness of the provided data to determine report quality
export function calculateDataCompleteness(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): number {
  let score = 0;
  
  // Score based on number of materials
  if (materials.length > 0) {
    score += Math.min(materials.length * 10, 40);
    
    // Additional points for material details
    const detailedMaterials = materials.filter(m => 
      m.recyclable !== undefined || 
      m.recycledContent !== undefined || 
      m.locallySourced !== undefined
    );
    score += Math.min(detailedMaterials.length * 5, 20);
  }
  
  // Score based on transport data
  if (transport.length > 0) {
    score += Math.min(transport.length * 10, 30);
    
    // Additional points for transport details
    const detailedTransport = transport.filter(t => t.fuelType !== undefined);
    score += detailedTransport.length * 5;
  }
  
  // Score based on energy data
  if (energy.length > 0) {
    score += Math.min(energy.length * 10, 30);
  }
  
  return Math.min(score, 100);
}

// Generate material recommendations based on input
function generateMaterialRecommendations(materials: Material[]): MaterialRecommendation[] {
  const recommendations: MaterialRecommendation[] = [];
  
  for (const material of materials) {
    // Skip materials with very small quantities
    if (material.quantity <= 0) continue;
    
    // Generate recommendations based on material type
    if (material.name.toLowerCase().includes('concrete')) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: 'Low-carbon concrete',
        carbonReduction: 30,
        costImpact: 15,
        availability: 'high',
        additionalBenefits: ['Comparable strength properties', 'Reduces cement content']
      });
    }
    else if (material.name.toLowerCase().includes('steel')) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: 'Recycled steel',
        carbonReduction: 40,
        costImpact: -5,
        availability: 'high',
        additionalBenefits: ['Reduces virgin material use', 'Same structural properties']
      });
    }
    else if (material.name.toLowerCase().includes('insulation')) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: 'Bio-based insulation',
        carbonReduction: 45,
        costImpact: 20,
        availability: 'medium',
        additionalBenefits: ['Natural material', 'Non-toxic', 'Biodegradable']
      });
    }
    else if (material.name.toLowerCase().includes('timber') || 
             material.name.toLowerCase().includes('wood')) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: 'FSC-certified engineered timber',
        carbonReduction: 60,
        costImpact: 10,
        availability: 'high',
        additionalBenefits: ['Carbon sequestration', 'Renewable resource']
      });
    }
    else {
      // Generic recommendation for other materials
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: 'Recycled or locally-sourced alternative',
        carbonReduction: 20,
        costImpact: 5,
        availability: 'medium',
        additionalBenefits: ['Reduced carbon footprint', 'Supports circular economy']
      });
    }
  }
  
  return recommendations;
}

// Generate transport recommendations
function generateTransportRecommendations(transport: TransportItem[]): TransportRecommendation[] {
  const recommendations: TransportRecommendation[] = [];
  
  for (const item of transport) {
    // Skip items with no distance
    if (item.distance <= 0) continue;
    
    if (item.type.toLowerCase().includes('truck') || item.type.toLowerCase().includes('road')) {
      if (item.distance > 500) {
        recommendations.push({
          currentMode: item.type,
          recommendedMode: 'Rail freight',
          distance: item.distance,
          carbonReduction: 70,
          costImpact: -10,
          feasibility: 'medium'
        });
      } else {
        recommendations.push({
          currentMode: item.type,
          recommendedMode: 'Electric truck',
          distance: item.distance,
          carbonReduction: 40,
          costImpact: 15,
          feasibility: 'high'
        });
      }
    }
    else if (item.type.toLowerCase().includes('air')) {
      recommendations.push({
        currentMode: item.type,
        recommendedMode: 'Sea freight',
        distance: item.distance,
        carbonReduction: 85,
        costImpact: -30,
        feasibility: item.distance > 1000 ? 'high' : 'low'
      });
    }
    else {
      // Generic recommendation
      recommendations.push({
        currentMode: item.type,
        recommendedMode: 'Optimized logistics',
        distance: item.distance,
        carbonReduction: 15,
        costImpact: -5,
        feasibility: 'high'
      });
    }
  }
  
  return recommendations;
}

// Generate energy recommendations
function generateEnergyRecommendations(energy: EnergyItem[]): EnergyRecommendation[] {
  const recommendations: EnergyRecommendation[] = [];
  
  for (const item of energy) {
    // Skip items with no quantity
    if (item.quantity <= 0) continue;
    
    if (item.source.toLowerCase().includes('grid') || 
        item.source.toLowerCase().includes('electricity')) {
      recommendations.push({
        currentSource: item.source,
        recommendedSource: 'On-site solar PV',
        carbonReduction: 80,
        costImpact: -5,
        implementationComplexity: 'medium'
      });
    }
    else if (item.source.toLowerCase().includes('diesel') || 
             item.source.toLowerCase().includes('petrol') ||
             item.source.toLowerCase().includes('gas')) {
      recommendations.push({
        currentSource: item.source,
        recommendedSource: 'Electric equipment with renewable energy',
        carbonReduction: 65,
        costImpact: 25,
        implementationComplexity: 'medium'
      });
    }
    else if (item.source.toLowerCase().includes('coal') || 
             item.source.toLowerCase().includes('oil')) {
      recommendations.push({
        currentSource: item.source,
        recommendedSource: 'Renewable energy sources',
        carbonReduction: 90,
        costImpact: 15,
        implementationComplexity: 'high'
      });
    }
    else {
      // Generic recommendation
      recommendations.push({
        currentSource: item.source,
        recommendedSource: 'Energy-efficient alternative',
        carbonReduction: 30,
        costImpact: 0,
        implementationComplexity: 'low'
      });
    }
  }
  
  return recommendations;
}

// Generate lifecycle analysis
function generateLifecycleAnalysis(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): LifecycleAnalysis {
  // Calculate approximate emissions distribution based on input data
  const totalMaterialEmissions = materials.reduce((sum, m) => sum + (m.carbonFootprint * m.quantity), 0);
  const totalTransportEmissions = transport.reduce((sum, t) => sum + (t.emissionsFactor * t.distance * t.weight), 0);
  const totalEnergyEmissions = energy.reduce((sum, e) => sum + (e.emissionsFactor * e.quantity), 0);
  
  const totalEmissions = totalMaterialEmissions + totalTransportEmissions + totalEnergyEmissions;
  
  // Default distribution if we don't have enough data
  let extractionPct = 25;
  let manufacturingPct = 20;
  let transportationPct = 15;
  let constructionPct = 10;
  let operationPct = 25;
  let endOfLifePct = 5;
  
  // Adjust based on actual data
  if (totalEmissions > 0) {
    if (totalMaterialEmissions > 0) {
      // Materials affect extraction, manufacturing and end-of-life
      extractionPct = Math.round((totalMaterialEmissions / totalEmissions) * 40) + 10;
      manufacturingPct = Math.round((totalMaterialEmissions / totalEmissions) * 30) + 10;
      endOfLifePct = Math.round((totalMaterialEmissions / totalEmissions) * 10) + 2;
    }
    
    if (totalTransportEmissions > 0) {
      transportationPct = Math.round((totalTransportEmissions / totalEmissions) * 80) + 5;
    }
    
    if (totalEnergyEmissions > 0) {
      constructionPct = Math.round((totalEnergyEmissions / totalEmissions) * 30) + 5;
      operationPct = Math.round((totalEnergyEmissions / totalEmissions) * 40) + 10;
    }
    
    // Normalize percentages to total 100%
    const total = extractionPct + manufacturingPct + transportationPct + 
                 constructionPct + operationPct + endOfLifePct;
                 
    const factor = 100 / total;
    
    extractionPct = Math.round(extractionPct * factor);
    manufacturingPct = Math.round(manufacturingPct * factor);
    transportationPct = Math.round(transportationPct * factor);
    constructionPct = Math.round(constructionPct * factor);
    operationPct = Math.round(operationPct * factor);
    endOfLifePct = Math.round(endOfLifePct * factor);
    
    // Ensure we still total to 100 after rounding
    const finalTotal = extractionPct + manufacturingPct + transportationPct + 
                     constructionPct + operationPct + endOfLifePct;
                     
    if (finalTotal < 100) {
      operationPct += (100 - finalTotal);
    } else if (finalTotal > 100) {
      operationPct -= (finalTotal - 100);
    }
  }
  
  return {
    stages: {
      extraction: extractionPct,
      manufacturing: manufacturingPct,
      transportation: transportationPct,
      construction: constructionPct,
      operation: operationPct,
      endOfLife: endOfLifePct
    },
    totalLifecycleEmissions: Math.round(totalEmissions * 1.2), // Approximate full lifecycle
    recommendations: [
      "Consider material substitution to reduce extraction emissions",
      "Source materials from manufacturers with renewable energy",
      "Optimize transportation routes and use low-carbon transport modes",
      "Implement energy-efficient construction methods",
      "Design for energy efficiency during operation",
      "Plan for material reuse and recycling at end of life"
    ]
  };
}

// Generate implementation roadmap
function generateImplementationRoadmap(
  materialRecs: MaterialRecommendation[],
  transportRecs: TransportRecommendation[],
  energyRecs: EnergyRecommendation[]
): ImplementationStep[] {
  const roadmap: ImplementationStep[] = [];
  
  // Immediate steps (quick wins)
  roadmap.push({
    phase: 'immediate',
    actions: [
      "Source recycled steel instead of virgin steel",
      "Optimize transport routes to minimize distances",
      "Use energy-efficient equipment on site"
    ],
    estimatedTimeframe: "1-4 weeks",
    estimatedCostRange: "Low",
    estimatedCarbonSavings: 500
  });
  
  // Short-term steps
  const shortTermActions: string[] = [];
  
  // Add material actions for high availability items
  materialRecs
    .filter(r => r.availability === 'high')
    .forEach(r => {
      shortTermActions.push(`Replace ${r.originalMaterial} with ${r.recommendedAlternative}`);
    });
    
  // Add transport actions for high feasibility items
  transportRecs
    .filter(r => r.feasibility === 'high')
    .forEach(r => {
      shortTermActions.push(`Switch from ${r.currentMode} to ${r.recommendedMode} for applicable routes`);
    });
  
  // Add energy actions for low complexity items
  energyRecs
    .filter(r => r.implementationComplexity === 'low')
    .forEach(r => {
      shortTermActions.push(`Transition from ${r.currentSource} to ${r.recommendedSource} where possible`);
    });
  
  if (shortTermActions.length > 0) {
    roadmap.push({
      phase: 'short-term',
      actions: shortTermActions.slice(0, 5), // Limit to 5 actions
      estimatedTimeframe: "1-3 months",
      estimatedCostRange: "Low to Medium",
      estimatedCarbonSavings: 1200
    });
  }
  
  // Medium-term steps
  const mediumTermActions: string[] = [];
  
  // Add material actions for medium availability items
  materialRecs
    .filter(r => r.availability === 'medium')
    .forEach(r => {
      mediumTermActions.push(`Implement ${r.recommendedAlternative} across all applicable use cases`);
    });
    
  // Add transport actions for medium feasibility items
  transportRecs
    .filter(r => r.feasibility === 'medium')
    .forEach(r => {
      mediumTermActions.push(`Develop infrastructure for ${r.recommendedMode} transport`);
    });
  
  // Add energy actions for medium complexity items
  energyRecs
    .filter(r => r.implementationComplexity === 'medium')
    .forEach(r => {
      mediumTermActions.push(`Install ${r.recommendedSource} systems`);
    });
  
  if (mediumTermActions.length > 0) {
    roadmap.push({
      phase: 'medium-term',
      actions: mediumTermActions.slice(0, 5), // Limit to 5 actions
      estimatedTimeframe: "3-12 months",
      estimatedCostRange: "Medium",
      estimatedCarbonSavings: 3000
    });
  }
  
  // Long-term steps
  roadmap.push({
    phase: 'long-term',
    actions: [
      "Develop closed-loop material recycling system",
      "Transition to fully electric transport fleet",
      "Implement on-site renewable energy generation",
      "Establish carbon offsetting program for residual emissions"
    ],
    estimatedTimeframe: "1-3 years",
    estimatedCostRange: "High",
    estimatedCarbonSavings: 8000
  });
  
  return roadmap;
}

// Calculate basic score based on input data
function calculateSustainabilityScore(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): {
  overall: number;
  materials: number;
  transport: number;
  energy: number;
} {
  // Start with a baseline score
  let materialsScore = 50;
  let transportScore = 50;
  let energyScore = 50;
  
  // Adjust materials score
  if (materials.length > 0) {
    // Adjust for recyclable materials
    const recyclableMaterials = materials.filter(m => m.recyclable === true);
    if (recyclableMaterials.length > 0) {
      materialsScore += (recyclableMaterials.length / materials.length) * 25;
    }
    
    // Adjust for locally sourced materials
    const localMaterials = materials.filter(m => m.locallySourced === true);
    if (localMaterials.length > 0) {
      materialsScore += (localMaterials.length / materials.length) * 15;
    }
    
    // Adjust for materials with recycled content
    const recycledMaterials = materials.filter(m => (m.recycledContent || 0) > 0);
    if (recycledMaterials.length > 0) {
      const avgRecycledContent = recycledMaterials.reduce((sum, m) => sum + (m.recycledContent || 0), 0) / recycledMaterials.length;
      materialsScore += (avgRecycledContent / 100) * 10;
    }
  }
  
  // Adjust transport score
  if (transport.length > 0) {
    // Adjust for transport distances
    const avgDistance = transport.reduce((sum, t) => sum + t.distance, 0) / transport.length;
    if (avgDistance < 100) {
      transportScore += 30;
    } else if (avgDistance < 500) {
      transportScore += 15;
    } else if (avgDistance > 1000) {
      transportScore -= 15;
    }
    
    // Adjust for transport types
    const lowEmissionTransport = transport.filter(t => 
      t.type.toLowerCase().includes('electric') || 
      t.type.toLowerCase().includes('rail') ||
      t.type.toLowerCase().includes('sea')
    );
    
    if (lowEmissionTransport.length > 0) {
      transportScore += (lowEmissionTransport.length / transport.length) * 20;
    }
  }
  
  // Adjust energy score
  if (energy.length > 0) {
    // Adjust for renewable energy sources
    const renewableEnergy = energy.filter(e => 
      e.source.toLowerCase().includes('solar') || 
      e.source.toLowerCase().includes('wind') ||
      e.source.toLowerCase().includes('hydro') ||
      e.source.toLowerCase().includes('renewable')
    );
    
    if (renewableEnergy.length > 0) {
      energyScore += (renewableEnergy.length / energy.length) * 40;
    }
    
    // Adjust for high-emission energy sources
    const highEmissionEnergy = energy.filter(e => 
      e.source.toLowerCase().includes('coal') || 
      e.source.toLowerCase().includes('oil') ||
      e.source.toLowerCase().includes('diesel') ||
      e.source.toLowerCase().includes('petrol')
    );
    
    if (highEmissionEnergy.length > 0) {
      energyScore -= (highEmissionEnergy.length / energy.length) * 30;
    }
  }
  
  // Ensure scores are within 0-100 range
  materialsScore = Math.max(0, Math.min(100, Math.round(materialsScore)));
  transportScore = Math.max(0, Math.min(100, Math.round(transportScore)));
  energyScore = Math.max(0, Math.min(100, Math.round(energyScore)));
  
  // Calculate overall score (weighted average)
  const overall = Math.round((materialsScore * 0.5) + (transportScore * 0.3) + (energyScore * 0.2));
  
  return {
    overall,
    materials: materialsScore,
    transport: transportScore,
    energy: energyScore
  };
}

// Generate a list of general sustainability suggestions
function generateSustainabilitySuggestions(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): string[] {
  const suggestions: string[] = [];
  
  // Material-related suggestions
  if (materials.length > 0) {
    const concreteUsed = materials.some(m => m.name.toLowerCase().includes('concrete'));
    if (concreteUsed) {
      suggestions.push("Priority: Replace traditional concrete with geopolymer or low-carbon alternatives");
      suggestions.push("Consider using fly ash or slag as cement replacement to reduce embodied carbon");
    }
    
    const steelUsed = materials.some(m => m.name.toLowerCase().includes('steel'));
    if (steelUsed) {
      suggestions.push("Priority: Source steel with high recycled content");
      suggestions.push("Consider using steel certified under responsible production schemes");
    }
    
    suggestions.push("Select materials with Environmental Product Declarations (EPDs)");
    suggestions.push("Prioritize materials with low embodied carbon");
    suggestions.push("Source locally manufactured materials where possible to reduce transport emissions");
  }
  
  // Transport-related suggestions
  if (transport.length > 0) {
    const longDistance = transport.some(t => t.distance > 500);
    if (longDistance) {
      suggestions.push("Priority: Consolidate shipments to reduce number of deliveries");
      suggestions.push("Consider rail freight for long-distance material transport");
    }
    
    suggestions.push("Optimize delivery routes to minimize travel distances");
    suggestions.push("Use electric or hybrid vehicles for material transport where feasible");
    suggestions.push("Implement a just-in-time delivery system to reduce unnecessary trips");
  }
  
  // Energy-related suggestions
  if (energy.length > 0) {
    const highEnergyUse = energy.some(e => e.quantity > 1000);
    if (highEnergyUse) {
      suggestions.push("Priority: Implement on-site renewable energy generation");
      suggestions.push("Use energy-efficient equipment and machinery on construction sites");
    }
    
    suggestions.push("Switch to LED lighting for construction sites");
    suggestions.push("Use smart meters to monitor and manage energy usage");
    suggestions.push("Consider battery storage systems to optimize renewable energy use");
  }
  
  // General suggestions to ensure we have enough
  if (suggestions.length < 10) {
    suggestions.push("Implement a comprehensive waste management plan focusing on reduction and recycling");
    suggestions.push("Train staff on sustainability best practices and energy-efficient operations");
    suggestions.push("Consider pursuing green building certification (e.g., Green Star, NABERS)");
    suggestions.push("Design buildings for disassembly to facilitate future material reuse");
    suggestions.push("Install water-efficient fixtures to reduce water consumption");
    suggestions.push("Incorporate passive design principles to reduce operational energy needs");
    suggestions.push("Use low-VOC paints and finishes to improve indoor air quality");
    suggestions.push("Implement a sustainable procurement policy for all materials and services");
  }
  
  return suggestions;
}

// Generate a basic sustainability report
export function generateBasicSustainabilityReport(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): SustainabilityReport {
  const suggestions = generateSustainabilitySuggestions(materials, transport, energy);
  
  // Identify priority suggestions
  const prioritySuggestions = suggestions.filter(s => s.startsWith("Priority:"));
  
  // Generate score
  const score = calculateSustainabilityScore(materials, transport, energy);
  
  return {
    generatedAt: new Date().toISOString(),
    format: ReportFormat.BASIC,
    suggestions,
    prioritySuggestions,
    score
  };
}

// Generate a detailed sustainability report with more comprehensive analysis
export function generateDetailedSustainabilityReport(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[],
  options: ReportRequestOptions
): SustainabilityReport {
  // Start with a basic report
  const basicReport = generateBasicSustainabilityReport(materials, transport, energy);
  
  // Generate material recommendations
  const materialRecommendations = generateMaterialRecommendations(materials);
  
  // Generate transport recommendations
  const transportRecommendations = generateTransportRecommendations(transport);
  
  // Generate energy recommendations
  const energyRecommendations = generateEnergyRecommendations(energy);
  
  // Create the detailed report
  const detailedReport: SustainabilityReport = {
    ...basicReport,
    format: ReportFormat.DETAILED,
    materialRecommendations,
    transportRecommendations,
    energyRecommendations
  };
  
  // Add lifecycle analysis if requested
  if (options.includeLifecycleAnalysis) {
    detailedReport.lifeCycleAnalysis = generateLifecycleAnalysis(materials, transport, energy);
  }
  
  // Add implementation roadmap if requested
  if (options.includeImplementationRoadmap) {
    detailedReport.implementationRoadmap = generateImplementationRoadmap(
      materialRecommendations,
      transportRecommendations,
      energyRecommendations
    );
  }
  
  return detailedReport;
}
