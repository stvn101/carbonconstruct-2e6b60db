
import { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from './carbonData';

export type Material = keyof typeof MATERIAL_FACTORS;
export type Transport = keyof typeof TRANSPORT_FACTORS;
export type Energy = keyof typeof ENERGY_FACTORS;

export interface MaterialInput {
  type: string;
  quantity: number | string;
  id?: string;
  factor?: number;
  unit?: string;
  region?: string;
  recycledContent?: number;
  locallySourced?: boolean;
  recyclable?: boolean;
}

export interface TransportInput {
  type: string;
  distance: number | string;
  weight?: number | string;
  id?: string;
  factor?: number;
  unit?: string;
}

export interface EnergyInput {
  type: string;
  amount: number | string;
  quantity?: number | string; // Added quantity property for backward compatibility
  unit?: string;
  id?: string;
  factor?: number;
}

export interface CalculationInput {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

export interface CalculationResult {
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  totalEmissions: number;
  breakdown: {
    materials: number;
    transport: number;
    energy: number;
  };
  breakdownByMaterial: Record<string, number>;
  breakdownByTransport: Record<string, number>;
  breakdownByEnergy: Record<string, number>;
  timestamp?: string; // Added timestamp property
}
