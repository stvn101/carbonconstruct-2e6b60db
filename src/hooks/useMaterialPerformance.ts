
import { useState, useEffect } from 'react';
import { MaterialInput } from '@/lib/carbonExports';
import { 
  trackMaterialPerformance, 
  getMaterialTrends, 
  getMaterialRecommendations,
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from '@/services/sustainability/sustainabilityApiService';

interface UseMaterialPerformanceProps {
  materials: MaterialInput[];
  projectId?: string;
  autoTrack?: boolean;
}

interface UseMaterialPerformanceResult {
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

export function useMaterialPerformance({
  materials,
  projectId,
  autoTrack = true
}: UseMaterialPerformanceProps): UseMaterialPerformanceResult {
  const [performanceData, setPerformanceData] = useState<MaterialPerformanceData[]>([]);
  const [trends, setTrends] = useState<Record<string, SustainabilityTrendData | null>>({});
  const [recommendations, setRecommendations] = useState<MaterialRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isTrackingPaused, setIsTrackingPaused] = useState(!autoTrack);
  
  // Track performance data when materials change
  useEffect(() => {
    if (!materials.length || isTrackingPaused) return;
    
    const trackInitialPerformance = async () => {
      try {
        setIsLoading(true);
        const data = await trackMaterialPerformance(materials, projectId);
        setPerformanceData(data);
        
        // Get recommendations
        const recs = await getMaterialRecommendations(materials);
        setRecommendations(recs);
        
      } catch (err) {
        console.error("Failed to track initial performance:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    trackInitialPerformance();
  }, [materials, projectId, isTrackingPaused]);
  
  // Function to manually track performance
  const trackPerformanceNow = async () => {
    if (!materials.length) return;
    
    try {
      setIsLoading(true);
      const data = await trackMaterialPerformance(materials, projectId);
      setPerformanceData(prevData => [...prevData, ...data]);
      
      // Get trends for each material
      const newTrends: Record<string, SustainabilityTrendData | null> = { ...trends };
      for (const material of materials) {
        const trend = await getMaterialTrends(material.type);
        newTrends[material.type] = trend;
      }
      setTrends(newTrends);
      
      // Update recommendations
      const recs = await getMaterialRecommendations(materials);
      setRecommendations(recs);
      
    } catch (err) {
      console.error("Failed to track performance:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle tracking on/off
  const toggleTracking = () => {
    setIsTrackingPaused(prev => !prev);
  };
  
  // Get trend data for a specific material
  const getTrendForMaterial = async (materialType: string): Promise<SustainabilityTrendData | null> => {
    try {
      // If we have already fetched this trend, return from cache
      if (trends[materialType]) return trends[materialType];
      
      const trend = await getMaterialTrends(materialType);
      
      // Update trends cache
      setTrends(prev => ({
        ...prev,
        [materialType]: trend
      }));
      
      return trend;
    } catch (err) {
      console.error(`Failed to get trend for ${materialType}:`, err);
      return null;
    }
  };
  
  // Get recommendations
  const getRecommendations = async (): Promise<MaterialRecommendation[]> => {
    try {
      const recs = await getMaterialRecommendations(materials);
      setRecommendations(recs);
      return recs;
    } catch (err) {
      console.error("Failed to get recommendations:", err);
      return [];
    }
  };
  
  // Get top materials by carbon footprint
  const topMaterials = performanceData
    .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
    .slice(0, 5);
  
  return {
    performanceData,
    trends,
    recommendations,
    topMaterials,
    isTrackingPaused,
    isLoading,
    error,
    trackPerformanceNow,
    toggleTracking,
    getTrendForMaterial,
    getRecommendations
  };
}
