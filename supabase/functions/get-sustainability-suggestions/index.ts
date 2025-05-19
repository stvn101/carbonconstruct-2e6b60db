
/**
 * Main entry point for the sustainability suggestions API
 * 
 * This module imports and re-exports all necessary components and starts the server.
 */

// Import and start the server
import { startServer } from './api-server.ts';

// Import and re-export material interfaces
import type { Material, SustainableMaterial } from './Material.ts';
import { MaterialCategory } from './Material.ts';

// Import and re-export transport interfaces
import type { TransportItem, SustainableTransport } from './Transport.ts';
import { TransportType, FuelType } from './Transport.ts';

// Import and re-export energy interfaces
import type { EnergyItem, SustainableEnergy } from './Energy.ts';
import { EnergySource, EnergyUnit } from './Energy.ts';

// Import and re-export report interfaces
import type { 
  Suggestion, 
  SustainabilityMetrics, 
  SustainabilityReport,
  ReportRequestOptions,
  CircularEconomyRecommendation,
  LifecycleCostAnalysis
} from './Report.ts';
import { 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  ComplianceStatus,
  ReportFormat
} from './Report.ts';

// Re-export material interfaces
export type { Material, SustainableMaterial };
export { MaterialCategory };

// Re-export transport interfaces
export type { TransportItem, SustainableTransport };
export { TransportType, FuelType };

// Re-export energy interfaces
export type { EnergyItem, SustainableEnergy };
export { EnergySource, EnergyUnit };

// Re-export report interfaces
export type { 
  Suggestion, 
  SustainabilityMetrics, 
  SustainabilityReport,
  ReportRequestOptions,
  CircularEconomyRecommendation,
  LifecycleCostAnalysis
};
export { 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  ComplianceStatus,
  ReportFormat
};

// Re-export helper functions
export { 
  calculateSustainableMaterialPercentage,
  identifyHighImpactMaterials,
  generateMaterialAlternatives
} from './material-helpers.ts';

export {
  calculateTotalDistance,
  calculateAverageEmissionsFactor,
  calculateSustainableTransportPercentage,
  identifyHighEmissionRoutes,
  calculateRouteOptimizationPotential
} from './transport-helpers.ts';

export {
  calculateTotalEnergyConsumption,
  calculateRenewablePercentage,
  calculatePeakDemandReductionPotential,
  identifyEnergyEfficiencyOpportunities
} from './energy-helpers.ts';

// Re-export report generation functions
export {
  generateBasicSustainabilityReport,
  generateDetailedSustainabilityReport,
  calculateDataCompleteness
} from './report-generation.ts';

// Start the server
startServer();
