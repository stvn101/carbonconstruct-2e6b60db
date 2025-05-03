
import { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from './carbonData';

export type Material = keyof typeof MATERIAL_FACTORS;
export type Transport = keyof typeof TRANSPORT_FACTORS;
export type Energy = keyof typeof ENERGY_FACTORS;

export interface MaterialInput {
  type: Material;
  quantity: number | string;
  unit?: string;
  region?: string;
}

export interface TransportInput {
  type: Transport;
  distance: number | string;
  weight?: number | string;
  unit?: string;
}

export interface EnergyInput {
  type: Energy;
  amount: number | string;
  quantity?: number | string; // For backward compatibility
  unit?: string;
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
  breakdownByMaterial: {
    [key in Material]?: number;
  };
  breakdownByTransport: {
    [key in Transport]?: number;
  };
  breakdownByEnergy: {
    [key in Energy]?: number;
  };
}
