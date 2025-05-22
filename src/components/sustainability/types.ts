
import { MaterialInput, CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { SustainableMaterial } from "@/lib/materialCategories";

export interface ComplianceData {
  compliant: boolean;
  rating?: number;
  score?: number;
  details?: Record<string, any>;
  requirements?: {
    current: string[];
    missing: string[];
  };
  error?: string;
}

export interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateTab: (direction: "next" | "prev") => void;
}

export interface SustainabilityAnalyzerProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  className?: string;
}

// Standardized MaterialAnalysisResult to match lib/materialCategories.ts
export interface MaterialAnalysisResult {
  materialScores?: Record<string, number>;
  impactSummary?: string;
  highImpactMaterials?: { id: string; name: string; carbonFootprint: number; quantity?: number; }[];
  sustainabilityScore?: number;
  sustainabilityPercentage?: number;
  recommendations?: string[];
  alternatives?: Record<string, SustainableMaterial[]>;
  sustainabilityIssues?: { id: string; title: string; description: string; recommendation: string; }[];
  categories?: Record<string, MaterialInput[]>;
  materialCount?: number;
  sustainabilityStrengths?: { id: string; title: string; description: string; impact: string; }[];
  averageCarbonFootprint?: number;
  materialWithHighestFootprint?: any;
}
