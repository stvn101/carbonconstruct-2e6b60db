
/**
 * Re-export from performance module to maintain backward compatibility
 */

// Re-export types and functions from performance module
export type { 
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from './performance';

export { 
  trackMaterialPerformance,
  getMaterialTrends,
  getMaterialRecommendations
} from './performance';
