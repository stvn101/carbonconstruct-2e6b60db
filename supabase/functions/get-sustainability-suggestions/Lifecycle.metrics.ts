/**
 * Lifecycle assessment and circular economy metrics
 * 
 * This module provides functions for calculating lifecycle assessments,
 * circular economy metrics, and lifecycle cost analysis for sustainability reporting.
 */

// Import types from interfaces
import type { ImpactLevel as _ImpactLevel, Timeframe as _Timeframe } from 'interfaces/report';

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
 * Helper function to set default values for lifecycle assessment data
 */
function setLifecycleDefaultValues(data: {
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
}): Record<string, number> {
  return {
    materialCarbonFootprint: data.materialCarbonFootprint || 0.3,
    materialWaterFootprint: data.materialWaterFootprint || 0.4,
    materialEnergyConsumption: data.materialEnergyConsumption || 0.25,
    
    transportCarbonFootprint: data.transportCarbonFootprint || 0.2,
    transportWaterFootprint: data.transportWaterFootprint || 0.1,
    transportEnergyConsumption: data.transportEnergyConsumption || 0.3,
    
    energyCarbonFootprint: data.energyCarbonFootprint || 0.25,
    energyWaterFootprint: data.energyWaterFootprint || 0.15,
    energyConsumption: data.energyConsumption || 0.35,
    
    constructionCarbonFootprint: data.constructionCarbonFootprint || 0.15,
    constructionWaterFootprint: data.constructionWaterFootprint || 0.2,
    constructionEnergyConsumption: data.constructionEnergyConsumption || 0.25,
    
    usePhaseCarbonFootprint: data.usePhaseCarbonFootprint || 0.1,
    usePhaseWaterFootprint: data.usePhaseWaterFootprint || 0.2,
    usePhaseEnergyConsumption: data.usePhaseEnergyConsumption || 0.2,
    
    endOfLifeCarbonFootprint: data.endOfLifeCarbonFootprint || 0.1,
    endOfLifeWaterFootprint: data.endOfLifeWaterFootprint || 0.1,
    endOfLifeEnergyConsumption: data.endOfLifeEnergyConsumption || 0.1
  };
}

/**
 * Helper function to define lifecycle stages based on input values
 */
function defineLifecycleStages(values: Record<string, number>): LifecycleStage[] {
  return [
    {
      name: "Raw Material Extraction",
      carbonFootprint: values.materialCarbonFootprint,
      waterFootprint: values.materialWaterFootprint,
      energyConsumption: values.materialEnergyConsumption,
      description: "Extraction and processing of raw materials",
      hotspots: ["Energy-intensive extraction processes", "Water usage in processing"],
      improvementPotential: 0.4
    },
    {
      name: "Manufacturing",
      carbonFootprint: values.energyCarbonFootprint,
      waterFootprint: values.energyWaterFootprint,
      energyConsumption: values.energyConsumption,
      description: "Manufacturing and fabrication processes",
      hotspots: ["Energy consumption", "Process emissions"],
      improvementPotential: 0.35
    },
    {
      name: "Transportation",
      carbonFootprint: values.transportCarbonFootprint,
      waterFootprint: values.transportWaterFootprint,
      energyConsumption: values.transportEnergyConsumption,
      description: "Transportation of materials and products",
      hotspots: ["Fuel consumption", "Logistics efficiency"],
      improvementPotential: 0.3
    },
    {
      name: "Construction",
      carbonFootprint: values.constructionCarbonFootprint,
      waterFootprint: values.constructionWaterFootprint,
      energyConsumption: values.constructionEnergyConsumption,
      description: "On-site construction activities",
      hotspots: ["Equipment emissions", "Material waste"],
      improvementPotential: 0.25
    },
    {
      name: "Use Phase",
      carbonFootprint: values.usePhaseCarbonFootprint,
      waterFootprint: values.usePhaseWaterFootprint,
      energyConsumption: values.usePhaseEnergyConsumption,
      description: "Operation and maintenance during use",
      hotspots: ["Operational energy use", "Maintenance activities"],
      improvementPotential: 0.2
    },
    {
      name: "End of Life",
      carbonFootprint: values.endOfLifeCarbonFootprint,
      waterFootprint: values.endOfLifeWaterFootprint,
      energyConsumption: values.endOfLifeEnergyConsumption,
      description: "Demolition, disposal, recycling, or reuse",
      hotspots: ["Waste management", "Recycling efficiency"],
      improvementPotential: 0.45
    }
  ];
}

/**
 * Helper function to calculate totals from lifecycle stages
 */
function calculateLifecycleTotals(stages: LifecycleStage[]): {
  totalCarbonFootprint: number;
  totalWaterFootprint: number;
  totalEnergyConsumption: number;
} {
  const totalCarbonFootprint = stages.reduce((sum, stage) => sum + stage.carbonFootprint, 0);
  const totalWaterFootprint = stages.reduce((sum, stage) => sum + stage.waterFootprint, 0);
  const totalEnergyConsumption = stages.reduce((sum, stage) => sum + stage.energyConsumption, 0);
  
  return {
    totalCarbonFootprint,
    totalWaterFootprint,
    totalEnergyConsumption
  };
}

