/**
 * Report generation functions for sustainability analysis
 * 
 * This module provides functions for generating comprehensive sustainability reports
 * based on material, transport, and energy data. It handles both basic and detailed
 * report formats with various optional components.
 */

import type { Material, SustainableMaterial } from 'interfaces/material';
import type { TransportItem, SustainableTransport } from 'interfaces/transport';
import type { EnergyItem, SustainableEnergy } from 'interfaces/energy';
import type { 
  Suggestion, 
  SustainabilityMetrics, 
  SustainabilityReport,
  ReportRequestOptions
} from 'interfaces/report';
import { 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  ComplianceStatus,
  ReportFormat
} from 'interfaces/report';

// Import helper functions
import { 
  calculateSustainableMaterialPercentage,
  identifyHighImpactMaterials,
  generateMaterialAlternatives,
  calculateAverageEmbodiedCarbon,
  calculateTotalMaterialWeight,
  calculateRecycledContentPercentage,
  calculateLocalContentPercentage,
  groupMaterialsByCategory,
  groupMaterialsByEmbodiedCarbon,
  calculateMaterialDataCompleteness
} from './material-helpers.ts';

import {
  calculateTotalDistance,
  calculateAverageEmissionsFactor,
  calculateSustainableTransportPercentage,
  identifyHighEmissionRoutes,
  calculateRouteOptimizationPotential,
  calculateAverageEfficiency,
  groupTransportByType,
  groupTransportByFuel,
  calculateAverageLoad,
  calculateEmissionsPerTonKm,
  calculatePotentialElectrificationSavings,
  calculateTransportDataCompleteness
} from './transport-helpers.ts';

import {
  calculateTotalEnergyConsumption,
  calculateRenewablePercentage,
  calculatePeakDemandReductionPotential,
  identifyEnergyEfficiencyOpportunities,
  calculateAverageCarbonIntensity,
  calculateEnergyEfficiency,
  groupEnergyBySource,
  groupEnergyByUnit,
  calculateSmartMonitoringPercentage,
  calculateDemandResponseCapability,
  calculateEnergyDataCompleteness
} from './energy-helpers.ts';

import {
  calculateLifecycleAssessment,
  calculateCircularEconomyMetrics,
  generateCircularEconomyRecommendations,
  calculateLifecycleCostAnalysis
} from './Lifecycle.metrics.ts';

import {
  generateStructuredMaterialSuggestions,
  generateStructuredTransportSuggestions,
  generateStructuredEnergySuggestions,
  generateStructuredGeneralSuggestions
} from './enhanced-suggestions.ts';

// API version
const API_VERSION = "1.1.0";

/**
 * Generate a basic sustainability report
 * 
 * @param data Object containing materials, transport, and energy data
 * @returns Basic sustainability report
 */
export function generateBasicSustainabilityReport(data: {
  materials?: (Material | SustainableMaterial)[];
  transport?: (TransportItem | SustainableTransport)[];
  energy?: (EnergyItem | SustainableEnergy)[];
}): SustainabilityReport {
  const { materials = [], transport = [], energy = [] } = data;
  
  // Generate structured suggestions
  const materialSuggestions = generateStructuredMaterialSuggestions({ materials });
  const transportSuggestions = generateStructuredTransportSuggestions(transport);
  const energySuggestions = generateStructuredEnergySuggestions(energy);
  const generalSuggestions = generateStructuredGeneralSuggestions();
  
  // Calculate basic metrics
  const metrics = calculateSustainabilityMetrics(data);
  
  // Combine all suggestions
  const allSuggestions = [
    ...materialSuggestions,
    ...transportSuggestions,
    ...energySuggestions,
    ...generalSuggestions
  ];
  
  // Generate summary
  const summary = generateSummary({
    sustainabilityScore: metrics.sustainabilityScore,
    estimatedCarbonSavings: metrics.estimatedCarbonSavings,
    improvementAreas: metrics.improvementAreas
  }, allSuggestions);
  
  return {
    success: true,
    suggestions: allSuggestions,
    metrics: {
      sustainabilityScore: metrics.sustainabilityScore,
      estimatedCarbonSavings: metrics.estimatedCarbonSavings,
      improvementAreas: metrics.improvementAreas
    },
    summary,
    timestamp: new Date().toISOString(),
    reportId: crypto.randomUUID()
  };
}

