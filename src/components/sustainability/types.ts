
import { MaterialInput, CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { MaterialAnalysisResult } from "@/components/sustainability/compliance/types";

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
