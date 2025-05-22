
import { useState, useEffect } from 'react';
import { MaterialInput } from '@/lib/carbonExports';
import { 
  trackMaterialPerformance, 
  MaterialPerformanceData 
} from '@/services/sustainability/performance';

interface UsePerformanceTrackingProps {
  materials: MaterialInput[];
  projectId?: string;
  isTrackingPaused: boolean;
}

export function usePerformanceTracking({
  materials,
  projectId,
  isTrackingPaused
}: UsePerformanceTrackingProps) {
  const [performanceData, setPerformanceData] = useState<MaterialPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Track performance data when materials change
  useEffect(() => {
    if (!materials.length || isTrackingPaused) return;
    
    const trackInitialPerformance = async () => {
      try {
        setIsLoading(true);
        const data = await trackMaterialPerformance(materials, projectId);
        setPerformanceData(data);
      } catch (err) {
        console.error("Failed to track initial performance:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    trackInitialPerformance();
  }, [materials, projectId, isTrackingPaused]);
  
  const trackPerformanceNow = async () => {
    if (!materials.length) return;
    
    try {
      setIsLoading(true);
      const data = await trackMaterialPerformance(materials, projectId);
      setPerformanceData(prevData => [...prevData, ...data]);
      return data;
    } catch (err) {
      console.error("Failed to track performance:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return { 
    performanceData, 
    isLoading, 
    error, 
    trackPerformanceNow,
    // Helper getter for top materials
    get topMaterials() {
      return performanceData
        .sort((a, b) => b.carbonFootprint - a.carbonFootprint)
        .slice(0, 5);
    }
  };
}
