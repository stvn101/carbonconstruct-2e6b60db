
import { Material } from "./Material.ts";
import { TransportItem } from "./Transport.ts";
import { EnergyItem } from "./Energy.ts";
import { 
  ReportFormat, 
  ReportRequestOptions, 
  SustainabilityReport, 
  MaterialRecommendation, 
  TransportRecommendation, 
  EnergyRecommendation 
} from "./Report.ts";

// Calculate data completeness to determine if we have enough information for a good report
export function calculateDataCompleteness(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): number {
  let score = 0;
  
  // Material data quality
  if (materials.length > 0) {
    score += 30; // Base score for having materials
    
    // Add points for comprehensive material data
    const materialsWithFullData = materials.filter(
      m => m.recycledContent !== undefined && m.locallySourced !== undefined && m.quantity !== undefined
    ).length;
    
    score += Math.min(20, (materialsWithFullData / Math.max(1, materials.length)) * 20);
  }
  
  // Transport data quality
  if (transport.length > 0) {
    score += 20; // Base score for having transport data
    
    // Add points for comprehensive transport data
    const detailedTransport = transport.filter(
      t => t.distance > 0 && t.weight > 0 && t.emissionsFactor > 0
    ).length;
    
    score += Math.min(15, (detailedTransport / Math.max(1, transport.length)) * 15);
  }
  
  // Energy data quality
  if (energy.length > 0) {
    score += 10; // Base score for having energy data
    
    // Add points for comprehensive energy data
    const detailedEnergy = energy.filter(
      e => e.quantity > 0 && e.emissionsFactor > 0
    ).length;
    
    score += Math.min(5, (detailedEnergy / Math.max(1, energy.length)) * 5);
  }
  
  return Math.min(100, score);
}

// Generate a basic sustainability report
export function generateBasicSustainabilityReport(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): SustainabilityReport {
  const suggestions: string[] = [];
  const prioritySuggestions: string[] = [];
  
  // Generate material-based suggestions
  if (materials.length > 0) {
    // Check for high-carbon materials
    const highCarbonMaterials = materials.filter(m => m.carbonFootprint > 2.0);
    if (highCarbonMaterials.length > 0) {
      prioritySuggestions.push(`Priority: Consider replacing high-carbon materials like ${highCarbonMaterials[0].name} with low-carbon alternatives`);
    }
    
    // Check for non-recyclable materials
    const nonRecyclableMaterials = materials.filter(m => !m.recyclable);
    if (nonRecyclableMaterials.length > 0) {
      suggestions.push("Use recyclable materials where possible to improve end-of-life sustainability");
    }
    
    // Check for local sourcing
    const nonLocalMaterials = materials.filter(m => m.locallySourced === false);
    if (nonLocalMaterials.length > 0) {
      suggestions.push("Source materials locally where possible to reduce transportation emissions");
    }
    
    suggestions.push("Consider materials with high recycled content to reduce embodied carbon");
  } else {
    suggestions.push("Add material information to receive specific material-based sustainability recommendations");
  }
  
  // Generate transport-based suggestions
  if (transport.length > 0) {
    // Check for long-distance transport
    const longDistanceTransport = transport.filter(t => t.distance > 1000);
    if (longDistanceTransport.length > 0) {
      prioritySuggestions.push("Priority: Reduce long-distance transportation by sourcing materials locally");
    }
    
    // Check for high-emission transport modes
    const highEmissionTransport = transport.filter(t => t.fuelType === 'diesel' || t.fuelType === 'petrol');
    if (highEmissionTransport.length > 0) {
      suggestions.push("Transition to electric or hybrid vehicles for material transport");
    }
    
    suggestions.push("Optimize delivery routes to minimize fuel consumption and emissions");
    suggestions.push("Consider rail or sea transport for long-distance material delivery where feasible");
  } else {
    suggestions.push("Add transportation information to receive specific transport-based sustainability recommendations");
  }
  
  // Generate energy-based suggestions
  if (energy.length > 0) {
    // Check for fossil fuel energy sources
    const fossilFuelEnergy = energy.filter(e => e.source === 'grid' || e.source === 'diesel_generator');
    if (fossilFuelEnergy.length > 0) {
      prioritySuggestions.push("Priority: Switch from fossil fuel energy sources to renewable alternatives on construction sites");
    }
    
    suggestions.push("Implement energy-efficient practices on construction sites");
    suggestions.push("Consider using battery storage with renewable energy to reduce reliance on diesel generators");
  } else {
    suggestions.push("Add energy usage information to receive specific energy-based sustainability recommendations");
  }
  
  // Add general sustainability suggestions
  suggestions.push("Develop a comprehensive waste management plan for the construction site");
  suggestions.push("Train staff on sustainability best practices to reduce resource waste");
  suggestions.push("Monitor and report on sustainability metrics throughout the project lifecycle");
  suggestions.push("Implement a sustainability management system aligned with ISO 14001");
  
  // Generate the report
  return {
    generatedAt: new Date().toISOString(),
    format: ReportFormat.BASIC,
    suggestions,
    prioritySuggestions,
    score: {
      overall: Math.round(calculateOverallScore(materials, transport, energy)),
      materials: materials.length > 0 ? Math.round(calculateMaterialsScore(materials)) : 0,
      transport: transport.length > 0 ? Math.round(calculateTransportScore(transport)) : 0,
      energy: energy.length > 0 ? Math.round(calculateEnergyScore(energy)) : 0
    }
  };
}

