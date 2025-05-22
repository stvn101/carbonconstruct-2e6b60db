
import { useState, useEffect } from 'react';
import { usePerformanceTracking } from './usePerformanceTracking';
import { useMaterialTrends } from './useMaterialTrends';
import { useMaterialRecommendations } from './useMaterialRecommendations';
import { 
  UseMaterialPerformanceProps, 
  UseMaterialPerformanceResult 
} from './types';

export function useMaterialPerformance({
  materials,
  projectId,
  autoTrack = true
}: UseMaterialPerformanceProps): UseMaterialPerformanceResult {
  const [isTrackingPaused, setIsTrackingPaused] = useState(!autoTrack);
  
  // Compose smaller hooks
  const { 
    performanceData, 
    isLoading, 
    error, 
    trackPerformanceNow: trackPerformance, 
    topMaterials 
  } = usePerformanceTracking({
    materials,
    projectId,
    isTrackingPaused
  });
  
  const { trends, getTrendForMaterial } = useMaterialTrends(materials);
  const { recommendations, fetchRecommendations } = useMaterialRecommendations(materials);
  
  // Fetch recommendations when performance data changes
  useEffect(() => {
    if (performanceData.length > 0) {
      fetchRecommendations();
    }
  }, [performanceData]);

  // Wrap trackPerformance to also update trends
  const trackPerformanceNow = async () => {
    await trackPerformance();
    // Also update trends and recommendations
    await fetchRecommendations();
  };
  
  // Toggle tracking on/off
  const toggleTracking = () => {
    setIsTrackingPaused(prev => !prev);
  };
  
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
    getRecommendations: fetchRecommendations
  };
}
