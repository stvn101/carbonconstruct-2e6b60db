
/**
 * Material Performance Service Entry Point
 * Exports all functionality related to material performance analysis
 */

// Export types
export type { 
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from './types';

// Export core functionality
export { 
  trackMaterialPerformance,
  getMaterialTrends,
  getMaterialRecommendations
} from './materialPerformanceService';

// No need to export utility functions directly as they're implementation details
