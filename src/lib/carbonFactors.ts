/**
 * Carbon factors used in calculations, with support for dynamic loading
 * from the database
 */

import { DbMaterial } from "@/services/materials/adapters/materialDbAdapter";

export interface MaterialFactor {
  name: string;
  factor: number;
  unit?: string;
  description?: string;
}

// Default material factors to use when database isn't accessible
export const DEFAULT_MATERIAL_FACTORS: Record<string, MaterialFactor> = {
  concrete: {
    name: "Concrete",
    factor: 0.159,
    unit: "kg",
    description: "Standard concrete mix"
  },
  lowCarbonConcrete: {
    name: "Low-carbon Concrete",
    factor: 0.119, 
    unit: "kg",
    description: "Concrete with reduced carbon impact"
  },
  steel: {
    name: "Steel",
    factor: 2.81,
    unit: "kg", 
    description: "Structural steel"
  },
  recycledSteel: {
    name: "Recycled Steel",
    factor: 0.47,
    unit: "kg",
    description: "Steel from recycled sources"
  },
  timber: {
    name: "Timber",
    factor: 0.63,
    unit: "kg", 
    description: "Standard timber"
  },
  glass: {
    name: "Glass",
    factor: 1.44,
    unit: "kg",
    description: "Standard glass"
  },
  brick: {
    name: "Brick",
    factor: 0.24,
    unit: "kg",
    description: "Clay brick"
  },
  insulation: {
    name: "Insulation",
    factor: 1.28,
    unit: "kg",
    description: "Standard insulation material"
  }
};

// Main material factors variable that can be dynamically populated
export const MATERIAL_FACTORS: Record<string, MaterialFactor> = { ...DEFAULT_MATERIAL_FACTORS };

/**
 * Refresh material factors from database materials
 * @param dbMaterials Materials from database
 */
export function refreshMaterialFactors(dbMaterials: DbMaterial[]) {
  // Keep the default factors
  const updatedFactors = { ...DEFAULT_MATERIAL_FACTORS };
  
  // Add materials from database
  dbMaterials.forEach(material => {
    // Create a safe key from the material name
    const key = material.material.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    // Only add if we have a valid co2e_avg value
    if (material.co2e_avg !== null && material.co2e_avg !== undefined) {
      updatedFactors[key] = {
        name: material.material,
        factor: material.co2e_avg,
        unit: 'kg',
        description: material.description || ''
      };
    }
  });
  
  // Update the global MATERIAL_FACTORS
  Object.assign(MATERIAL_FACTORS, updatedFactors);
  
  console.log(`Updated MATERIAL_FACTORS with ${Object.keys(updatedFactors).length} materials`);
  return updatedFactors;
}

// Transport-related carbon factors
export const TRANSPORT_FACTORS = {
  road: {
    name: "Road",
    factor: 0.1,  // kg CO2e per km per kg
    unit: "km-kg"
  },
  rail: {
    name: "Rail",
    factor: 0.03, // kg CO2e per km per kg
    unit: "km-kg"
  },
  sea: {
    name: "Sea",
    factor: 0.015, // kg CO2e per km per kg
    unit: "km-kg"
  },
  air: {
    name: "Air",
    factor: 1.1, // kg CO2e per km per kg
    unit: "km-kg"
  }
};

// Energy-related carbon factors
export const ENERGY_FACTORS = {
  electricity: {
    name: "Electricity",
    factor: 0.79, // kg CO2e per kWh
    unit: "kWh"
  },
  diesel: {
    name: "Diesel",
    factor: 2.7, // kg CO2e per liter
    unit: "L"
  },
  petrol: {
    name: "Petrol",
    factor: 2.3, // kg CO2e per liter
    unit: "L"
  },
  naturalGas: {
    name: "Natural Gas",
    factor: 1.9, // kg CO2e per m³
    unit: "m³"
  }
};