// Generate a detailed sustainability report with additional analysis
export function generateDetailedSustainabilityReport(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[],
  options: ReportRequestOptions
): SustainabilityReport {
  // Start with the basic report
  const baseReport = generateBasicSustainabilityReport(materials, transport, energy);
  
  // Add material recommendations
  const materialRecommendations = materials.length > 0 
    ? generateMaterialRecommendations(materials)
    : undefined;
  
  // Add transport recommendations
  const transportRecommendations = transport.length > 0
    ? generateTransportRecommendations(transport)
    : undefined;
  
  // Add energy recommendations
  const energyRecommendations = energy.length > 0
    ? generateEnergyRecommendations(energy)
    : undefined;
  
  // Add lifecycle analysis if requested
  const lifeCycleAnalysis = options.includeLifecycleAnalysis 
    ? generateLifecycleAnalysis(materials, transport, energy)
    : undefined;
  
  // Add implementation roadmap if requested
  const implementationRoadmap = options.includeImplementationRoadmap
    ? generateImplementationRoadmap(baseReport.suggestions, baseReport.prioritySuggestions || [])
    : undefined;
  
  // Check compliance status if requested
  const complianceStatus = options.includeComplianceDetails
    ? checkComplianceStatus(materials, transport, energy)
    : undefined;
  
  return {
    ...baseReport,
    format: ReportFormat.DETAILED,
    materialRecommendations,
    transportRecommendations,
    energyRecommendations,
    lifeCycleAnalysis,
    implementationRoadmap,
    complianceStatus
  };
}

