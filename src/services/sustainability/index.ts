
/**
 * Sustainability Services Index
 * Centralizes exports from all sustainability-related services
 */

// Export compliance services
export { checkSustainabilityCompliance } from './complianceService';

// Export trend services
export { getProjectSustainabilityTrend } from './trendsService';

// Export issue services
export { getProjectSustainabilityIssues } from './issuesService';

// Export report services
export { 
  createSustainabilityReport,
  updateProjectSustainabilityGoals 
} from './reportsService';

// Re-export types from the performance service
export type { 
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from './materialPerformanceService';

// Re-export implementation from the performance service
export { 
  trackMaterialPerformance,
  getMaterialTrends,
  getMaterialRecommendations
} from './materialPerformanceService';
