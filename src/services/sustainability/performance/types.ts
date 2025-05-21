
/**
 * Types for material performance analytics
 */

export interface MaterialPerformanceData {
  materialId: string;
  materialName: string;
  carbonFootprint: number;
  timestamp: string;
  sustainabilityScore: number;
  quantity: number;
  region?: string;
  category?: string;
}

export interface SustainabilityTrendData {
  materialName: string;
  materialId: string;
  dataPoints: {
    timestamp: string;
    carbonFootprint: number;
    sustainabilityScore: number;
    quantity?: number;
  }[];
  improvement: number; // Percentage improvement (negative values indicate degradation)
  averageFootprint: number;
  projectedFootprint?: number;
}

export interface MaterialRecommendation {
  originalMaterial: string;
  recommendedMaterial: string;
  potentialReduction: number; // Percentage CO2 reduction
  costImpact: 'lower' | 'similar' | 'higher';
  availability: 'low' | 'medium' | 'high';
  details: string;
}