/**
 * Helper function to identify hotspots in lifecycle stages
 */
function identifyLifecycleHotspots(stages: LifecycleStage[]): string[] {
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
  
  return hotspots;
}

/**
 * Helper function to calculate improvement potential
 */
function calculateImprovementPotential(stages: LifecycleStage[], totalCarbonFootprint: number): number {
  return stages.reduce((sum, stage) => 
    sum + (stage.improvementPotential || 0) * (stage.carbonFootprint / totalCarbonFootprint), 0);
}

/**
 * Interface for lifecycle assessment metadata
 */
interface LifecycleAssessmentMetadata {
  uncertaintyLevel: string;
  dataQuality: number;
  functionalUnit: string;
  systemBoundaries: string[];
  allocationMethod: string;
}

/**
 * Helper function to generate lifecycle assessment metadata
 */
function generateLifecycleAssessmentMetadata(): LifecycleAssessmentMetadata {
  return {
    uncertaintyLevel: "Medium",
    dataQuality: 0.7,
    functionalUnit: "Per project",
    systemBoundaries: ["Cradle-to-grave", "Excludes some indirect processes"],
    allocationMethod: "Mass-based allocation"
  };
}

/**
 * Calculate lifecycle assessment based on material, transport, and energy data
 * 
 * This function analyzes the environmental impact of materials, transport, and energy
 * throughout their lifecycle stages. It calculates carbon footprint, water usage,
 * and energy consumption for each stage, identifies hotspots, and suggests
 * improvement opportunities.
 * 
 * @param data - Object containing carbon, water, and energy metrics for different lifecycle stages
 * @returns A comprehensive lifecycle assessment with stages, totals, hotspots, and improvement potential
 * @example
 * const assessment = calculateLifecycleAssessment({
 *   materialCarbonFootprint: 0.4,
 *   transportCarbonFootprint: 0.3,
 *   energyCarbonFootprint: 0.5
 * });
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
  // Process input data and calculate assessment
  return processLifecycleAssessment(data);
}

/**
 * Process lifecycle assessment data and generate the complete assessment
 * 
 * This function handles the core processing logic for lifecycle assessment calculations.
 * It orchestrates the entire assessment process by:
 * 1. Setting default values for missing input data
 * 2. Defining and organizing lifecycle stages
 * 3. Calculating environmental impact totals
 * 4. Identifying environmental hotspots
 * 5. Calculating improvement potential
 * 6. Generating assessment metadata
 * 
 * By separating this logic from the main function, we improve maintainability
 * and make the code easier to test and extend.
 * 
 * @param data - Raw input data with optional environmental impact values
 * @returns A complete lifecycle assessment with all required fields
 */
function processLifecycleAssessment(data: Record<string, number | undefined>): LifecycleAssessment {
  // Set default values for missing data
  const values = setLifecycleDefaultValues(data);
  
  // Define lifecycle stages
  const stages = defineLifecycleStages(values);
  
  // Calculate totals
  const { totalCarbonFootprint, totalWaterFootprint, totalEnergyConsumption } = calculateLifecycleTotals(stages);
  
  // Identify hotspots
  const hotspots = identifyLifecycleHotspots(stages);
  
  // Calculate improvement potential
  const improvementPotential = calculateImprovementPotential(stages, totalCarbonFootprint);

  // Generate metadata
  const metadata = generateLifecycleAssessmentMetadata();

  // Combine all components into the final assessment
  return {
    stages,
    totalCarbonFootprint,
    totalWaterFootprint,
    totalEnergyConsumption,
    hotspots,
    improvementPotential,
    ...metadata
  };
}

