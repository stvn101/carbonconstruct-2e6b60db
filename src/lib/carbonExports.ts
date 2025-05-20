// Reexport calculation functions from carbonCalculations.ts
export { 
  calculateTotalEmissions
} from './carbonCalculations';

// Export types with proper 'export type' syntax for isolatedModules
export type { 
  CalculationResult,
  CalculationInput
} from './carbonCalculations';

// Export types from carbonTypes with proper syntax
export type {
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

// Update this file to include the extended MaterialInput type with recycledContent and locallySourced
// Only extending, not replacing the existing code

export interface MaterialInput {
  id?: string;
  type: string;
  quantity: number | string;
  unit?: string;
  factor?: number;
  recycledContent?: number; // Added for sustainability calculations
  locallySourced?: boolean; // Added for sustainability calculations
  recyclable?: boolean; // Added for sustainability calculations
}
