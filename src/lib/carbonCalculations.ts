
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

export type Material = keyof typeof MATERIAL_FACTORS;
export type Transport = keyof typeof TRANSPORT_FACTORS;
export type Energy = keyof typeof ENERGY_FACTORS;

export interface MaterialInput {
  type: Material;
  quantity: number;
  unit?: string;
}

export interface TransportInput {
  type: Transport;
  distance: number;
  weight: number;
}

export interface EnergyInput {
  type: Energy;
  amount: number;
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

export const calculateMaterialEmissions = (materials: MaterialInput[]): number => {
  return materials.reduce((total, material) => {
    return total + (MATERIAL_FACTORS[material.type].factor * material.quantity);
  }, 0);
};

export const calculateTransportEmissions = (transport: TransportInput[]): number => {
  return transport.reduce((total, transport) => {
    // Convert to tonne-km and calculate emissions
    const tonneKm = (transport.weight / 1000) * transport.distance;
    return total + (TRANSPORT_FACTORS[transport.type].factor * tonneKm);
  }, 0);
};

export const calculateEnergyEmissions = (energy: EnergyInput[]): number => {
  return energy.reduce((total, energy) => {
    return total + (ENERGY_FACTORS[energy.type].factor * energy.amount);
  }, 0);
};

export const calculateTotalEmissions = (input: CalculationInput): CalculationResult => {
  const materialEmissions = calculateMaterialEmissions(input.materials);
  const transportEmissions = calculateTransportEmissions(input.transport);
  const energyEmissions = calculateEnergyEmissions(input.energy);
  const totalEmissions = materialEmissions + transportEmissions + energyEmissions;

  // Create material breakdown
  const breakdownByMaterial: Record<Material, number> = {} as Record<Material, number>;
  input.materials.forEach(material => {
    const emissions = MATERIAL_FACTORS[material.type].factor * material.quantity;
    breakdownByMaterial[material.type] = (breakdownByMaterial[material.type] || 0) + emissions;
  });

  // Create transport breakdown
  const breakdownByTransport: Record<Transport, number> = {} as Record<Transport, number>;
  input.transport.forEach(transport => {
    const tonneKm = (transport.weight / 1000) * transport.distance;
    const emissions = TRANSPORT_FACTORS[transport.type].factor * tonneKm;
    breakdownByTransport[transport.type] = (breakdownByTransport[transport.type] || 0) + emissions;
  });

  // Create energy breakdown
  const breakdownByEnergy: Record<Energy, number> = {} as Record<Energy, number>;
  input.energy.forEach(energy => {
    const emissions = ENERGY_FACTORS[energy.type].factor * energy.amount;
    breakdownByEnergy[energy.type] = (breakdownByEnergy[energy.type] || 0) + emissions;
  });

  return {
    materialEmissions,
    transportEmissions,
    energyEmissions,
    totalEmissions,
    breakdownByMaterial,
    breakdownByTransport,
    breakdownByEnergy
  };
};

// Generates a suggested improvement based on the calculation results
export const generateSuggestions = (result: CalculationResult): string[] => {
  const suggestions: string[] = [];

  // Find highest emitting material
  const highestMaterial = Object.entries(result.breakdownByMaterial)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (highestMaterial) {
    const [materialKey, materialValue] = highestMaterial;
    const materialPercent = (materialValue / result.materialEmissions) * 100;
    
    if (materialPercent > 30) {
      if (materialKey === "concrete") {
        suggestions.push(`Consider using Green Concrete (Geopolymer) or Recycled Concrete Aggregate which reduces emissions by up to 60%.`);
      } else if (materialKey === "steel") {
        suggestions.push(`Consider sourcing BlueSteel Rebar which is manufactured in Australia with a lower carbon footprint than traditional steel.`);
      } else if (materialKey === "timber") {
        suggestions.push(`Consider using certified Australian Hardwood from sustainable forests for structural elements.`);
      } else {
        suggestions.push(`Consider reducing the use of ${MATERIAL_FACTORS[materialKey as Material].name} or finding alternatives with lower carbon footprints.`);
      }
    }
  }

  // Check transport emissions
  if (result.transportEmissions > result.totalEmissions * 0.25) {
    suggestions.push("Look for local suppliers to minimize transport distances and emissions. Australian-made materials typically have a lower transport footprint.");
    
    // Check if truck is the main transport method
    if (result.breakdownByTransport.truck && 
        result.breakdownByTransport.truck > result.transportEmissions * 0.6) {
      suggestions.push("Consider using rail transport instead of trucks for long-distance material shipping, which can reduce transport emissions by up to 70%.");
    }
  }

  // Suggest renewable energy
  if (result.breakdownByEnergy.electricity && 
      result.breakdownByEnergy.electricity > result.energyEmissions * 0.4) {
    suggestions.push("Consider powering your construction site with renewable energy sources. Australian construction sites can benefit from abundant solar resources.");
  }

  // Material alternatives specific to Australia
  if (result.materialEmissions > result.totalEmissions * 0.5) {
    suggestions.push("Australia has excellent access to low-carbon building materials. Consider bamboo cladding or recycled materials in non-structural applications.");
  }

  // Always provide a general tip
  suggestions.push("Regular maintenance of equipment and minimizing idle time can significantly reduce energy consumption and carbon emissions on Australian construction sites.");
  
  return suggestions;
};

// New function to find alternative lower-carbon materials
export const findLowerCarbonAlternatives = (material: Material): Material[] => {
  switch(material) {
    case "concrete":
      return ["recycledConcrete", "greenConcrete"];
    case "steel":
      return ["bluesteelRebar", "ausTimber"];
    case "timber":
      return ["ausTimber", "bambooCladding"];
    case "brick":
      return ["ausBrick"];
    default:
      return [];
  }
};

// New function to estimate potential emissions savings
export const calculatePotentialSavings = (input: CalculationInput): { 
  material: Material, 
  alternative: Material, 
  originalEmissions: number,
  potentialEmissions: number,
  savings: number,
  savingsPercentage: number
}[] => {
  const savings: { 
    material: Material, 
    alternative: Material, 
    originalEmissions: number,
    potentialEmissions: number,
    savings: number,
    savingsPercentage: number
  }[] = [];

  input.materials.forEach(material => {
    const alternatives = findLowerCarbonAlternatives(material.type);
    const originalEmission = MATERIAL_FACTORS[material.type].factor * material.quantity;
    
    alternatives.forEach(alt => {
      const alternativeEmission = MATERIAL_FACTORS[alt].factor * material.quantity;
      const saved = originalEmission - alternativeEmission;
      const percentage = (saved / originalEmission) * 100;
      
      if (saved > 0) {
        savings.push({
          material: material.type,
          alternative: alt,
          originalEmissions: originalEmission,
          potentialEmissions: alternativeEmission,
          savings: saved,
          savingsPercentage: percentage
        });
      }
    });
  });

  return savings.sort((a, b) => b.savings - a.savings);
};
