
// Report types and enums for sustainability suggestions

export enum SuggestionCategory {
  MATERIAL = 'material',
  TRANSPORT = 'transport',
  ENERGY = 'energy',
  DESIGN = 'design',
  PROCESS = 'process'
}

export enum ImpactLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum Timeframe {
  IMMEDIATE = 'immediate',
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term'
}

export enum ComplexityLevel {
  SIMPLE = 'simple',
  MODERATE = 'moderate',
  COMPLEX = 'complex'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  PARTIAL = 'partial',
  NON_COMPLIANT = 'non_compliant',
  NOT_APPLICABLE = 'not_applicable'
}

export enum ReportFormat {
  BASIC = 'basic',
  DETAILED = 'detailed',
  EXECUTIVE = 'executive',
  COMPLIANCE = 'compliance'
}

export interface Suggestion {
  id: string;
  category: SuggestionCategory;
  title: string;
  description: string;
  impactLevel: ImpactLevel;
  carbonReduction: number; // percentage or absolute value
  costImplication: number; // percentage or absolute value (+ cost, - savings)
  timeframe: Timeframe;
  complexity: ComplexityLevel;
  nccCompliant?: boolean;
  nabersCompliant?: boolean;
}

export interface SustainabilityMetrics {
  totalEmissions: number;
  emissionsBreakdown: {
    materials: number;
    transport: number;
    energy: number;
  };
  sustainabilityScore: number; // 0-100
  complianceStatus: {
    ncc: ComplianceStatus;
    nabers: ComplianceStatus;
  };
}

export interface CircularEconomyRecommendation {
  title: string;
  description: string;
  potentialBenefits: string[];
  implementationSteps: string[];
  caseStudies?: string[];
}

export interface LifecycleCostAnalysis {
  initialCost: number;
  operationalCost: number;
  maintenanceCost: number;
  endOfLifeCost: number;
  totalLifecycleCost: number;
  paybackPeriod?: number; // years
  roi?: number; // percentage
}

export interface ReportRequestOptions {
  format: ReportFormat;
  includeLifecycleAnalysis?: boolean;
  includeCircularEconomy?: boolean;
  includeComplianceDetails?: boolean;
  includeImplementationRoadmap?: boolean;
}

export interface SustainabilityReport {
  projectId?: string;
  projectName?: string;
  createdAt: Date;
  metrics: SustainabilityMetrics;
  suggestions: Suggestion[];
  circularEconomyRecommendations?: CircularEconomyRecommendation[];
  lifecycleCostAnalysis?: LifecycleCostAnalysis;
  complianceDetails?: {
    ncc: {
      status: ComplianceStatus;
      details: string;
      requiredActions?: string[];
    };
    nabers: {
      status: ComplianceStatus;
      rating?: number; // 1-6 stars
      details: string;
      requiredActions?: string[];
    };
  };
  implementationRoadmap?: {
    immediate: Suggestion[];
    shortTerm: Suggestion[];
    mediumTerm: Suggestion[];
    longTerm: Suggestion[];
  };
}