/**
 * Generate a detailed sustainability report
 * 
 * @param data Object containing materials, transport, and energy data
 * @param options Report options for customizing the output
 * @returns Detailed sustainability report
 */
export function generateDetailedSustainabilityReport(
  data: {
    materials?: (Material | SustainableMaterial)[];
    transport?: (TransportItem | SustainableTransport)[];
    energy?: (EnergyItem | SustainableEnergy)[];
  },
  options?: ReportRequestOptions
): SustainabilityReport {
  const { materials = [], transport = [], energy = [] } = data;
  const reportOptions = options || { format: ReportFormat.DETAILED };
  
  // Generate structured suggestions
  const materialSuggestions = generateStructuredMaterialSuggestions({ materials });
  const transportSuggestions = generateStructuredTransportSuggestions(transport);
  const energySuggestions = generateStructuredEnergySuggestions(energy);
  const generalSuggestions = generateStructuredGeneralSuggestions();
  
  // Calculate detailed metrics
  const metrics = calculateDetailedSustainabilityMetrics(data);
  
  // Generate material analysis
  const materialAnalysis = materials.length > 0 ? {
    totalMaterials: materials.length,
    sustainableMaterialPercentage: calculateSustainableMaterialPercentage(materials),
    highImpactMaterials: identifyHighImpactMaterials(materials),
    recommendedAlternatives: generateMaterialAlternatives(materials),
    detailedMetrics: {
      totalWeight: calculateTotalMaterialWeight(materials),
      averageEmbodiedCarbon: calculateAverageEmbodiedCarbon(materials),
      recycledContentPercentage: calculateRecycledContentPercentage(materials),
      localContentPercentage: calculateLocalContentPercentage(materials),
      materialsByCategory: groupMaterialsByCategory(materials),
      materialsByEmbodiedCarbon: groupMaterialsByEmbodiedCarbon(materials)
    }
  } : undefined;
  
  // Generate transport analysis
  const transportAnalysis = transport.length > 0 ? {
    totalDistance: calculateTotalDistance(transport),
    averageEmissionsFactor: calculateAverageEmissionsFactor(transport),
    sustainableTransportPercentage: calculateSustainableTransportPercentage(transport),
    highEmissionRoutes: identifyHighEmissionRoutes(transport),
    routeOptimizationPotential: calculateRouteOptimizationPotential(transport),
    detailedMetrics: {
      transportByType: groupTransportByType(transport),
      transportByFuel: groupTransportByFuel(transport),
      averageLoad: calculateAverageLoad(transport),
      emissionsPerTonKm: calculateEmissionsPerTonKm(transport),
      potentialElectrificationSavings: calculatePotentialElectrificationSavings(transport)
    }
  } : undefined;
  
  // Generate energy analysis
  const energyAnalysis = energy.length > 0 ? {
    totalConsumption: calculateTotalEnergyConsumption(energy),
    renewablePercentage: calculateRenewablePercentage(energy),
    peakDemandReductionPotential: calculatePeakDemandReductionPotential(energy),
    energyEfficiencyOpportunities: identifyEnergyEfficiencyOpportunities(energy),
    detailedMetrics: {
      totalEnergyItems: energy.length,
      averageCarbonIntensity: calculateAverageCarbonIntensity(energy),
      energyEfficiency: calculateEnergyEfficiency(energy),
      peakDemandReduction: calculatePeakDemandReductionPotential(energy),
      energyBySource: groupEnergyBySource(energy),
      energyByUnit: groupEnergyByUnit(energy),
      smartMonitoringPercentage: calculateSmartMonitoringPercentage(energy),
      demandResponseCapability: calculateDemandResponseCapability(energy)
    }
  } : undefined;
  
  // Generate lifecycle assessment if requested
  let lifecycleAssessment;
  if (reportOptions.includeLifecycleAssessment) {
    // Calculate average carbon footprints for materials, transport, and energy
    const materialCarbonFootprint = calculateAverageEmbodiedCarbon(materials);
    const transportCarbonFootprint = calculateAverageEmissionsFactor(transport);
    const energyCarbonFootprint = calculateAverageCarbonIntensity(energy);
    
    lifecycleAssessment = calculateLifecycleAssessment({
      materialCarbonFootprint,
      transportCarbonFootprint,
      energyCarbonFootprint
    });
  }
  
  // Generate circular economy metrics if requested
  let circularEconomyMetrics;
  if (reportOptions.includeCircularEconomyMetrics) {
    // Calculate inputs for circular economy metrics
    const materialRecycledContent = calculateRecycledContentPercentage(materials);
    const materialReuseRate = 0.4; // Default value, would be calculated from actual data
    
    circularEconomyMetrics = calculateCircularEconomyMetrics({
      materialRecycledContent: materialRecycledContent / 100, // Convert from percentage to decimal
      materialReuseRate
    });
  }
  
  // Generate circular economy recommendations if requested
  let circularEconomyRecommendations;
  if (reportOptions.includeCircularEconomyMetrics && circularEconomyMetrics) {
    circularEconomyRecommendations = generateCircularEconomyRecommendations(circularEconomyMetrics);
  }
  
  // Calculate lifecycle cost analysis if requested
  let lifecycleCostAnalysis;
  if (reportOptions.includeLifecycleAssessment) {
    lifecycleCostAnalysis = calculateLifecycleCostAnalysis({
      initialCost: 1000000, // Example value
      operationalCostAnnual: 50000, // Example value
      maintenanceCostAnnual: 25000, // Example value
      lifespan: 30 // Example value
    });
  }
  
  // Combine all suggestions
  const allSuggestions = reportOptions.includeRecommendations !== false ? [
    ...materialSuggestions,
    ...transportSuggestions,
    ...energySuggestions,
    ...generalSuggestions
  ] : [];
  
  // Generate summary
  const summary = generateSummary(metrics, allSuggestions);
  
  // Create the report
  const report: SustainabilityReport = {
    success: true,
    suggestions: allSuggestions,
    metrics,
    summary,
    timestamp: new Date().toISOString(),
    reportId: crypto.randomUUID(),
    materialAnalysis,
    transportAnalysis,
    energyAnalysis
  };
  
  // Add optional components based on report options
  if (lifecycleAssessment) {
    report.lifecycleAssessment = lifecycleAssessment;
  }
  
  if (circularEconomyMetrics) {
    report.circularEconomyMetrics = circularEconomyMetrics;
  }
  
  if (circularEconomyRecommendations) {
    report.circularEconomyRecommendations = circularEconomyRecommendations;
  }
  
  if (lifecycleCostAnalysis) {
    report.lifecycleCostAnalysis = lifecycleCostAnalysis;
  }
  
  return report;
}