// Helper function to calculate overall sustainability score
function calculateOverallScore(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): number {
  const materialsScore = materials.length > 0 ? calculateMaterialsScore(materials) : 0;
  const transportScore = transport.length > 0 ? calculateTransportScore(transport) : 0;
  const energyScore = energy.length > 0 ? calculateEnergyScore(energy) : 0;
  
  // Weight the scores based on typical impact ratios in construction
  const materialWeight = 0.6;
  const transportWeight = 0.2;
  const energyWeight = 0.2;
  
  // Calculate weighted scores
  let totalWeight = 0;
  let weightedScore = 0;
  
  if (materials.length > 0) {
    weightedScore += materialsScore * materialWeight;
    totalWeight += materialWeight;
  }
  
  if (transport.length > 0) {
    weightedScore += transportScore * transportWeight;
    totalWeight += transportWeight;
  }
  
  if (energy.length > 0) {
    weightedScore += energyScore * energyWeight;
    totalWeight += energyWeight;
  }
  
  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

// Helper function to calculate materials sustainability score
function calculateMaterialsScore(materials: Material[]): number {
  if (materials.length === 0) return 0;
  
  let score = 0;
  
  // Base score from carbon footprint
  // Assuming higher carbon footprint means lower score
  const totalCarbonFootprint = materials.reduce((sum, m) => {
    const quantity = m.quantity || 1;
    return sum + (m.carbonFootprint * quantity);
  }, 0);
  
  // Normalize to 0-100 scale (assuming 0.1 is excellent, 10 is poor kg CO2e per kg)
  const carbonScore = Math.max(0, 100 - (totalCarbonFootprint / materials.length / 0.1));
  
  // Bonus for recyclable materials
  const recyclablePercentage = materials.filter(m => m.recyclable).length / materials.length * 100;
  
  // Bonus for recycled content
  const avgRecycledContent = materials.reduce((sum, m) => sum + (m.recycledContent || 0), 0) / materials.length;
  
  // Bonus for locally sourced
  const locallySourcedPercentage = materials.filter(m => m.locallySourced).length / materials.length * 100;
  
  // Calculate final score with appropriate weights
  score = (carbonScore * 0.6) + (recyclablePercentage * 0.1) + (avgRecycledContent * 0.2) + (locallySourcedPercentage * 0.1);
  
  return Math.min(100, score);
}

// Helper function to calculate transport sustainability score
function calculateTransportScore(transport: TransportItem[]): number {
  if (transport.length === 0) return 0;
  
  let score = 0;
  
  // Calculate average emissions factor
  const avgEmissionsFactor = transport.reduce((sum, t) => sum + t.emissionsFactor, 0) / transport.length;
  
  // Calculate score based on emissions factor (lower is better)
  // Assuming 0.01 is excellent, 0.5 is poor kg CO2e per tonne-km
  const emissionsScore = Math.max(0, 100 - (avgEmissionsFactor / 0.01) * 20);
  
  // Calculate score based on fuel types
  const lowEmissionFuels = ['electric', 'biofuel', 'hybrid'];
  const lowEmissionPercentage = transport.filter(t => lowEmissionFuels.includes(t.fuelType)).length / transport.length * 100;
  
  // Calculate score based on transport types
  const sustainableModes = ['rail', 'sea'];
  const sustainableModesPercentage = transport.filter(t => sustainableModes.includes(t.type)).length / transport.length * 100;
  
  // Calculate final score with weights
  score = (emissionsScore * 0.5) + (lowEmissionPercentage * 0.3) + (sustainableModesPercentage * 0.2);
  
  return Math.min(100, score);
}

// Helper function to calculate energy sustainability score
function calculateEnergyScore(energy: EnergyItem[]): number {
  if (energy.length === 0) return 0;
  
  let score = 0;
  
  // Calculate average emissions factor
  const avgEmissionsFactor = energy.reduce((sum, e) => sum + e.emissionsFactor, 0) / energy.length;
  
  // Calculate score based on emissions factor (lower is better)
  // Assuming 0.05 is excellent, 1.0 is poor kg CO2e per kWh
  const emissionsScore = Math.max(0, 100 - (avgEmissionsFactor / 0.05) * 10);
  
  // Calculate score based on energy sources
  const renewableSources = ['solar', 'wind', 'hydrogen'];
  const renewablePercentage = energy.filter(e => renewableSources.includes(e.source)).length / energy.length * 100;
  
  // Calculate final score with weights
  score = (emissionsScore * 0.6) + (renewablePercentage * 0.4);
  
  return Math.min(100, score);
}

// Helper function to generate material recommendations
function generateMaterialRecommendations(materials: Material[]): MaterialRecommendation[] {
  const recommendations: MaterialRecommendation[] = [];
  
  for (const material of materials) {
    // Skip materials with good sustainability profile
    if (material.carbonFootprint < 0.5 && material.recyclable) continue;
    
    // Generate recommendation based on material category
    if (material.category === MaterialCategory.CONCRETE) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: "Low-Carbon Concrete",
        carbonReduction: 30,
        costImpact: 5,
        availability: 'high',
        additionalBenefits: ["Improved durability", "Reduced water consumption"]
      });
    } else if (material.category === MaterialCategory.STEEL) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: "Recycled Steel",
        carbonReduction: 40,
        costImpact: -2,
        availability: 'high',
        additionalBenefits: ["Reduced mining impact", "Lower energy requirements"]
      });
    } else if (material.category === MaterialCategory.TIMBER && !material.locallySourced) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: "Locally Sourced Certified Timber",
        carbonReduction: 25,
        costImpact: 0,
        availability: 'medium',
        additionalBenefits: ["Supports local economy", "Reduced transportation emissions"]
      });
    } else if (material.category === MaterialCategory.INSULATION) {
      recommendations.push({
        originalMaterial: material.name,
        recommendedAlternative: "Bio-based Insulation",
        carbonReduction: 45,
        costImpact: 10,
        availability: 'medium',
        additionalBenefits: ["Non-toxic", "Better indoor air quality"]
      });
    }
  }
  
  return recommendations;
}

