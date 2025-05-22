
export interface MaterialInput {
  id?: string;
  name: string;
  type?: string;
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
}

export interface EnergyInput {
  id?: string;
  type: string;
  amount: number;
  unit: string;
  carbonFootprint: number;
}

export interface CarbonCalculation {
  totalCO2: number;
  breakdownByCategory: Record<string, number>;
  breakdownByMaterial: Record<string, number>;
  sustainabilityScore: number;
}
