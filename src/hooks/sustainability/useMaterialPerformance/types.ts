
import { MaterialInput } from '@/lib/carbonExports';
import { 
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from '@/services/sustainability/performance';

export interface UseMaterialPerformanceProps {
  materials: MaterialInput[];
  projectId?: string;
  autoTrack?: boolean;
}

export interface UseMaterialPerformanceResult {
  performanceData: MaterialPerformanceData[];
  trends: Record<string, SustainabilityTrendData | null>;
  recommendations: MaterialRecommendation[];
  topMaterials: MaterialPerformanceData[];
  isTrackingPaused: boolean;
  isLoading: boolean;
  error: Error | null;
  trackPerformanceNow: () => Promise<void>;
  toggleTracking: () => void;
  getTrendForMaterial: (materialType: string) => Promise<SustainabilityTrendData | null>;
  getRecommendations: () => Promise<MaterialRecommendation[]>;
}
