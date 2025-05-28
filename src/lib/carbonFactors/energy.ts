
export interface EnergyFactor {
  name: string;
  factor: number; // kg CO2e per unit
  unit: string;
}

export const ENERGY_FACTORS: Record<string, EnergyFactor> = {
  electricity: {
    name: "Electricity (Grid)",
    factor: 0.94, // kg CO2e per kWh (Australia average)
    unit: "kWh"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 0.18, // kg CO2e per kWh
    unit: "kWh"
  },
  diesel: {
    name: "Diesel Generator",
    factor: 0.26, // kg CO2e per kWh
    unit: "kWh"
  },
  solar: {
    name: "Solar Power",
    factor: 0.04, // kg CO2e per kWh (lifecycle)
    unit: "kWh"
  },
  wind: {
    name: "Wind Power", 
    factor: 0.01, // kg CO2e per kWh (lifecycle)
    unit: "kWh"
  },
  hydroelectric: {
    name: "Hydroelectric",
    factor: 0.02, // kg CO2e per kWh (lifecycle)
    unit: "kWh"
  }
};

export type EnergyFactorKey = keyof typeof ENERGY_FACTORS;
