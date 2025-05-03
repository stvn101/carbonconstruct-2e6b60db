// Reexport types from carbonCalculations.ts to fix import errors
export { 
  calculateTotalEmissions,
  // Reexport these functions if they exist in carbonCalculations.ts
  // or provide compatability versions
  calculateMaterialEmissions,
  calculateTransportEmissions,
  calculateEnergyEmissions,
} from './carbonCalculations';

// Export types from carbonTypes or define them here
export type Material = string;
export type Transport = string;
export type Energy = string;

export interface MaterialInput {
  type: string;
  quantity: number | string;
  unit?: string;
  region?: string;
}

export interface TransportInput {
  type: string;
  distance: number | string;
  unit?: string;
}

export interface EnergyInput {
  type: string;
  quantity: number | string;
  unit?: string;
}
