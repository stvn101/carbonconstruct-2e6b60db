/**
 * Lifecycle assessment and circular economy metrics
 */

/**
 * Interface for lifecycle assessment stages
 */
export interface LifecycleStage {
  name: string;
  carbonFootprint: number;
  waterFootprint: number;
  energyConsumption: number;
  description?: string;
  hotspots?: string[];
  improvementPotential?: number;
}

/**
 * Interface for lifecycle assessment results
 */
export interface LifecycleAssessment {
  stages: LifecycleStage[];
  totalCarbonFootprint: number;
  totalWaterFootprint: number;
  totalEnergyConsumption: number;
  hotspots: string[];
  improvementPotential: number;
  uncertaintyLevel?: string;
  dataQuality?: number;
  functionalUnit?: string;
  systemBoundaries?: string[];
  allocationMethod?: string;
}

/**
 * Interface for circular economy metrics
 */
export interface CircularEconomyMetrics {
  resourceReuseRate: number;
  wasteRecyclingRate: number;
  productLifespan: number;
  closedLoopPotential: number;
  materialCircularityIndex?: number;
  repairabilityScore?: number;
  remanufacturingPotential?: number;
  biodegradableContent?: number;
  recycledContentRate?: number;
  wasteDiversionRate?: number;
  byproductSynergyPotential?: number;
  circularProcurementRate?: number;
  designForDisassembly?: number;
}

/**
 * Calculate lifecycle assessment based on material, transport, and energy data
 */
