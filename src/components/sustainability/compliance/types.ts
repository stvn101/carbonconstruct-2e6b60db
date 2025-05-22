
import { MaterialInput, EnergyInput } from "@/lib/carbonExports";
import { SustainableMaterial } from "@/lib/materialCategories";

// Basic compliance data structure
export interface ComplianceData {
  compliant: boolean;
  score?: number;
  details?: any;
  error?: string;
  grokAnalysis?: string;
}

// Props for the compliance status component
export interface ComplianceStatusProps {
  status?: 'passed' | 'failed' | 'warning' | 'loading';
  label?: string;
  score?: number | string;
  nccData?: ComplianceData;
  nabersData?: ComplianceData;
  onRunCheck?: () => void;
  isLoading?: boolean;
  className?: string;
}

// Props for the compliance details component
export interface ComplianceDetailProps {
  title: string;
  details: any;
  color?: string;
}

// Props for the compliance section component
export interface ComplianceSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  compliant?: boolean;
  badgeText?: string;
}

// Props for the compliance tip component
export interface ComplianceTipProps {
  tip: string;
  category?: string;
  children?: React.ReactNode;
}

// Props for the NCC section component
export interface NCCSectionProps {
  nccData: ComplianceData;
  materials?: MaterialInput[];
  onRunCheck?: () => void;
  isLoading?: boolean;
}

// Props for the NABERS section component
export interface NABERSSectionProps {
  nabersData: ComplianceData;
  energy?: EnergyInput[];
  onRunCheck?: () => void;
  isLoading?: boolean;
}

// Material analysis result from sustainability calculations
// Updated to align with types in lib/materialCategories.ts
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
