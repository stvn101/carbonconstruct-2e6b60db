
import { SustainabilityTrendData } from "@/services/sustainability/sustainabilityApiService";
import { formatDate } from "@/lib/formatters";

export interface PerformanceChartData {
  formattedDate: string;
  carbonFootprint: number;
  sustainabilityScore: number;
  timestamp: string;
}

/**
 * Prepares chart data from trend data
 */
export function prepareChartData(trendData: SustainabilityTrendData): PerformanceChartData[] {
  return trendData.dataPoints.map(point => ({
    ...point,
    formattedDate: formatDate(new Date(point.timestamp))
  }));
}

/**
 * Calculates improvement details for display
 */
export function getImprovementDetails(improvement: number): {
  isImproving: boolean;
  showImprovement: boolean;
  value: number;
} {
  const showImprovement = improvement !== 0;
  const isImproving = improvement > 0;

  return {
    showImprovement,
    isImproving,
    value: Math.abs(improvement)
  };
}
