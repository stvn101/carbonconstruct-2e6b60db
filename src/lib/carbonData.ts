
// Re-export everything from the carbonFactors directory
export * from './carbonFactors';

// Define Material factors structure if not already exported
export const MATERIAL_FACTORS = {
  concrete: {
    name: "Concrete",
    factor: 0.15,
    unit: "kg"
  },
  steel: {
    name: "Steel",
    factor: 2.00,
    unit: "kg"
  },
  wood: {
    name: "Wood",
    factor: 0.05,
    unit: "kg"
  },
  glass: {
    name: "Glass",
    factor: 1.00,
    unit: "kg"
  },
  insulation: {
    name: "Insulation",
    factor: 0.20,
    unit: "kg"
  },
  // Add more material types as needed...
};

// Define Transport factors structure if not already exported
export const TRANSPORT_FACTORS = {
  truck: {
    name: "Truck",
    factor: 0.10,
    unit: "tonne-km"
  },
  train: {
    name: "Train",
    factor: 0.03,
    unit: "tonne-km"
  },
  ship: {
    name: "Ship",
    factor: 0.015,
    unit: "tonne-km"
  },
  // Add more transport types as needed...
};

// Define Energy factors structure if not already exported
export const ENERGY_FACTORS = {
  electricity: {
    name: "Electricity",
    factor: 0.50,
    unit: "kWh"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 0.20,
    unit: "kWh"
  },
  renewableEnergy: {
    name: "Renewable Energy",
    factor: 0.05,
    unit: "kWh"
  },
  // Add more energy types as needed...
};

// Australian specific material factors
export const AUS_SPECIFIC_MATERIAL_FACTORS = {
  // Australian specific materials can be defined here
};

// Combined material factors
export const ALL_MATERIAL_FACTORS = {
  ...MATERIAL_FACTORS,
  ...AUS_SPECIFIC_MATERIAL_FACTORS
};
