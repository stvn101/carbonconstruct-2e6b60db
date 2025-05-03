
// Reexport types and calculation functions from carbonCalculations.ts
export { 
  calculateTotalEmissions,
  calculateMaterialEmissions,
  calculateTransportEmissions,
  calculateEnergyEmissions,
  CalculationResult,
  CalculationInput
} from './carbonCalculations';

// Export types from carbonTypes
export {
  Material,
  Transport, 
  Energy,
  MaterialInput,
  TransportInput,
  EnergyInput,
} from './carbonTypes';

// Re-export constants from carbonData
export {
  MATERIAL_FACTORS,
  TRANSPORT_FACTORS,
  ENERGY_FACTORS,
  AUS_SPECIFIC_MATERIAL_FACTORS,
  ALL_MATERIAL_FACTORS
} from './carbonData';

// Additional types for better compatibility
export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  alternativeTo?: string;
  notes?: string;
  category?: string;
}

export type MaterialsByRegion = Record<string, number>;

export interface MaterialOption {
  id: string;
  name: string;
}
