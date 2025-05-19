
// Report types and interfaces for sustainability suggestions

export enum ReportFormat {
  BASIC = 'basic',
  DETAILED = 'detailed',
  COMPREHENSIVE = 'comprehensive'
}

export interface ReportRequestOptions {
  format: ReportFormat;
  includeLifecycleAnalysis?: boolean;
  includeCircularEconomy?: boolean;
  includeComplianceDetails?: boolean;
  includeImplementationRoadmap?: boolean;
}

export interface SustainabilityReport {
  id?: string;
  projectId?: string;
  projectName?: string;
  generatedAt: string;
  format: ReportFormat;
  suggestions: string[];
  prioritySuggestions?: string[];
  materialRecommendations?: MaterialRecommendation[];
  transportRecommendations?: TransportRecommendation[];
  energyRecommendations?: EnergyRecommendation[];
  score?: {
    overall: number;
    materials: number;
    transport: number;
    energy: number;
  };
  complianceStatus?: {
    ncc2025: boolean;
    nabers: string;
    issues?: string[];
  };
  lifeCycleAnalysis?: LifecycleAnalysis;
  implementationRoadmap?: ImplementationStep[];
}

export interface MaterialRecommendation {
  originalMaterial: string;
  recommendedAlternative: string;
  carbonReduction: number; // percentage
  costImpact: number; // percentage (positive is more expensive)
  availability: 'high' | 'medium' | 'low';
  additionalBenefits?: string[];
}

export interface TransportRecommendation {
  currentMode: string;
  recommendedMode: string;
  distance: number; // km
  carbonReduction: number; // percentage
  costImpact: number; // percentage (positive is more expensive)
  feasibility: 'high' | 'medium' | 'low';
}

export interface EnergyRecommendation {
  currentSource: string;
  recommendedSource: string;
  carbonReduction: number; // percentage
  costImpact: number; // percentage (positive is more expensive)
  implementationComplexity: 'high' | 'medium' | 'low';
}

export interface LifecycleAnalysis {
  stages: {
    extraction: number; // percentage of total emissions
    manufacturing: number;
    transportation: number;
    construction: number;
    operation: number;
    endOfLife: number;
  };
  totalLifecycleEmissions: number; // kg CO2e
  recommendations: string[];
}

export interface ImplementationStep {
  phase: 'immediate' | 'short-term' | 'medium-term' | 'long-term';
  actions: string[];
  estimatedTimeframe: string; // e.g., "1-3 months"
  estimatedCostRange: string; // e.g., "Low", "Medium", "High"
  estimatedCarbonSavings: number; // kg CO2e
}
