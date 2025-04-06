
// Carbon emission factors (kg CO2e per unit)
export const MATERIAL_FACTORS = {
  concrete: {
    name: "Concrete",
    factor: 0.107, // kg CO2e per kg
    unit: "kg"
  },
  steel: {
    name: "Steel",
    factor: 1.46, // kg CO2e per kg
    unit: "kg"
  },
  timber: {
    name: "Timber",
    factor: 0.42, // kg CO2e per kg
    unit: "kg"
  },
  brick: {
    name: "Brick",
    factor: 0.24, // kg CO2e per kg
    unit: "kg"
  },
  aluminum: {
    name: "Aluminum",
    factor: 8.24, // kg CO2e per kg
    unit: "kg"
  },
  glass: {
    name: "Glass",
    factor: 0.85, // kg CO2e per kg
    unit: "kg"
  },
  insulation: {
    name: "Insulation",
    factor: 1.86, // kg CO2e per kg
    unit: "kg"
  },
  asphalt: {
    name: "Asphalt",
    factor: 0.19, // kg CO2e per kg
    unit: "kg"
  },
  // Australian specific materials
  bluesteelRebar: {
    name: "BlueSteel Rebar (Australian)",
    factor: 0.95, // kg CO2e per kg (lower carbon Australian rebar)
    unit: "kg"
  },
  recycledConcrete: {
    name: "Recycled Concrete Aggregate (AUS)",
    factor: 0.043, // kg CO2e per kg
    unit: "kg"
  },
  ausTimber: {
    name: "Australian Hardwood",
    factor: 0.35, // kg CO2e per kg
    unit: "kg"
  },
  ausBrick: {
    name: "Australian Clay Brick",
    factor: 0.22, // kg CO2e per kg
    unit: "kg"
  },
  greenConcrete: {
    name: "Green Concrete (Geopolymer)",
    factor: 0.062, // kg CO2e per kg
    unit: "kg"
  },
  bambooCladding: {
    name: "Bamboo Cladding",
    factor: 0.15, // kg CO2e per kg
    unit: "kg"
  }
};

// Transport emission factors
export const TRANSPORT_FACTORS = {
  truck: {
    name: "Truck",
    factor: 0.1, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  train: {
    name: "Train",
    factor: 0.03, // kg CO2e per tonne-km
    unit: "tonne-km"
  },
  ship: {
    name: "Ship",
    factor: 0.015, // kg CO2e per tonne-km
    unit: "tonne-km"
  }
};

// Energy emission factors
export const ENERGY_FACTORS = {
  electricity: {
    name: "Electricity",
    factor: 0.5, // kg CO2e per kWh
    unit: "kWh"
  },
  diesel: {
    name: "Diesel",
    factor: 2.68, // kg CO2e per liter
    unit: "liter"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 0.18, // kg CO2e per kWh
    unit: "kWh"
  },
  solar: {
    name: "Solar Power",
    factor: 0.05, // kg CO2e per kWh
    unit: "kWh"
  }
};
