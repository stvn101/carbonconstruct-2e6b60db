
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
  alternatives: { material: SustainableMaterial; improvement: number; reason: string; }[];
  recommendations: string[];
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
