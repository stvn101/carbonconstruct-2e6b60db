// deno-lint-ignore-file no-unused-vars
import { serve } from 'std/http/server.ts';
import { Status } from 'std/http/http_status.ts';
import { 
  generateMaterialSuggestions, 
  generateTransportSuggestions, 
  generateEnergySuggestions, 
  generateGeneralSuggestions,
  generateStructuredMaterialSuggestions,
  generateStructuredTransportSuggestions,
  generateStructuredEnergySuggestions,
  generateStructuredGeneralSuggestions
} from './enhanced-suggestions.ts';
import { handleCors, corsHeaders, createCache } from './utils.ts';

// Import metrics calculation functions
import { 
  calculateDetailedMaterialMetrics,
  generateMaterialAlternatives as importedGenerateMaterialAlternatives,
  calculateMaterialCircularityIndex
} from './Material.metrics.ts';

import {
  calculateDetailedTransportMetrics,
  identifyHighEmissionRoutes as identifyHighEmissionRoutesDetailed,
  calculateRouteOptimizationPotential as calculateRouteOptimizationPotentialDetailed,
  calculateTransportLifecycleEmissions
} from './Transport.metrics.ts';

import {
  calculateDetailedEnergyMetrics,
  identifyEnergyEfficiencyOpportunities as identifyEnergyEfficiencyOpportunitiesDetailed,
  calculatePeakDemandReductionPotential as calculatePeakDemandReductionPotentialDetailed,
  calculateEnergyLifecycleAssessment
} from './Energy.metrics.ts';

import {
  calculateLifecycleAssessment,
  calculateCircularEconomyMetrics,
  generateCircularEconomyRecommendations,
  calculateLifecycleCostAnalysis
} from './Lifecycle.metrics.ts';

// Import and re-export interfaces
import type { Material, SustainableMaterial } from 'interfaces/material';
import { MaterialCategory } from 'interfaces/material';
import type { TransportItem, SustainableTransport } from 'interfaces/transport';
import { TransportType, FuelType } from 'interfaces/transport';
import type { EnergyItem, SustainableEnergy } from 'interfaces/energy';
import { EnergySource, EnergyUnit } from 'interfaces/energy';
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

// Re-export interfaces
export type { Material, SustainableMaterial };
export { MaterialCategory };
export type { TransportItem, SustainableTransport };
export { TransportType, FuelType };
export type { EnergyItem, SustainableEnergy };
export { EnergySource, EnergyUnit };
export type { 
  Suggestion, 
  SustainabilityMetrics, 
  SustainabilityReport,
  ReportRequestOptions
};
export { 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  ComplianceStatus,
  ReportFormat
};

// API version
const API_VERSION = "1.1.0";

// Function to generate a basic sustainability report