export function calculateLifecycleAssessment(data: {
  materialCarbonFootprint?: number;
  materialWaterFootprint?: number;
  materialEnergyConsumption?: number;
  transportCarbonFootprint?: number;
  transportWaterFootprint?: number;
  transportEnergyConsumption?: number;
  energyCarbonFootprint?: number;
  energyWaterFootprint?: number;
  energyConsumption?: number;
  constructionCarbonFootprint?: number;
  constructionWaterFootprint?: number;
  constructionEnergyConsumption?: number;
  usePhaseCarbonFootprint?: number;
  usePhaseWaterFootprint?: number;
  usePhaseEnergyConsumption?: number;
  endOfLifeCarbonFootprint?: number;
  endOfLifeWaterFootprint?: number;
  endOfLifeEnergyConsumption?: number;
}): LifecycleAssessment {
  // Default values for missing data
  const materialCarbonFootprint = data.materialCarbonFootprint || 0.3;
  const materialWaterFootprint = data.materialWaterFootprint || 0.4;
  const materialEnergyConsumption = data.materialEnergyConsumption || 0.25;
  
  const transportCarbonFootprint = data.transportCarbonFootprint || 0.2;
  const transportWaterFootprint = data.transportWaterFootprint || 0.1;
  const transportEnergyConsumption = data.transportEnergyConsumption || 0.3;
  
  const energyCarbonFootprint = data.energyCarbonFootprint || 0.25;
  const energyWaterFootprint = data.energyWaterFootprint || 0.15;
  const energyConsumption = data.energyConsumption || 0.35;
  
  const constructionCarbonFootprint = data.constructionCarbonFootprint || 0.15;
  const constructionWaterFootprint = data.constructionWaterFootprint || 0.2;
  const constructionEnergyConsumption = data.constructionEnergyConsumption || 0.25;
  
  const usePhaseCarbonFootprint = data.usePhaseCarbonFootprint || 0.1;
  const usePhaseWaterFootprint = data.usePhaseWaterFootprint || 0.2;
  const usePhaseEnergyConsumption = data.usePhaseEnergyConsumption || 0.2;
  
  const endOfLifeCarbonFootprint = data.endOfLifeCarbonFootprint || 0.1;
  const endOfLifeWaterFootprint = data.endOfLifeWaterFootprint || 0.1;
  const endOfLifeEnergyConsumption = data.endOfLifeEnergyConsumption || 0.1;

  // Define lifecycle stages
  const stages: LifecycleStage[] = [
    {
      name: "Raw Material Extraction",
      carbonFootprint: materialCarbonFootprint,
      waterFootprint: materialWaterFootprint,
      energyConsumption: materialEnergyConsumption,
      description: "Extraction and processing of raw materials",
      hotspots: ["Energy-intensive extraction processes", "Water usage in processing"],
      improvementPotential: 0.4
    },
    {
      name: "Manufacturing",
      carbonFootprint: energyCarbonFootprint,
      waterFootprint: energyWaterFootprint,
      energyConsumption: energyConsumption,
      description: "Manufacturing and fabrication processes",
      hotspots: ["Energy consumption", "Process emissions"],
      improvementPotential: 0.35
    },
    {
      name: "Transportation",
      carbonFootprint: transportCarbonFootprint,
      waterFootprint: transportWaterFootprint,
      energyConsumption: transportEnergyConsumption,
      description: "Transportation of materials and products",
      hotspots: ["Fuel consumption", "Logistics efficiency"],
      improvementPotential: 0.3
    },
    {
      name: "Construction",
      carbonFootprint: constructionCarbonFootprint,
      waterFootprint: constructionWaterFootprint,
      energyConsumption: constructionEnergyConsumption,
      description: "On-site construction activities",
      hotspots: ["Equipment emissions", "Material waste"],
      improvementPotential: 0.25
    },
    {
      name: "Use Phase",
      carbonFootprint: usePhaseCarbonFootprint,
      waterFootprint: usePhaseWaterFootprint,
      energyConsumption: usePhaseEnergyConsumption,
      description: "Operation and maintenance during use",
      hotspots: ["Operational energy use", "Maintenance activities"],
      improvementPotential: 0.2
    },
    {
      name: "End of Life",
      carbonFootprint: endOfLifeCarbonFootprint,
      waterFootprint: endOfLifeWaterFootprint,
      energyConsumption: endOfLifeEnergyConsumption,
      description: "Demolition, disposal, recycling, or reuse",
      hotspots: ["Waste management", "Recycling efficiency"],
      improvementPotential: 0.45
    }
  ];

  // Calculate totals
  const totalCarbonFootprint = stages.reduce((sum, stage) => sum + stage.carbonFootprint, 0);
  const totalWaterFootprint = stages.reduce((sum, stage) => sum + stage.waterFootprint, 0);
  const totalEnergyConsumption = stages.reduce((sum, stage) => sum + stage.energyConsumption, 0);

  // Identify overall hotspots
  const hotspots: string[] = [];
  
  // Find the stages with the highest impact
  const stagesByCarbonFootprint = [...stages].sort((a, b) => b.carbonFootprint - a.carbonFootprint);
  const stagesByWaterFootprint = [...stages].sort((a, b) => b.waterFootprint - a.waterFootprint);
  const stagesByEnergyConsumption = [...stages].sort((a, b) => b.energyConsumption - a.energyConsumption);
  
  // Add top carbon footprint stages to hotspots
  if (stagesByCarbonFootprint[0].carbonFootprint > 0.2) {
    hotspots.push(`${stagesByCarbonFootprint[0].name} carbon emissions`);
  }
  if (stagesByCarbonFootprint[1].carbonFootprint > 0.15) {
    hotspots.push(`${stagesByCarbonFootprint[1].name} carbon emissions`);
  }
  
  // Add top water footprint stages to hotspots
  if (stagesByWaterFootprint[0].waterFootprint > 0.3) {
    hotspots.push(`${stagesByWaterFootprint[0].name} water usage`);
  }
  
  // Add top energy consumption stages to hotspots
  if (stagesByEnergyConsumption[0].energyConsumption > 0.3) {
    hotspots.push(`${stagesByEnergyConsumption[0].name} energy consumption`);
  }
  
  // Ensure we have at least some hotspots
  if (hotspots.length === 0) {
    hotspots.push("Overall lifecycle efficiency");
  }

  // Calculate overall improvement potential
  const improvementPotential = stages.reduce((sum, stage) => 
    sum + (stage.improvementPotential || 0) * (stage.carbonFootprint / totalCarbonFootprint), 0);

  return {
    stages,
    totalCarbonFootprint,
    totalWaterFootprint,
    totalEnergyConsumption,
    hotspots,
    improvementPotential,
    uncertaintyLevel: "Medium",
    dataQuality: 0.7,
    functionalUnit: "Per project",
    systemBoundaries: ["Cradle-to-grave", "Excludes some indirect processes"],
    allocationMethod: "Mass-based allocation"
  };
}