/**
 * Calculate circular economy metrics based on material, transport, and energy data
 * 
 * This function evaluates how well materials and products can be kept in use
 * within a circular economy model. It assesses resource reuse, recycling rates,
 * product lifespan, and closed-loop potential to provide a comprehensive view
 * of circularity performance.
 * 
 * Key metrics include:
 * - Resource reuse rate: How much material is reused rather than discarded
 * - Waste recycling rate: Percentage of waste that gets recycled
 * - Product lifespan: Expected duration of product use
 * - Closed loop potential: Ability to recirculate materials in a closed system
 * 
 * @param data - Object containing circular economy parameters
 * @returns A set of circular economy metrics and indicators
 * @example
 * const metrics = calculateCircularEconomyMetrics({
 *   materialRecycledContent: 0.4,
 *   materialReuseRate: 0.3,
 *   productLifespan: 20
 * });
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
 * 
 * This function analyzes circular economy metrics and provides actionable
 * recommendations to improve circularity. It prioritizes recommendations
 * based on potential impact, implementation difficulty, and timeframe.
 * 
 * Each recommendation includes:
 * - The specific action to take
 * - Expected impact level (High, Medium, Low)
 * - Implementation difficulty
 * - Timeframe for implementation
 * - Potential benefits
 * 
 * @param metrics - The circular economy metrics to analyze
 * @returns An array of recommendations with implementation details
 * @example
 * const recommendations = generateCircularEconomyRecommendations(circularEconomyMetrics);
 * // Returns recommendations like "Implement material reuse strategies" with details
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
 * 
 * This function performs a comprehensive lifecycle cost analysis (LCCA) for a project
 * or product, considering all costs over its entire lifespan. It accounts for:
 * - Initial investment costs
 * - Operational costs over time
 * - Maintenance costs
 * - End-of-life disposal or salvage costs
 * 
 * The analysis includes:
 * - Present value calculations using appropriate discount rates
 * - Inflation and cost escalation factors
 * - Cost breakdown by category
 * - Sensitivity analysis to identify critical cost factors
 * 
 * @param data - Object containing cost parameters and financial assumptions
 * @returns Detailed lifecycle cost analysis with present values and breakdowns
 * @example
 * const lcca = calculateLifecycleCostAnalysis({
 *   initialCost: 1000000,
 *   operationalCostAnnual: 50000,
 *   maintenanceCostAnnual: 25000,
 *   lifespan: 30
 * });
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

  // Calculate sensitivity analysis with expanded parameters
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
    },
    {
      parameter: "Maintenance Cost",
      impact: calculateSensitivity(maintenanceCostAnnual, maintenanceCostAnnual * 0.1, data, "maintenanceCostAnnual")
    },
    {
      parameter: "Initial Cost",
      impact: calculateSensitivity(initialCost, initialCost * 0.1, data, "initialCost")
    },
    {
      parameter: "End of Life Cost",
      impact: calculateSensitivity(endOfLifeCost, endOfLifeCost * 0.1, data, "endOfLifeCost")
    },
    {
      parameter: "Inflation Rate",
      impact: calculateSensitivity(inflationRate, 0.01, data, "inflationRate")
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
 * Utility function to calculate lifecycle cost directly
 * This function is extracted to avoid code duplication and improve maintainability
 * 
 * @param params - Object containing lifecycle cost parameters
 * @returns The total lifecycle cost in present value
 */
function calculateLifecycleCostDirectly(params: Record<string, number | undefined>): number {
  // Extract parameters with defaults
  const initialCost = params.initialCost || 1000000;
  const operationalCostAnnual = params.operationalCostAnnual || 50000;
  const maintenanceCostAnnual = params.maintenanceCostAnnual || 25000;
  const endOfLifeCost = params.endOfLifeCost || 100000;
  const lifespan = params.lifespan || 30;
  const discountRate = params.discountRate || 0.05;
  const inflationRate = params.inflationRate || 0.02;
  const energyCostEscalation = params.energyCostEscalation || 0.03;

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
  return initialCost + operationalCostPV + maintenanceCostPV + endOfLifeCostPV;
}

/**
 * Helper function to calculate sensitivity
 * Efficiently calculates sensitivity without causing recursive call stack overflow
 * 
 * @param baseValue - The original value of the parameter
 * @param delta - The change in the parameter value
 * @param data - The complete set of lifecycle cost parameters
 * @param paramName - The name of the parameter being analyzed
 * @returns A normalized sensitivity score between 0 and 1
 */
function calculateSensitivity(
  baseValue: number, 
  delta: number, 
  data: Record<string, number | undefined>, 
  paramName: string
): number {
  // Handle edge cases
  if (baseValue === 0) {
    // Cannot calculate percentage change with zero base value
    // Use absolute change instead
    const baseParams = { ...data };
    const modifiedParams = { ...data };
    
    modifiedParams[paramName] = delta; // Just use delta as the modified value
    
    const baseCost = calculateLifecycleCostDirectly(baseParams);
    const modifiedCost = calculateLifecycleCostDirectly(modifiedParams);
    
    // Calculate absolute change relative to total cost
    const absoluteChange = Math.abs(modifiedCost - baseCost);
    return Math.min(1, absoluteChange / baseCost);
  }

  // Create base case and modified case parameter sets
  const baseParams = { ...data };
  const modifiedParams = { ...data };
  
  // Set the modified parameter value
  modifiedParams[paramName] = baseValue + delta;
  
  // Calculate lifecycle costs for both cases
  const baseCost = calculateLifecycleCostDirectly(baseParams);
  const modifiedCost = calculateLifecycleCostDirectly(modifiedParams);
  
  // Handle edge case where base cost is zero or very small
  if (Math.abs(baseCost) < 0.0001) {
    return modifiedCost > 0 ? 1 : 0; // High sensitivity if any cost is introduced
  }
  
  // Calculate sensitivity as the percentage change in total cost
  // relative to the percentage change in the parameter
  const costChange = (modifiedCost - baseCost) / baseCost;
  const paramChange = delta / baseValue;
  
  // Handle edge case where parameter change is zero
  if (Math.abs(paramChange) < 0.0001) {
    return 0; // No change in parameter means no sensitivity
  }
  
  // Calculate elasticity (ratio of percentage changes)
  // Use absolute value to measure magnitude of impact regardless of direction
  const elasticity = Math.abs(costChange / paramChange);
  
  // Normalize to a 0-1 scale with a more appropriate scaling factor
  // based on typical elasticity values in lifecycle cost analysis
  return Math.min(1, elasticity / 2);
}
