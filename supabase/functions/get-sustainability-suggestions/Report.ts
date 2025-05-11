// Report.ts - Interfaces for sustainability reporting

/**
 * Suggestion category enum
 */
export enum SuggestionCategory {
  MATERIAL = 'material',
  TRANSPORT = 'transport',
  ENERGY = 'energy',
  WASTE = 'waste',
  GENERAL = 'general'
}

/**
 * Impact level enum
 */
export enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

/**
 * Implementation timeframe enum
 */
export enum Timeframe {
  IMMEDIATE = 'immediate',
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term'
}

/**
 * Implementation complexity level enum
 */
export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex'
}

/**
 * Compliance status enum
 */
export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  PARTIALLY_COMPLIANT = 'partially_compliant',
  NON_COMPLIANT = 'non_compliant'
}

/**
 * Report format enum
 */
export enum ReportFormat {
  BASIC = 'basic',
  DETAILED = 'detailed',
  EXECUTIVE = 'executive',
  TECHNICAL = 'technical'
}

/**
 * Structured suggestion interface with impact assessment and implementation details
 */
export interface Suggestion {
  category: SuggestionCategory;
  text: string;
  impact: ImpactLevel;
  estimatedSavings?: {
    carbon?: number;
    cost?: number;
    energy?: number;
    water?: number;
    waste?: number;
  };
  implementationTimeframe: Timeframe;
  implementationComplexity: ComplexityLevel;
  references?: string[];
  tags?: string[];
}

/**
 * Sustainability metrics interface
 */
export interface SustainabilityMetrics {
  sustainabilityScore: number;
  estimatedCarbonSavings: number;
  estimatedCostSavings?: number;
  estimatedWaterSavings?: number;
  estimatedEnergyReduction?: number;
  estimatedWasteReduction?: number;
  materialScore?: number;
  transportScore?: number;
  energyScore?: number;
  improvementAreas: string[];
  industryAverage?: number;
  bestInClass?: number;
  percentileRanking?: number;
  regulatoryCompliance?: {
    status: ComplianceStatus;
    standards?: string[];
    gaps?: string[];
  };
}

/**
 * Comprehensive sustainability report interface
 */
export interface SustainabilityReport {
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
}

/**
 * Report request options interface
 */
export interface ReportRequestOptions {
  format?: ReportFormat;
  includeLifecycleAssessment?: boolean;
  includeCircularEconomyMetrics?: boolean;
  includeBenchmarking?: boolean;
  includeRegulatoryCompliance?: boolean;
  includeRecommendations?: boolean;
  includeImplementationDetails?: boolean;
}