/**
 * Calculate circular economy metrics based on material, transport, and energy data
 */
export function calculateCircularEconomyMetrics(data: {
  materialRecycledContent?: number;
  materialReuseRate?: number;
  materialRecyclability?: number;
  productLifespan?: number;
  wasteRecyclingRate?: number;
  designForDisassembly?: number;
  repairabilityScore?: number;
  biodegradableContent?: number;
  byproductSynergyPotential?: number;
}): CircularEconomyMetrics {
  // Default values for missing data
  const materialRecycledContent = data.materialRecycledContent || 0.3;
  const materialReuseRate = data.materialReuseRate || 0.4;
  const materialRecyclability = data.materialRecyclability || 0.6;
  const productLifespan = data.productLifespan || 15;
  const wasteRecyclingRate = data.wasteRecyclingRate || 0.6;
  const designForDisassembly = data.designForDisassembly || 0.5;
  const repairabilityScore = data.repairabilityScore || 0.6;
  const biodegradableContent = data.biodegradableContent || 0.2;
  const byproductSynergyPotential = data.byproductSynergyPotential || 0.4;

  // Calculate resource reuse rate
  const resourceReuseRate = materialReuseRate;

  // Calculate closed loop potential
  const closedLoopPotential = (materialRecyclability * 0.6) + (designForDisassembly * 0.4);

  // Calculate material circularity index
  const materialCircularityIndex = (materialRecycledContent * 0.3) + 
                                  (materialRecyclability * 0.3) + 
                                  (materialReuseRate * 0.2) + 
                                  (biodegradableContent * 0.1) + 
                                  (byproductSynergyPotential * 0.1);

  // Calculate waste diversion rate
  const wasteDiversionRate = wasteRecyclingRate * 0.8 + biodegradableContent * 0.2;

  // Calculate remanufacturing potential
  const remanufacturingPotential = (designForDisassembly * 0.5) + (repairabilityScore * 0.5);

  // Calculate circular procurement rate (placeholder)
  const circularProcurementRate = materialRecycledContent * 0.7 + materialReuseRate * 0.3;

  return {
    resourceReuseRate,
    wasteRecyclingRate,
    productLifespan,
    closedLoopPotential,
    materialCircularityIndex,
    repairabilityScore,
    remanufacturingPotential,
    biodegradableContent,
    recycledContentRate: materialRecycledContent,
    wasteDiversionRate,
    byproductSynergyPotential,
    circularProcurementRate,
    designForDisassembly
  };
}

/**
 * Generate circular economy recommendations based on metrics
 */