// Function to generate a detailed sustainability report
function generateDetailedSustainabilityReport(data: {
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
  
  // Calculate detailed metrics
  const metrics = calculateDetailedSustainabilityMetrics(data);
  
  // Generate material analysis
  const materialAnalysis = materials.length > 0 ? {
    totalMaterials: materials.length,
    sustainableMaterialPercentage: calculateSustainableMaterialPercentage(materials),
    highImpactMaterials: identifyHighImpactMaterials(materials),
    recommendedAlternatives: localGenerateMaterialAlternatives(materials)
  } : undefined;
  
  // Generate transport analysis
  const transportAnalysis = transport.length > 0 ? {
    totalDistance: calculateTotalDistance(transport),
    averageEmissionsFactor: calculateAverageEmissionsFactor(transport),
    sustainableTransportPercentage: calculateSustainableTransportPercentage(transport),
    highEmissionRoutes: identifyHighEmissionRoutes(transport),
    routeOptimizationPotential: calculateRouteOptimizationPotential(transport)
  } : undefined;
  
  // Generate energy analysis
  const energyAnalysis = energy.length > 0 ? {
    totalConsumption: calculateTotalEnergyConsumption(energy),
    renewablePercentage: calculateRenewablePercentage(energy),
    peakDemandReductionPotential: calculatePeakDemandReductionPotential(energy),
    energyEfficiencyOpportunities: identifyEnergyEfficiencyOpportunities(energy)
  } : undefined;
  
  // Generate lifecycle assessment
  const materialCarbonFootprint = materials.reduce((sum, m) => 
    sum + (('embodiedCarbon' in m && typeof m.embodiedCarbon === 'number') ? m.embodiedCarbon : 0), 0) / Math.max(1, materials.length);
  
  const transportCarbonFootprint = transport.reduce((sum, t) => 
    sum + (('emissionsFactor' in t && typeof t.emissionsFactor === 'number') ? t.emissionsFactor : 0), 0) / Math.max(1, transport.length);
  
  const energyCarbonFootprint = energy.reduce((sum, e) => 
    sum + (('carbonIntensity' in e && typeof e.carbonIntensity === 'number') ? e.carbonIntensity : 0), 0) / Math.max(1, energy.length);
  
  const lifecycleAssessment = calculateLifecycleAssessment({
    materialCarbonFootprint,
    transportCarbonFootprint,
    energyCarbonFootprint
  });
  
  // Generate circular economy metrics
  const materialRecycledContent = materials.reduce((sum, m) => 
    sum + (('recycledContent' in m && typeof m.recycledContent === 'number') ? m.recycledContent : 0), 0) / Math.max(1, materials.length);
  
  const materialReuseRate = materials.reduce((sum, m) => 
    sum + (('reuseRate' in m && typeof m.reuseRate === 'number') ? m.reuseRate : 0), 0) / Math.max(1, materials.length);
  
  const circularEconomyMetrics = calculateCircularEconomyMetrics({
    materialRecycledContent,
    materialReuseRate
  });
  
  // Combine all suggestions
  const allSuggestions = [
    ...materialSuggestions,
    ...transportSuggestions,
    ...energySuggestions,
    ...generalSuggestions
  ];
  
  // Generate summary
  const summary = generateSummary(metrics, allSuggestions);
  
  return {
    success: true,
    suggestions: allSuggestions,
    metrics,
    summary,
    timestamp: new Date().toISOString(),
    reportId: crypto.randomUUID(),
    materialAnalysis,
    transportAnalysis,
    energyAnalysis,
    lifecycleAssessment,
    circularEconomyMetrics
  };
}

// Helper functions for detailed report generation
function calculateSustainabilityMetrics(data: {
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
    const sustainableMaterialCount = materials.filter(m => 
      'sustainabilityScore' in m || 
      ('recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent > 50) ||
      ('locallySourced' in m && m.locallySourced === true)
    ).length;
    
    const sustainableMaterialRatio = sustainableMaterialCount / materials.length;
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
    const sustainableTransportCount = transport.filter(t => 
      'carbonFootprint' in t || 
      ('isElectric' in t && t.isElectric === true) ||
      ('routeOptimization' in t && t.routeOptimization === true)
    ).length;
    
    const sustainableTransportRatio = sustainableTransportCount / transport.length;
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
    const renewableEnergyCount = energy.filter(e => 
      ('renewable' in e && e.renewable === true) ||
      ('source' in e && typeof e.source === 'string' && 
        ['solar', 'wind', 'geothermal', 'biomass'].some(r => e.source.toLowerCase().includes(r)))
    ).length;
    
    const renewableEnergyRatio = renewableEnergyCount / energy.length;
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

function calculateDetailedSustainabilityMetrics(data: {
  materials?: (Material | SustainableMaterial)[];
  transport?: (TransportItem | SustainableTransport)[];
  energy?: (EnergyItem | SustainableEnergy)[];
}): SustainabilityMetrics {
  const metrics = calculateSustainabilityMetrics(data);
  
  return {
    sustainabilityScore: metrics.sustainabilityScore,
    estimatedCarbonSavings: metrics.estimatedCarbonSavings,
    estimatedCostSavings: 0.3,
    estimatedWaterSavings: 0.25,
    estimatedEnergyReduction: 0.35,
    estimatedWasteReduction: 0.4,
    materialScore: 70,
    transportScore: 65,
    energyScore: 60,
    improvementAreas: metrics.improvementAreas,
    industryAverage: 60,
    bestInClass: 85,
    percentileRanking: metrics.sustainabilityScore > 60 ? (metrics.sustainabilityScore - 60) / 25 * 100 : 0,
    regulatoryCompliance: {
      status: ComplianceStatus.PARTIALLY_COMPLIANT,
      standards: ["ISO 14001", "GHG Protocol"],
      gaps: metrics.improvementAreas.length > 0 ? metrics.improvementAreas : undefined
    }
  };
}

// These functions are now imported from enhanced-suggestions.ts

function calculateSustainableMaterialPercentage(materials: (Material | SustainableMaterial)[]): number {
  if (materials.length === 0) return 0;
  
  const sustainableMaterialCount = materials.filter(m => 
    'sustainabilityScore' in m || 
    ('recycledContent' in m && typeof m.recycledContent === 'number' && m.recycledContent > 50) ||
    ('locallySourced' in m && m.locallySourced === true)
  ).length;
  
  return (sustainableMaterialCount / materials.length) * 100;
}

function identifyHighImpactMaterials(materials: (Material | SustainableMaterial)[]): string[] {
  return materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.8)
    .map(m => m.name);
}

function localGenerateMaterialAlternatives(materials: (Material | SustainableMaterial)[]): {
  material: string;
  alternatives: string[];
  potentialSavings: {
    carbon: number;
    cost?: number;
  };
}[] {
  return materials
    .filter(m => 'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number' && m.embodiedCarbon > 0.8)
    .map(m => ({
      material: m.name,
      alternatives: m.alternatives || ["Sustainable alternative 1", "Sustainable alternative 2"],
      potentialSavings: {
        carbon: 0.3,
        cost: 0.1
      }
    }));
}

function calculateTotalDistance(transport: (TransportItem | SustainableTransport)[]): number {
  return transport.reduce((total, t) => 
    total + (('distance' in t && typeof t.distance === 'number') ? t.distance : 0), 0);
}

function calculateAverageEmissionsFactor(transport: (TransportItem | SustainableTransport)[]): number {
  const transportWithEmissions = transport.filter(t => 
    'emissionsFactor' in t && typeof t.emissionsFactor === 'number');
  
  if (transportWithEmissions.length === 0) return 0;
  
  const totalEmissionsFactor = transportWithEmissions.reduce((total, t) => 
    total + ('emissionsFactor' in t && typeof t.emissionsFactor === 'number' ? t.emissionsFactor : 0), 0);
  
  return totalEmissionsFactor / transportWithEmissions.length;
}

function calculateSustainableTransportPercentage(transport: (TransportItem | SustainableTransport)[]): number {
  if (transport.length === 0) return 0;
  
  const sustainableTransportCount = transport.filter(t => 
    'carbonFootprint' in t || 
    ('isElectric' in t && t.isElectric === true) ||
    ('routeOptimization' in t && t.routeOptimization === true)
  ).length;
  
  return (sustainableTransportCount / transport.length) * 100;
}

function identifyHighEmissionRoutes(transport: (TransportItem | SustainableTransport)[]): {
  origin: string;
  destination: string;
  distance: number;
  emissions: number;
}[] {
  return transport
    .filter(t => 
      'emissionsFactor' in t && typeof t.emissionsFactor === 'number' && t.emissionsFactor > 0.8 &&
      'distance' in t && typeof t.distance === 'number'
    )
    .map(t => ({
      origin: "Origin", // Placeholder
      destination: "Destination", // Placeholder
      distance: ('distance' in t && typeof t.distance === 'number') ? t.distance : 0,
      emissions: ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') ? t.emissionsFactor : 0
    }));
}

function calculateRouteOptimizationPotential(_transport: (TransportItem | SustainableTransport)[]): number {
  // Simplified calculation - in reality would be more complex
  return 0.2; // 20% potential improvement
}

function calculateTotalEnergyConsumption(energy: (EnergyItem | SustainableEnergy)[]): number {
  return energy.reduce((total, e) => 
    total + (('consumption' in e && typeof e.consumption === 'number') ? e.consumption : 0), 0);
}

function calculateRenewablePercentage(energy: (EnergyItem | SustainableEnergy)[]): number {
  if (energy.length === 0) return 0;
  
  const renewableEnergyCount = energy.filter(e => 
    ('renewable' in e && e.renewable === true) ||
    ('source' in e && typeof e.source === 'string' && 
      ['solar', 'wind', 'geothermal', 'biomass'].some(r => e.source.toLowerCase().includes(r)))
  ).length;
  
  return (renewableEnergyCount / energy.length) * 100;
}

function calculatePeakDemandReductionPotential(_energy: (EnergyItem | SustainableEnergy)[]): number {
  // Simplified calculation - in reality would be more complex
  return 0.15; // 15% potential reduction
}

function identifyEnergyEfficiencyOpportunities(_energy: (EnergyItem | SustainableEnergy)[]): {
  area: string;
  potentialSavings: number;
  investmentRequired?: number;
  paybackPeriod?: number;
}[] {
  return [
    {
      area: "Lighting",
      potentialSavings: 0.3,
      investmentRequired: 5000,
      paybackPeriod: 2.5
    },
    {
      area: "HVAC",
      potentialSavings: 0.25,
      investmentRequired: 12000,
      paybackPeriod: 4
    },
    {
      area: "Equipment",
      potentialSavings: 0.2,
      investmentRequired: 8000,
      paybackPeriod: 3
    }
  ];
}

/**
 * Calculate data completeness score based on available data
 */
function calculateDataCompleteness(data: {
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
  
  // Check for detailed properties in materials
  if (hasMaterials) {
    let materialDetailScore = 0;
    const totalMaterials = materials.length;
    
    // Count materials with key properties
    const materialsWithEmbodiedCarbon = materials.filter(m => 
      'embodiedCarbon' in m && typeof m.embodiedCarbon === 'number').length;
    
    const materialsWithRecycledContent = materials.filter(m => 
      'recycledContent' in m && typeof m.recycledContent === 'number').length;
    
    const materialsWithLocallySourced = materials.filter(m => 
      'locallySourced' in m).length;
    
    // Calculate detail score
    materialDetailScore = (
      (materialsWithEmbodiedCarbon / totalMaterials) * 0.4 +
      (materialsWithRecycledContent / totalMaterials) * 0.3 +
      (materialsWithLocallySourced / totalMaterials) * 0.2
    ) * 0.3; // Materials contribute 30% to overall score
    
    completenessScore += materialDetailScore - 0.3; // Adjust for base score already added
  }
  
  // Check for detailed properties in transport
  if (hasTransport) {
    let transportDetailScore = 0;
    const totalTransport = transport.length;
    
    // Count transport items with key properties
    const transportWithEmissionsFactor = transport.filter(t => 
      'emissionsFactor' in t && typeof t.emissionsFactor === 'number').length;
    
    const transportWithDistance = transport.filter(t => 
      'distance' in t && typeof t.distance === 'number').length;
    
    const transportWithEfficiency = transport.filter(t => 
      'efficiency' in t && typeof t.efficiency === 'number').length;
    
    // Calculate detail score
    transportDetailScore = (
      (transportWithEmissionsFactor / totalTransport) * 0.4 +
      (transportWithDistance / totalTransport) * 0.3 +
      (transportWithEfficiency / totalTransport) * 0.2
    ) * 0.3; // Transport contributes 30% to overall score
    
    completenessScore += transportDetailScore - 0.3; // Adjust for base score already added
  }
  
  // Check for detailed properties in energy
  if (hasEnergy) {
    let energyDetailScore = 0;
    const totalEnergy = energy.length;
    
    // Count energy items with key properties
    const energyWithConsumption = energy.filter(e => 
      'consumption' in e && typeof e.consumption === 'number').length;
    
    const energyWithCarbonIntensity = energy.filter(e => 
      'carbonIntensity' in e && typeof e.carbonIntensity === 'number').length;
    
    const energyWithRenewable = energy.filter(e => 
      'renewable' in e).length;
    
    // Calculate detail score
    energyDetailScore = (
      (energyWithConsumption / totalEnergy) * 0.4 +
      (energyWithCarbonIntensity / totalEnergy) * 0.3 +
      (energyWithRenewable / totalEnergy) * 0.2
    ) * 0.3; // Energy contributes 30% to overall score
    
    completenessScore += energyDetailScore - 0.3; // Adjust for base score already added
  }
  
  // Add 10% for having all three categories
  if (hasMaterials && hasTransport && hasEnergy) {
    completenessScore += 0.1;
  }
  
  // Ensure score is between 0 and 1
  return Math.min(1, Math.max(0, completenessScore));
}

function generateSummary(metrics: SustainabilityMetrics, suggestions: Suggestion[]): string {
  const highImpactSuggestions = suggestions.filter(s => s.impact === ImpactLevel.HIGH);
  
  return `Sustainability assessment completed with an overall score of ${metrics.sustainabilityScore.toFixed(1)}/100. 
  Estimated carbon savings potential of ${(metrics.estimatedCarbonSavings * 100).toFixed(1)}%. 
  Key improvement areas include ${metrics.improvementAreas.join(', ')}. 
  ${highImpactSuggestions.length} high-impact recommendations identified.`;
}

// Extended interface for API response that includes metadata
// Define types for circular economy recommendations and lifecycle cost analysis
// Define the type to match the return type of generateCircularEconomyRecommendations
type CircularEconomyRecommendation = {
  recommendation: string;
  impact: string;
  implementationDifficulty: string;
  timeframe: string;
  potentialBenefits: string[];
};

interface LifecycleCostAnalysis {
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
}

interface ApiResponse {
  success: boolean;
  suggestions: Suggestion[];
  metrics: SustainabilityMetrics;
  summary: string;
  timestamp: string;
  reportId: string;
  materialAnalysis?: {
    totalMaterials: number;
    sustainableMaterialPercentage: number;
    highImpactMaterials: string[];
    recommendedAlternatives: {
      material: string;
      alternatives: string[];
      potentialSavings: {
        carbon: number;
        cost?: number;
      };
    }[];
  };
  transportAnalysis?: {
    totalDistance: number;
    averageEmissionsFactor: number;
    sustainableTransportPercentage: number;
    highEmissionRoutes: {
      origin: string;
      destination: string;
      distance: number;
      emissions: number;
    }[];
    routeOptimizationPotential: number;
  };
  energyAnalysis?: {
    totalConsumption: number;
    renewablePercentage: number;
    peakDemandReductionPotential: number;
    energyEfficiencyOpportunities: {
      area: string;
      potentialSavings: number;
      investmentRequired?: number;
      paybackPeriod?: number;
    }[];
  };
  lifecycleAssessment?: {
    stages: {
      name: string;
      carbonFootprint: number;
      waterFootprint: number;
      energyConsumption: number;
    }[];
    hotspots: string[];
  };
  circularEconomyMetrics?: {
    resourceReuseRate: number;
    wasteRecyclingRate: number;
    productLifespan: number;
    closedLoopPotential: number;
  };
  metadata?: {
    version: string;
    requestId: string;
    processingTime: number;
    requestType: string;
    reportFormat?: ReportFormat;
    reportOptions?: ReportRequestOptions;
    dataQuality?: {
      completeness: number;
      accuracy: number;
      consistency: number;
    };
    calculationModels?: string[];
    generatedAt: string;
    source?: string;
    timestamp?: string;
  };
  circularEconomyRecommendations?: CircularEconomyRecommendation[];
  lifecycleCostAnalysis?: LifecycleCostAnalysis;
}

// Create a cache for material data and calculation results
const materialsCache = createCache<(Material | SustainableMaterial)[]>(60 * 5); // 5 minute cache
const calculationCache = createCache<ApiResponse>(60 * 15); // 15 minute cache

// Helper function to paginate arrays
function paginateArray<T>(array: T[], page: number, pageSize: number): { data: T[], total: number, page: number, pageSize: number, totalPages: number } {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = array.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    total: array.length,
    page,
    pageSize,
    totalPages: Math.ceil(array.length / pageSize)
  };
}

// Helper function to generate a cache key
function generateCacheKey(data: Record<string, unknown>): string {
  // Create a simple hash from the stringified data
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).substring(0, 16);
}

serve(async (req): Promise<Response> => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Handle GET request for materials (with pagination)
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const path = url.pathname;
    
    if (path === '/materials') {
      try {
        // Check if we have cached materials
        const cachedMaterials = materialsCache.get('all_materials');
        if (cachedMaterials) {
          // Parse pagination parameters
          const page = parseInt(url.searchParams.get('page') || '1');
          const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
          
          // Paginate the cached materials
          const paginatedResult = paginateArray(cachedMaterials, page, pageSize);
          
          return new Response(
            JSON.stringify({
              success: true,
              ...paginatedResult,
              metadata: {
                version: API_VERSION,
                source: 'cache',
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.OK
            }
          );
        }
        
        // If not in cache, return an empty response for now
        // In a real implementation, you would load materials from a database
        return new Response(
          JSON.stringify({
            success: false,
            error: "Materials not available",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.NotFound
          }
        );
      } catch (error) {
        console.error("Error fetching materials:", error);
        return new Response(
          JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.InternalServerError
          }
        );
      }
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Endpoint not found",
        metadata: {
          version: API_VERSION,
          timestamp: new Date().toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.NotFound
      }
    );
  }

  try {
    // Parse request body for POST requests
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("Error parsing request body:", parseError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid JSON in request body",
          details: parseError instanceof Error ? parseError.message : "Unknown parsing error",
          metadata: {
            version: API_VERSION,
            timestamp: new Date().toISOString()
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: Status.BadRequest
        }
      );
    }
    
    const { materials, transport, energy } = body;

    // Enhanced input validation
    if (!materials && !transport && !energy) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Request must include at least one of: materials, transport, or energy data",
          metadata: {
            version: API_VERSION,
            timestamp: new Date().toISOString()
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: Status.BadRequest
        }
      );
    }
    
    // Validate materials data structure if provided
    if (materials) {
      if (!Array.isArray(materials)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Materials data must be an array",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.BadRequest
          }
        );
      }
      
      // Check if materials have required properties
      for (let i = 0; i < materials.length; i++) {
        const material = materials[i];
        if (!material.name || typeof material.name !== 'string') {
          return new Response(
            JSON.stringify({
              success: false,
              error: `Material at index ${i} is missing required 'name' property or it's not a string`,
              metadata: {
                version: API_VERSION,
                timestamp: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: Status.BadRequest
            }
          );
        }
      }
    }
    
    // Validate transport data structure if provided
    if (transport) {
      if (!Array.isArray(transport)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Transport data must be an array",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.BadRequest
          }
        );
      }
    }
    
    // Validate energy data structure if provided
    if (energy) {
      if (!Array.isArray(energy)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Energy data must be an array",
            metadata: {
              version: API_VERSION,
              timestamp: new Date().toISOString()
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: Status.BadRequest
          }
        );
      }
    }

    console.log('Request received:', { 
      materialsCount: materials?.length || 0,
      transportCount: transport?.length || 0,
      energyCount: energy?.length || 0
    });

    // Check report format options
    const url = new URL(req.url);
    const detailed = url.searchParams.get('detailed') === 'true';
    const format = url.searchParams.get('format') as ReportFormat || 
                  (detailed ? ReportFormat.DETAILED : ReportFormat.BASIC);
    
    // Parse additional report options
    const reportOptions: ReportRequestOptions = {
      format,
      includeLifecycleAssessment: url.searchParams.get('includeLifecycleAssessment') === 'true',
      includeCircularEconomyMetrics: url.searchParams.get('includeCircularEconomyMetrics') === 'true',
      includeBenchmarking: url.searchParams.get('includeBenchmarking') === 'true',
      includeRegulatoryCompliance: url.searchParams.get('includeRegulatoryCompliance') === 'true',
      includeRecommendations: url.searchParams.get('includeRecommendations') !== 'false', // Default to true
      includeImplementationDetails: url.searchParams.get('includeImplementationDetails') === 'true'
    };
    
    // Generate a cache key based on the request data and options
    const cacheKey = generateCacheKey({ materials, transport, energy, reportOptions });
    
    // Check if we have a cached result
    const cachedResult = calculationCache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached result for key:', cacheKey);
      return new Response(
        JSON.stringify({
          ...cachedResult,
          metadata: {
            ...cachedResult.metadata,
            source: 'cache',
            timestamp: new Date().toISOString()
          }
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: Status.OK
        }
      );
    }
    
    // Start timing for performance measurement
    const startTime = performance.now();
    
    // Generate response
    let response;
    
    // Process in smaller batches if there are many materials
    const processMaterials = (materials && materials.length > 50) 
      ? async () => {
          const batchSize = 50;
          const batches = Math.ceil(materials.length / batchSize);
          let processedMaterials: (Material | SustainableMaterial)[] = [];
          
          for (let i = 0; i < batches; i++) {
            const start = i * batchSize;
            const end = Math.min(start + batchSize, materials.length);
            const batch = materials.slice(start, end);
            
            // Process this batch
            const batchResults = await Promise.all(batch.map((material) => {
              // Perform any heavy calculations on individual materials here
              return material;
            }));
            
            processedMaterials = [...processedMaterials, ...batchResults];
          }
          
          return processedMaterials;
        }
      : () => materials;
    
    // Process materials in batches
    const processedMaterials = await processMaterials();
    
    if (detailed || format !== ReportFormat.BASIC) {
      // Generate detailed sustainability report with optimized processing
      const report = generateDetailedSustainabilityReport({
        materials: processedMaterials,
        transport,
        energy
      });
      
      // Apply report options
      if (!reportOptions.includeLifecycleAssessment) {
        delete report.lifecycleAssessment;
      }
      
      if (!reportOptions.includeCircularEconomyMetrics) {
        delete report.circularEconomyMetrics;
      }
      
      if (!reportOptions.includeRecommendations) {
        report.suggestions = [];
      }
      
      if (!reportOptions.includeImplementationDetails) {
        // Remove implementation details from suggestions but keep the type
        report.suggestions = report.suggestions.map(suggestion => {
          const { implementationTimeframe: _implementationTimeframe, implementationComplexity, ...rest } = suggestion;
          return {
            ...rest,
            // Add default values to maintain type compatibility
            implementationTimeframe: Timeframe.MEDIUM_TERM,
            implementationComplexity: ComplexityLevel.MODERATE
          };
        });
      }
      
      // Add circular economy recommendations if requested
      const circularEconomyRecommendations: CircularEconomyRecommendation[] | undefined = 
        reportOptions.includeCircularEconomyMetrics && report.circularEconomyMetrics ? 
        generateCircularEconomyRecommendations(report.circularEconomyMetrics) : undefined;
      
      // Calculate lifecycle cost analysis if requested
      const lifecycleCostAnalysis = reportOptions.includeLifecycleAssessment ? 
        calculateLifecycleCostAnalysis({
          initialCost: 1000000, // Example value
          operationalCostAnnual: 50000, // Example value
          maintenanceCostAnnual: 25000, // Example value
          lifespan: 30 // Example value
        }) : undefined;
      
      // Generate the response
      response = {
        ...report,
        circularEconomyRecommendations,
        lifecycleCostAnalysis,
        metadata: {
          version: API_VERSION,
          requestId: crypto.randomUUID(),
          processingTime: performance.now() - startTime,
          requestType: 'detailed',
          reportFormat: format,
          reportOptions,
          dataQuality: {
            completeness: calculateDataCompleteness({ materials: processedMaterials, transport, energy }),
            accuracy: 0.85,
            consistency: 0.9
          },
          calculationModels: [
            "Material Carbon Footprint",
            "Transport Emissions",
            "Energy Consumption",
            "Lifecycle Assessment",
            "Circular Economy Metrics"
          ],
          generatedAt: new Date().toISOString()
        }
      };
    } else {
      // Generate basic sustainability report
      const materialSuggestions = generateStructuredMaterialSuggestions({ materials: processedMaterials });
      const transportSuggestions = generateStructuredTransportSuggestions(transport);
      const energySuggestions = generateStructuredEnergySuggestions(energy);
      const generalSuggestions = generateStructuredGeneralSuggestions();
      
      const metrics = calculateSustainabilityMetrics({
        materials: processedMaterials,
        transport,
        energy
      });
      
      // Combine all suggestions
      const allSuggestions: Suggestion[] = [
        ...materialSuggestions,
        ...transportSuggestions,
        ...energySuggestions,
        ...generalSuggestions
      ];
      
      response = {
        success: true,
        suggestions: allSuggestions,
        metrics: {
          sustainabilityScore: metrics.sustainabilityScore,
          estimatedCarbonSavings: metrics.estimatedCarbonSavings,
          improvementAreas: metrics.improvementAreas
        },
        reportId: crypto.randomUUID(),
        metadata: {
          version: API_VERSION,
          requestId: crypto.randomUUID(),
          processingTime: performance.now() - startTime,
          requestType: 'basic',
          generatedAt: new Date().toISOString()
        }
      };
    }
    
    // Cache the result
    calculationCache.set(cacheKey, response);
    
    // Return the response
    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: Status.OK
      }
    );
  } catch (error) {
    console.error("Error generating sustainability suggestions:", error);
    
    // Determine the appropriate status code based on the error
    let statusCode = Status.InternalServerError;
    let errorMessage = "An unexpected error occurred while processing your request";
    let errorDetails: string | null = null;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Check for specific error types to provide better responses
      if (errorMessage.includes("quota") || errorMessage.includes("limit")) {
        statusCode = Status.TooManyRequests;
        errorMessage = "Rate limit exceeded. Please try again later.";
      } else if (errorMessage.includes("permission") || errorMessage.includes("access")) {
        statusCode = Status.Forbidden;
        errorMessage = "You don't have permission to access this resource";
      } else if (errorMessage.includes("not found") || errorMessage.includes("missing")) {
        statusCode = Status.NotFound;
        errorMessage = "The requested resource was not found";
      } else if (errorMessage.includes("invalid") || errorMessage.includes("malformed")) {
        statusCode = Status.BadRequest;
        errorMessage = "Invalid request parameters";
      }
      
      // Include stack trace in development environments
      if (Deno.env.get("ENVIRONMENT") === "development" && error.stack) {
        errorDetails = error.stack;
      }
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        details: errorDetails,
        metadata: {
          version: API_VERSION,
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID()
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: statusCode
      }
    );
  }
});