// Helper function to generate transport recommendations
function generateTransportRecommendations(transport: TransportItem[]): TransportRecommendation[] {
  const recommendations: TransportRecommendation[] = [];
  
  for (const item of transport) {
    if (item.type === TransportType.ROAD && item.distance > 500) {
      recommendations.push({
        currentMode: `${item.fuelType} ${item.type}`,
        recommendedMode: "Rail transport",
        distance: item.distance,
        carbonReduction: 70,
        costImpact: -5,
        feasibility: 'medium'
      });
    } else if (item.type === TransportType.ROAD && item.fuelType === FuelType.DIESEL) {
      recommendations.push({
        currentMode: `${item.fuelType} ${item.type}`,
        recommendedMode: "Electric or hybrid vehicles",
        distance: item.distance,
        carbonReduction: 40,
        costImpact: 15,
        feasibility: 'high'
      });
    } else if (item.type === TransportType.AIR) {
      recommendations.push({
        currentMode: `${item.fuelType} ${item.type}`,
        recommendedMode: "Sea freight",
        distance: item.distance,
        carbonReduction: 85,
        costImpact: -20,
        feasibility: 'medium'
      });
    }
  }
  
  return recommendations;
}

// Helper function to generate energy recommendations
function generateEnergyRecommendations(energy: EnergyItem[]): EnergyRecommendation[] {
  const recommendations: EnergyRecommendation[] = [];
  
  for (const item of energy) {
    if (item.source === EnergySource.DIESEL_GENERATOR) {
      recommendations.push({
        currentSource: "Diesel generator",
        recommendedSource: "Solar + battery storage",
        carbonReduction: 90,
        costImpact: 20,
        implementationComplexity: 'medium'
      });
    } else if (item.source === EnergySource.GRID) {
      recommendations.push({
        currentSource: "Grid electricity",
        recommendedSource: "100% renewable energy tariff",
        carbonReduction: 60,
        costImpact: 5,
        implementationComplexity: 'low'
      });
    }
  }
  
  return recommendations;
}