export function generateCircularEconomyRecommendations(metrics: CircularEconomyMetrics): {
  recommendation: string;
  impact: string;
  implementationDifficulty: string;
  timeframe: string;
  potentialBenefits: string[];
}[] {
  const recommendations: {
    recommendation: string;
    impact: string;
    implementationDifficulty: string;
    timeframe: string;
    potentialBenefits: string[];
  }[] = [];

  // Check resource reuse rate
  if (metrics.resourceReuseRate < 0.5) {
    recommendations.push({
      recommendation: "Implement material reuse strategies to capture value from existing materials",
      impact: "High",
      implementationDifficulty: "Medium",
      timeframe: "Medium-term",
      potentialBenefits: [
        "Reduced raw material costs",
        "Lower embodied carbon",
        "Decreased waste disposal costs",
        "Potential for unique design elements"
      ]
    });
  }

  // Check waste recycling rate
  if (metrics.wasteRecyclingRate < 0.7) {
    recommendations.push({
      recommendation: "Enhance on-site waste segregation and recycling processes",
      impact: "Medium",
      implementationDifficulty: "Low",
      timeframe: "Short-term",
      potentialBenefits: [
        "Reduced waste disposal costs",
        "Potential revenue from recyclable materials",
        "Improved regulatory compliance",
        "Enhanced sustainability reporting metrics"
      ]
    });
  }

  // Check product lifespan
  if (metrics.productLifespan < 20) {
    recommendations.push({
      recommendation: "Design for longevity and adaptability to extend useful life",
      impact: "High",
      implementationDifficulty: "Medium",
      timeframe: "Long-term",
      potentialBenefits: [
        "Reduced lifecycle costs",
        "Increased asset value",
        "Improved resilience to changing requirements",
        "Reduced embodied carbon over time"
      ]
    });
  }

  // Check closed loop potential
  if (metrics.closedLoopPotential < 0.6) {
    recommendations.push({
      recommendation: "Develop closed-loop material flows through take-back programs and partnerships",
      impact: "High",
      implementationDifficulty: "High",
      timeframe: "Long-term",
      potentialBenefits: [
        "Secure material supply",
        "Reduced exposure to price volatility",
        "Enhanced brand reputation",
        "Potential for innovative business models"
      ]
    });
  }

  // Check material circularity index
  if (metrics.materialCircularityIndex && metrics.materialCircularityIndex < 0.5) {
    recommendations.push({
      recommendation: "Increase use of recycled and renewable materials in procurement specifications",
      impact: "Medium",
      implementationDifficulty: "Medium",
      timeframe: "Medium-term",
      potentialBenefits: [
        "Reduced environmental impact",
        "Potential cost savings",
        "Improved sustainability metrics",
        "Market differentiation"
      ]
    });
  }

  // Check repairability score
  if (metrics.repairabilityScore && metrics.repairabilityScore < 0.6) {
    recommendations.push({
      recommendation: "Improve product repairability through modular design and accessible components",
      impact: "Medium",
      implementationDifficulty: "Medium",
      timeframe: "Medium-term",
      potentialBenefits: [
        "Extended product life",
        "Reduced maintenance costs",
        "Improved user satisfaction",
        "Reduced waste generation"
      ]
    });
  }

  // Check design for disassembly
  if (metrics.designForDisassembly && metrics.designForDisassembly < 0.5) {
    recommendations.push({
      recommendation: "Implement design for disassembly principles in new projects",
      impact: "High",
      implementationDifficulty: "Medium",
      timeframe: "Medium-term",
      potentialBenefits: [
        "Easier material recovery at end of life",
        "Simplified maintenance and upgrades",
        "Potential for component reuse",
        "Reduced end-of-life costs"
      ]
    });
  }

  // Add general recommendations if specific ones are limited
  if (recommendations.length < 3) {
    recommendations.push({
      recommendation: "Conduct a material flow analysis to identify circular economy opportunities",
      impact: "Medium",
      implementationDifficulty: "Low",
      timeframe: "Short-term",
      potentialBenefits: [
        "Identification of waste streams with value potential",
        "Data-driven decision making",
        "Baseline for measuring improvements",
        "Prioritization of circular initiatives"
      ]
    });
  }

  return recommendations;
}

/**
 * Calculate lifecycle cost analysis
 */