/**
 * Calculate basic sustainability metrics
 * 
 * @param data Object containing materials, transport, and energy data
 * @returns Basic sustainability metrics
 */
export function calculateSustainabilityMetrics(data: {
  materials?: (Material | SustainableMaterial)[];
  transport?: (TransportItem | SustainableTransport)[];
  energy?: (EnergyItem | SustainableEnergy)[];
}): { estimatedCarbonSavings: number; sustainabilityScore: number; improvementAreas: string[] } {
  const { materials = [], transport = [], energy = [] } = data;
  
  // Initialize metrics
  let estimatedCarbonSavings = 0;
  let sustainabilityScore = 50; // Default middle score
  
  // Improvement areas based on data analysis
  const improvementAreas: string[] = [];
  
  // Analyze materials
  if (materials.length > 0) {
    // Check for sustainable materials
    const sustainableMaterialRatio = calculateSustainableMaterialPercentage(materials) / 100;
    sustainabilityScore += sustainableMaterialRatio * 10;
    
    if (sustainableMaterialRatio < 0.3) {
      improvementAreas.push("Material selection");
    }
    
    // Estimate carbon savings from sustainable materials
    materials.forEach(m => {
      if ('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') {
        // Assume industry average is 1.0
        const savings = Math.max(0, 1.0 - m.embodiedCarbon);
        estimatedCarbonSavings += savings;
      }
    });
  } else {
    improvementAreas.push("Material data collection");
  }
  
  // Analyze transport
  if (transport.length > 0) {
    // Check for sustainable transport
    const sustainableTransportRatio = calculateSustainableTransportPercentage(transport) / 100;
    sustainabilityScore += sustainableTransportRatio * 10;
    
    if (sustainableTransportRatio < 0.3) {
      improvementAreas.push("Transport efficiency");
    }
    
    // Estimate carbon savings from efficient transport
    transport.forEach(t => {
      if ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') {
        // Assume industry average is 1.0
        const savings = Math.max(0, 1.0 - t.emissionsFactor);
        estimatedCarbonSavings += savings;
      }
    });
  } else {
    improvementAreas.push("Transport data collection");
  }
  
  // Analyze energy
  if (energy.length > 0) {
    // Check for renewable energy
    const renewableEnergyRatio = calculateRenewablePercentage(energy) / 100;
    sustainabilityScore += renewableEnergyRatio * 15;
    
    if (renewableEnergyRatio < 0.3) {
      improvementAreas.push("Renewable energy adoption");
    }
    
    // Estimate carbon savings from renewable energy
    energy.forEach(e => {
      if ('carbonIntensity' in e && typeof e.carbonIntensity === 'number') {
        // Assume grid average is 0.5
        const savings = Math.max(0, 0.5 - e.carbonIntensity);
        estimatedCarbonSavings += savings;
      }
    });
  } else {
    improvementAreas.push("Energy data collection");
  }
  
  // Cap the sustainability score at 100
  sustainabilityScore = Math.min(100, Math.max(0, sustainabilityScore));
  
  // Ensure carbon savings is between 0 and 1 for consistency
  estimatedCarbonSavings = Math.min(1, Math.max(0, estimatedCarbonSavings));
  
  return {
    estimatedCarbonSavings,
    sustainabilityScore,
    improvementAreas
  };
}

