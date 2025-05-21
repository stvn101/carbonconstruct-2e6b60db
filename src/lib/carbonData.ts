
// Material factors (kg CO2e per unit)
export const MATERIAL_FACTORS = {
  concrete: { 
    name: "Concrete", 
    factor: 0.15,
    unit: "kg",
    description: "Standard concrete"
  },
  steel: { 
    name: "Steel", 
    factor: 2.00,
    unit: "kg",
    description: "Standard structural steel"
  },
  timber: { 
    name: "Timber", 
    factor: 0.05,
    unit: "kg",
    description: "Structural timber"
  },
  wood: { 
    name: "Wood", 
    factor: 0.05,
    unit: "kg",
    description: "General wood products"
  },
  glass: { 
    name: "Glass", 
    factor: 1.00,
    unit: "kg",
    description: "Standard glass"
  },
  brick: { 
    name: "Brick", 
    factor: 0.22,
    unit: "kg",
    description: "Standard clay brick"
  },
  insulation: { 
    name: "Insulation", 
    factor: 0.20,
    unit: "kg",
    description: "General insulation materials"
  },
  aluminum: { 
    name: "Aluminum", 
    factor: 8.24,
    unit: "kg",
    description: "Standard aluminum"
  }
};

// Transport factors (kg CO2e per km per tonne)
export const TRANSPORT_FACTORS = {
  truck: { 
    name: "Truck", 
    factor: 0.10,
    description: "Standard heavy-duty truck"
  },
  train: { 
    name: "Train", 
    factor: 0.03,
    description: "Freight train"
  },
  ship: { 
    name: "Ship", 
    factor: 0.01,
    description: "Ocean freight"
  },
  plane: { 
    name: "Plane", 
    factor: 1.50,
    description: "Air freight"
  },
  van: { 
    name: "Van", 
    factor: 0.25,
    description: "Delivery van"
  }
};

// Energy factors (kg CO2e per kWh)
export const ENERGY_FACTORS = {
  electricity: { 
    name: "Electricity", 
    factor: 0.50,
    description: "Grid electricity average"
  },
  naturalGas: { 
    name: "Natural Gas", 
    factor: 0.20,
    description: "Natural gas consumption"
  },
  renewableEnergy: { 
    name: "Renewable Energy", 
    factor: 0.05,
    description: "Renewable energy mix"
  },
  diesel: { 
    name: "Diesel", 
    factor: 0.27,
    description: "Diesel fuel"
  },
  coal: { 
    name: "Coal", 
    factor: 0.34,
    description: "Coal energy"
  }
};

// Export keys as types
export type MaterialFactorKey = keyof typeof MATERIAL_FACTORS;
export type TransportFactorKey = keyof typeof TRANSPORT_FACTORS;
export type EnergyFactorKey = keyof typeof ENERGY_FACTORS;
