
// This file centralizes all carbon calculation type exports to ensure consistency

// Re-export all types from carbonTypes
export * from './carbonTypes';

// Re-export all carbon factor constants
import { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from './carbonData';
export { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS };

// Define and export the Material, Transport, and Energy types
export type Material = keyof typeof MATERIAL_FACTORS;
export type Transport = keyof typeof TRANSPORT_FACTORS;
export type Energy = keyof typeof ENERGY_FACTORS;

// Re-export calculation types from carbonCalculations
export { 
  CalculationInput,
  CalculationResult,
  calculateTotalEmissions 
} from './carbonCalculations';