/**
 * Calculate detailed sustainability metrics
 * 
 * @param data Object containing materials, transport, and energy data
 * @returns Detailed sustainability metrics
 */
export function calculateDetailedSustainabilityMetrics(data: {
  materials?: (Material | SustainableMaterial)[];
  transport?: (TransportItem | SustainableTransport)[];
  energy?: (EnergyItem | SustainableEnergy)[];
}): SustainabilityMetrics {
  const { materials = [], transport = [], energy = [] } = data;
  
  // Calculate basic metrics
  const basicMetrics = calculateSustainabilityMetrics(data);
  
  // Calculate material score
  const materialScore = materials.length > 0 ? 
    50 + (calculateSustainableMaterialPercentage(materials) / 100) * 50 : 
    50;
  
  // Calculate transport score
  const transportScore = transport.length > 0 ? 
    50 + (calculateSustainableTransportPercentage(transport) / 100) * 50 : 
    50;
  
  // Calculate energy score
  const energyScore = energy.length > 0 ? 
    50 + (calculateRenewablePercentage(energy) / 100) * 50 : 
    50;
  
  // Calculate additional savings metrics
  const estimatedCostSavings = 0.3; // Placeholder - would be calculated from actual data
  const estimatedWaterSavings = 0.25; // Placeholder
  const estimatedEnergyReduction = 0.35; // Placeholder
  const estimatedWasteReduction = 0.4; // Placeholder
  
  // Calculate industry benchmarks
  const industryAverage = 60; // Placeholder
  const bestInClass = 85; // Placeholder
  
  // Calculate percentile ranking
  const percentileRanking = basicMetrics.sustainabilityScore > industryAverage ? 
    (basicMetrics.sustainabilityScore - industryAverage) / (bestInClass - industryAverage) * 100 : 
    0;
  
  // Determine regulatory compliance status
  const complianceStatus = basicMetrics.improvementAreas.length === 0 ? 
    ComplianceStatus.COMPLIANT : 
    ComplianceStatus.PARTIALLY_COMPLIANT;
  
  return {
    sustainabilityScore: basicMetrics.sustainabilityScore,
    estimatedCarbonSavings: basicMetrics.estimatedCarbonSavings,
    estimatedCostSavings,
    estimatedWaterSavings,
    estimatedEnergyReduction,
    estimatedWasteReduction,
    materialScore,
    transportScore,
    energyScore,
    improvementAreas: basicMetrics.improvementAreas,
    industryAverage,
    bestInClass,
    percentileRanking,
    regulatoryCompliance: {
      status: complianceStatus,
      standards: ["ISO 14001", "GHG Protocol"],
      gaps: basicMetrics.improvementAreas.length > 0 ? basicMetrics.improvementAreas : undefined
    }
  };
}

