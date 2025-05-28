
import { MaterialInput } from '@/lib/carbonExports';

export interface SustainableMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  sustainabilityScore: number;
  category: string;
  recyclability: 'High' | 'Medium' | 'Low';
  region?: string;
  notes?: string;
}

export interface MaterialAnalysisResult {
  material: MaterialInput;
  sustainabilityScore: number;
  alternatives: Record<string, SustainableMaterial[]>;
  recommendations: string[];
  materialScores?: Record<string, number>;
  impactSummary?: string;
  highImpactMaterials?: { id: string; name: string; carbonFootprint: number; quantity?: number; }[];
  sustainabilityPercentage?: number;
  sustainabilityIssues?: { id: string; title: string; description: string; recommendation: string; }[];
  categories?: Record<string, MaterialInput[]>;
  materialCount?: number;
  sustainabilityStrengths?: { id: string; title: string; description: string; impact: string; }[];
  averageCarbonFootprint?: number;
  materialWithHighestFootprint?: any;
}

export interface SustainabilityIssue {
  id: string;
  title: string;
  description: string;
  recommendation: string;
}

export interface SustainabilityStrength {
  id: string;
  title: string;
  description: string;
  impact: string;
}
