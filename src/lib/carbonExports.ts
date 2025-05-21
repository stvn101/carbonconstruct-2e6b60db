
export interface MaterialInput {
  type: string;
  quantity: string;
  id?: string; // Added missing property
  factor?: number; // Added missing property
  region?: string;
}

export interface TransportInput {
  type: string;
  distance: string;
  weight: string;
  id?: string;
  factor?: number;
}

export interface EnergyInput {
  type: string;
  amount: string;
  unit: string;
  id?: string;
  factor?: number;
}

export interface CalculationInput {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  project?: {
    name: string;
    location: string;
    area: string;
    type: string;
  };
}

export interface CalculationResult {
  totalEmissions: number;
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  breakdownByMaterial: Record<string, number>;
  breakdownByTransport: Record<string, number>;
  breakdownByEnergy: Record<string, number>;
  timestamp: string;
}