// Helper function to check compliance status with standards
function checkComplianceStatus(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): { ncc2025: boolean; nabers: string; issues?: string[] } {
  // This is a simplified compliance check
  // In a real system, this would be much more detailed and accurate
  
  const issues: string[] = [];
  let nccCompliant = true;
  let nabersRating = "0-star";
  
  // Check materials for NCC compliance
  const nonCompliantMaterials = materials.filter(m => {
    // Simplified check - in reality would check against specific NCC requirements
    return m.carbonFootprint > 5.0;
  });
  
  if (nonCompliantMaterials.length > 0) {
    nccCompliant = false;
    issues.push(`Materials like ${nonCompliantMaterials[0].name} exceed carbon footprint limits for NCC 2025`);
  }
  
  // Check energy efficiency for NABERS rating
  const avgEnergyScore = calculateEnergyScore(energy);
  
  if (avgEnergyScore > 90) {
    nabersRating = "6-star";
  } else if (avgEnergyScore > 80) {
    nabersRating = "5-star";
  } else if (avgEnergyScore > 70) {
    nabersRating = "4-star";
  } else if (avgEnergyScore > 60) {
    nabersRating = "3-star";
  } else if (avgEnergyScore > 50) {
    nabersRating = "2-star";
  } else if (avgEnergyScore > 30) {
    nabersRating = "1-star";
  }
  
  return {
    ncc2025: nccCompliant,
    nabers: nabersRating,
    issues: issues.length > 0 ? issues : undefined
  };
}

// Helper function to generate lifecycle analysis
function generateLifecycleAnalysis(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): LifecycleAnalysis {
  // In a real system, this would be much more detailed and accurate
  // This is a simplified example
  
  return {
    stages: {
      extraction: 25,
      manufacturing: 30,
      transportation: 10,
      construction: 5,
      operation: 20,
      endOfLife: 10
    },
    totalLifecycleEmissions: calculateTotalLifecycleEmissions(materials, transport, energy),
    recommendations: [
      "Focus on reducing embodied carbon in materials as they represent the largest share of emissions",
      "Implement circular economy principles to minimize waste and maximize reuse",
      "Design for deconstruction to enable material recovery at end-of-life",
      "Consider operational energy efficiency throughout the building lifecycle"
    ]
  };
}

// Helper function to calculate total lifecycle emissions
function calculateTotalLifecycleEmissions(
  materials: Material[], 
  transport: TransportItem[], 
  energy: EnergyItem[]
): number {
  let total = 0;
  
  // Material emissions
  total += materials.reduce((sum, m) => {
    const quantity = m.quantity || 1;
    return sum + (m.carbonFootprint * quantity);
  }, 0);
  
  // Transport emissions
  total += transport.reduce((sum, t) => {
    return sum + (t.emissionsFactor * t.distance * t.weight);
  }, 0);
  
  // Energy emissions
  total += energy.reduce((sum, e) => {
    return sum + (e.emissionsFactor * e.quantity);
  }, 0);
  
  // Multiply by a factor to account for full lifecycle (simplified)
  return total * 1.8;
}

// Helper function to generate implementation roadmap
function generateImplementationRoadmap(
  suggestions: string[], 
  prioritySuggestions: string[]
): ImplementationStep[] {
  const roadmap: ImplementationStep[] = [];
  
  // Immediate actions (from priority suggestions)
  roadmap.push({
    phase: 'immediate',
    actions: prioritySuggestions.map(s => s.replace('Priority: ', '')),
    estimatedTimeframe: "1-4 weeks",
    estimatedCostRange: "Low to Medium",
    estimatedCarbonSavings: 500
  });
  
  // Short-term actions
  roadmap.push({
    phase: 'short-term',
    actions: suggestions.slice(0, 3),
    estimatedTimeframe: "1-3 months",
    estimatedCostRange: "Medium",
    estimatedCarbonSavings: 1200
  });
  
  // Medium-term actions
  roadmap.push({
    phase: 'medium-term',
    actions: suggestions.slice(3, 6),
    estimatedTimeframe: "3-12 months",
    estimatedCostRange: "Medium to High",
    estimatedCarbonSavings: 2500
  });
  
  // Long-term actions
  roadmap.push({
    phase: 'long-term',
    actions: suggestions.slice(6),
    estimatedTimeframe: "1-3 years",
    estimatedCostRange: "High",
    estimatedCarbonSavings: 5000
  });
  
  return roadmap;
}