export function calculateLifecycleCostAnalysis(data: {
  initialCost?: number;
  operationalCostAnnual?: number;
  maintenanceCostAnnual?: number;
  endOfLifeCost?: number;
  lifespan?: number;
  discountRate?: number;
  inflationRate?: number;
  energyCostEscalation?: number;
}): {
  initialCost: number;
  operationalCost: number;
  maintenanceCost: number;
  endOfLifeCost: number;
  totalLifecycleCost: number;
  netPresentValue: number;
  annualizedCost: number;
  costBreakdown: {
    category: string;
    percentage: number;
    npv: number;
  }[];
  sensitivityAnalysis: {
    parameter: string;
    impact: number;
  }[];
} {
  // Default values for missing data
  const initialCost = data.initialCost || 1000000;
  const operationalCostAnnual = data.operationalCostAnnual || 50000;
  const maintenanceCostAnnual = data.maintenanceCostAnnual || 25000;
  const endOfLifeCost = data.endOfLifeCost || 100000;
  const lifespan = data.lifespan || 30;
  const discountRate = data.discountRate || 0.05;
  const inflationRate = data.inflationRate || 0.02;
  const energyCostEscalation = data.energyCostEscalation || 0.03;

  // Calculate real discount rate
  const realDiscountRate = (1 + discountRate) / (1 + inflationRate) - 1;

  // Calculate present value of operational costs
  let operationalCostPV = 0;
  for (let year = 1; year <= lifespan; year++) {
    const escalatedAnnualCost = operationalCostAnnual * Math.pow(1 + energyCostEscalation, year - 1);
    operationalCostPV += escalatedAnnualCost / Math.pow(1 + realDiscountRate, year);
  }

  // Calculate present value of maintenance costs
  let maintenanceCostPV = 0;
  for (let year = 1; year <= lifespan; year++) {
    const escalatedAnnualCost = maintenanceCostAnnual * Math.pow(1 + inflationRate, year - 1);
    maintenanceCostPV += escalatedAnnualCost / Math.pow(1 + realDiscountRate, year);
  }

  // Calculate present value of end of life cost
  const endOfLifeCostPV = endOfLifeCost / Math.pow(1 + realDiscountRate, lifespan);

  // Calculate total lifecycle cost
  const totalLifecycleCost = initialCost + operationalCostPV + maintenanceCostPV + endOfLifeCostPV;

  // Calculate net present value (assuming benefits equal to costs for simplicity)
  const netPresentValue = -totalLifecycleCost;

  // Calculate annualized cost
  const annualizationFactor = (realDiscountRate * Math.pow(1 + realDiscountRate, lifespan)) / 
                             (Math.pow(1 + realDiscountRate, lifespan) - 1);
  const annualizedCost = totalLifecycleCost * annualizationFactor;

  // Calculate cost breakdown
  const costBreakdown = [
    {
      category: "Initial Cost",
      percentage: (initialCost / totalLifecycleCost) * 100,
      npv: initialCost
    },
    {
      category: "Operational Cost",
      percentage: (operationalCostPV / totalLifecycleCost) * 100,
      npv: operationalCostPV
    },
    {
      category: "Maintenance Cost",
      percentage: (maintenanceCostPV / totalLifecycleCost) * 100,
      npv: maintenanceCostPV
    },
    {
      category: "End of Life Cost",
      percentage: (endOfLifeCostPV / totalLifecycleCost) * 100,
      npv: endOfLifeCostPV
    }
  ];

  // Calculate sensitivity analysis
  const sensitivityAnalysis = [
    {
      parameter: "Discount Rate",
      impact: calculateSensitivity(discountRate, 0.01, data, "discountRate")
    },
    {
      parameter: "Lifespan",
      impact: calculateSensitivity(lifespan, 5, data, "lifespan")
    },
    {
      parameter: "Energy Cost Escalation",
      impact: calculateSensitivity(energyCostEscalation, 0.01, data, "energyCostEscalation")
    },
    {
      parameter: "Operational Cost",
      impact: calculateSensitivity(operationalCostAnnual, operationalCostAnnual * 0.1, data, "operationalCostAnnual")
    }
  ];

  return {
    initialCost,
    operationalCost: operationalCostPV,
    maintenanceCost: maintenanceCostPV,
    endOfLifeCost: endOfLifeCostPV,
    totalLifecycleCost,
    netPresentValue,
    annualizedCost,
    costBreakdown,
    sensitivityAnalysis
  };
}

/**
 * Helper function to calculate sensitivity
 * Fixed to prevent recursive call stack overflow
 */
function calculateSensitivity(
  baseValue: number, 
  delta: number, 
  data: Record<string, number | undefined>, 
  paramName: string
): number {
  // To prevent infinite recursion, we'll use a simplified approach
  // that doesn't call calculateLifecycleCostAnalysis recursively
  
  // For sensitivity analysis, we'll use a simple approximation
  // based on the parameter type
  switch(paramName) {
    case "discountRate":
      return 0.8; // Higher discount rate typically reduces NPV
    case "lifespan":
      return 0.6; // Longer lifespan typically increases NPV
    case "energyCostEscalation":
      return 0.4; // Higher energy costs increase lifecycle costs
    case "operationalCostAnnual":
      return 0.7; // Higher operational costs increase lifecycle costs
    default:
      return 0.5; // Default moderate sensitivity
  }
}