/**
 * Calculate data completeness score
 * 
 * @param data Object containing materials, transport, and energy data
 * @returns Completeness score between 0 and 1
 */
export function calculateDataCompleteness(data: {
  materials?: (Material | SustainableMaterial)[];
  transport?: (TransportItem | SustainableTransport)[];
  energy?: (EnergyItem | SustainableEnergy)[];
}): number {
  const { materials = [], transport = [], energy = [] } = data;
  
  // Check if we have data in each category
  const hasMaterials = materials.length > 0;
  const hasTransport = transport.length > 0;
  const hasEnergy = energy.length > 0;
  
  // Calculate base completeness score based on data presence
  let completenessScore = 0;
  if (hasMaterials) completenessScore += 0.3;
  if (hasTransport) completenessScore += 0.3;
  if (hasEnergy) completenessScore += 0.3;
  
  // Calculate detailed completeness scores for each category
  let materialCompletenessScore = 0;
  let transportCompletenessScore = 0;
  let energyCompletenessScore = 0;
  
  if (hasMaterials) {
    materialCompletenessScore = calculateMaterialDataCompleteness(materials);
  }
  
  if (hasTransport) {
    transportCompletenessScore = calculateTransportDataCompleteness(transport);
  }
  
  if (hasEnergy) {
    energyCompletenessScore = calculateEnergyDataCompleteness(energy);
  }
  
  // Calculate weighted average of detailed completeness scores
  const detailedCompletenessScore = 
    (materialCompletenessScore * 0.33) + 
    (transportCompletenessScore * 0.33) + 
    (energyCompletenessScore * 0.33);
  
  // Add 10% for having all three categories
  const allCategoriesBonus = (hasMaterials && hasTransport && hasEnergy) ? 0.1 : 0;
  
  // Combine base score and detailed score
  const finalScore = (completenessScore * 0.3) + (detailedCompletenessScore * 0.6) + allCategoriesBonus;
  
  // Ensure score is between 0 and 1
  return Math.min(1, Math.max(0, finalScore));
}

/**
 * Generate a summary of the sustainability report
 * 
 * @param metrics Sustainability metrics
 * @param suggestions Array of sustainability suggestions
 * @returns Summary text
 */
export function generateSummary(metrics: {
  sustainabilityScore: number;
  estimatedCarbonSavings: number;
  improvementAreas: string[];
}, suggestions: Suggestion[]): string {
  const highImpactSuggestions = suggestions.filter(s => s.impact === ImpactLevel.HIGH);
  
  return `Sustainability assessment completed with an overall score of ${metrics.sustainabilityScore.toFixed(1)}/100. 
  Estimated carbon savings potential of ${(metrics.estimatedCarbonSavings * 100).toFixed(1)}%. 
  Key improvement areas include ${metrics.improvementAreas.join(', ')}. 
  ${highImpactSuggestions.length} high-impact recommendations identified.`;
}
