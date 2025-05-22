
import { CalculationResult as CalculationResultType, CalculationInput as CalculationInputType } from './carbonTypes';

export interface MaterialInput {
  id?: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  carbonFootprint: number;
  recycledContent?: number;
  origin?: string;
  notes?: string;
}

export interface TransportInput {
  id?: string;
  mode: string;
  distance: number;
  weight: number;
  carbonFootprint: number;
  type?: string; // For backward compatibility
}

export interface EnergyInput {
  id?: string;
  type: string;
  amount: number;
  unit: string;
  carbonFootprint: number;
  quantity?: number; // For backward compatibility
}

export interface CalculationInput {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

// Making this interface compatible with the one in carbonCalculations.ts
export interface CalculationResult {
  totalCO2: number;
  totalEmissions: number; // Required from carbonCalculations
  breakdownByCategory: Record<string, number>;
  breakdownByMaterial: Record<string, number>;
  breakdownByTransport: Record<string, number>; // Making this required
  breakdownByEnergy: Record<string, number>; // Making this required
  sustainabilityScore: number;
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  breakdown: {
    materials: number;
    transport: number;
    energy: number;
  };
  timestamp?: string;
}

// Add material and energy factor exports
export const MATERIAL_FACTORS: Record<string, { 
  name: string; 
  factor: number; 
  unit: string; 
}> = {
  concrete: { name: "Concrete", factor: 0.12, unit: "kg" },
  steel: { name: "Steel", factor: 1.85, unit: "kg" },
  timber: { name: "Timber", factor: 0.03, unit: "kg" },
  glass: { name: "Glass", factor: 0.85, unit: "kg" },
  brick: { name: "Brick", factor: 0.24, unit: "kg" },
  aluminum: { name: "Aluminum", factor: 9.16, unit: "kg" },
  plastic: { name: "Plastic", factor: 3.1, unit: "kg" },
  insulation: { name: "Insulation", factor: 1.35, unit: "kg" }
};

export const ENERGY_FACTORS: Record<string, {
  name: string;
  factor: number;
  unit: string;
}> = {
  electricity: { name: "Grid Electricity", factor: 0.94, unit: "kWh" },
  diesel: { name: "Diesel", factor: 2.68, unit: "L" },
  petrol: { name: "Petrol/Gasoline", factor: 2.31, unit: "L" },
  naturalGas: { name: "Natural Gas", factor: 0.18, unit: "kWh" },
  lpg: { name: "LPG", factor: 1.51, unit: "kg" },
  solar: { name: "Solar Energy", factor: 0.05, unit: "kWh" },
  wind: { name: "Wind Energy", factor: 0.01, unit: "kWh" },
  biofuel: { name: "Biofuel", factor: 0.17, unit: "L" }
};

export const TRANSPORT_FACTORS: Record<string, {
  name: string;
  factor: number;
  unit: string;
}> = {
  truck: { name: "Truck Transport", factor: 0.1, unit: "tonne-km" },
  rail: { name: "Rail Transport", factor: 0.03, unit: "tonne-km" },
  ship: { name: "Ship Transport", factor: 0.015, unit: "tonne-km" },
  air: { name: "Air Transport", factor: 0.8, unit: "tonne-km" }
};

// Re-export functions from carbonCalculations
export { calculateTotalEmissions } from './carbonCalculations';

// Re-export types from carbonTypes 
export * from './carbonTypes';
