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
  lastUpdated?: Date;
  version?: string;
}

export interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navigateTab: (direction: "next" | "prev") => void;
  tabs: Array<{
    id: string;
    label: string;
    disabled?: boolean;
  }>;
}

export interface SustainabilityAnalyzerProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  className?: string;
  onAnalysisComplete?: (results: {
    score: number;
    recommendations: Array<{
      category: string;
      suggestion: string;
      impact: number;
    }>;
  }) => void;
}

export interface SustainabilityScoreProps {
  score: number;
  maxScore?: number;
  category?: string;
  trend?: 'up' | 'down' | 'stable';
  previousScore?: number;
  className?: string;
}

export interface MaterialAnalysisResult {
  material: MaterialInput;
  sustainabilityScore: number;
  alternatives: Array<{
    material: SustainableMaterial;
    improvement: number;
    reason: string;
  }>;
  recommendations: string[];
}

export interface ComplianceCheckResult {
  nccCompliant: boolean;
  nabersCompliant: boolean;
  overallScore: number;
  details: {
    ncc: ComplianceData;
    nabers: ComplianceData;
  };
  recommendations: Array<{
    category: 'ncc' | 'nabers';
    priority: 'high' | 'medium' | 'low';
    description: string;
    impact: number;
  }>;
}
