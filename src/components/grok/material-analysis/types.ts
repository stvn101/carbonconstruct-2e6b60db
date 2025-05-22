
import { MaterialInput } from '@/lib/carbonExports';

export interface MaterialAnalysisProps {
  materials: MaterialInput[];
  onAnalysisComplete?: (results: any) => void;
}

export interface MaterialAnalysisResults {
  insights: string;
  materials: any[];
  timestamp: string;
}
