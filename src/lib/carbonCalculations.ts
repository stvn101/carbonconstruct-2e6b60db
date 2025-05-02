
import { 
  MATERIAL_FACTORS, 
  TRANSPORT_FACTORS, 
  ENERGY_FACTORS 
} from './carbonData';

import { 
  Material, 
  Transport, 
  Energy,
  MaterialInput, 
  TransportInput, 
  EnergyInput, 
  CalculationInput, 
  CalculationResult 
} from './carbonTypes';

// Re-export the factors
export { 
  MATERIAL_FACTORS, 
  TRANSPORT_FACTORS, 
  ENERGY_FACTORS
};

// Re-export the types using export type
export type { 
  Material, 
  Transport, 
  Energy,
  MaterialInput, 
  TransportInput, 
  EnergyInput, 
  CalculationInput, 
  CalculationResult 
};

export const calculateMaterialEmissions = (materials: MaterialInput[]): number => {
  try {
    if (!materials || !Array.isArray(materials)) {
      console.error("Invalid materials input:", materials);
      return 0;
    }
    
    return materials.reduce((total, material) => {
      // Ensure material.type exists and is a valid key
      if (!material || !material.type || !MATERIAL_FACTORS[material.type]) {
        console.warn(`Invalid material or unknown material type: ${JSON.stringify(material)}`);
        return total;
      }
      
      // Ensure quantity is a number
      const quantity = Number(material.quantity) || 0;
      const emission = MATERIAL_FACTORS[material.type].factor * quantity;
      console.log(`Material: ${material.type}, Quantity: ${quantity}, Factor: ${MATERIAL_FACTORS[material.type].factor}, Emission: ${emission}`);
      return total + emission;
    }, 0);
  } catch (error) {
    console.error("Error calculating material emissions:", error);
    return 0;
  }
};

export const calculateTransportEmissions = (transport: TransportInput[]): number => {
  try {
    if (!transport || !Array.isArray(transport)) {
      console.error("Invalid transport input:", transport);
      return 0;
    }
    
    return transport.reduce((total, transport) => {
      // Ensure transport.type exists and is a valid key
      if (!transport || !transport.type || !TRANSPORT_FACTORS[transport.type]) {
        console.warn(`Invalid transport or unknown transport type: ${JSON.stringify(transport)}`);
        return total;
      }
      
      // Ensure distance and weight are numbers
      const distance = Number(transport.distance) || 0;
      const weight = Number(transport.weight) || 0;
      
      // Convert to tonne-km and calculate emissions
      const tonneKm = (weight / 1000) * distance;
      return total + (TRANSPORT_FACTORS[transport.type].factor * tonneKm);
    }, 0);
  } catch (error) {
    console.error("Error calculating transport emissions:", error);
    return 0;
  }
};

export const calculateEnergyEmissions = (energy: EnergyInput[]): number => {
  try {
    if (!energy || !Array.isArray(energy)) {
      console.error("Invalid energy input:", energy);
      return 0;
    }
    
    return energy.reduce((total, energy) => {
      // Ensure energy.type exists and is a valid key
      if (!energy || !energy.type || !ENERGY_FACTORS[energy.type]) {
        console.warn(`Invalid energy or unknown energy type: ${JSON.stringify(energy)}`);
        return total;
      }
      
      // Ensure amount is a number
      const amount = Number(energy.amount) || 0;
      return total + (ENERGY_FACTORS[energy.type].factor * amount);
    }, 0);
  } catch (error) {
    console.error("Error calculating energy emissions:", error);
    return 0;
  }
};

export const calculateTotalEmissions = (input: CalculationInput): CalculationResult => {
  try {
    console.log("Starting emissions calculation with input:", input);
    
    // Initialize with default values in case of errors
    const defaultResult: CalculationResult = {
      materialEmissions: 0,
      transportEmissions: 0,
      energyEmissions: 0,
      totalEmissions: 0,
      breakdownByMaterial: {} as Record<Material, number>,
      breakdownByTransport: {} as Record<Transport, number>,
      breakdownByEnergy: {} as Record<Energy, number>
    };
    
    // Validate input
    if (!input) {
      console.error("Calculation input is undefined or null");
      return defaultResult;
    }
    
    // Extract materials, transport, energy with defaults if missing
    const materials = input.materials || [];
    const transport = input.transport || [];
    const energy = input.energy || [];
    
    // Calculate emissions for each category
    const materialEmissions = calculateMaterialEmissions(materials);
    const transportEmissions = calculateTransportEmissions(transport);
    const energyEmissions = calculateEnergyEmissions(energy);
    
    console.log("Category emissions calculated:", { materialEmissions, transportEmissions, energyEmissions });
    
    const totalEmissions = materialEmissions + transportEmissions + energyEmissions;

    // Create material breakdown - ensure breakdownByMaterial is properly populated
    const breakdownByMaterial: Record<string, number> = {};
    
    materials.forEach(material => {
      if (material && material.type) {
        const materialType = material.type as Material;
        const factor = MATERIAL_FACTORS[materialType]?.factor || 0;
        
        if (factor) {
          const quantity = Number(material.quantity) || 0;
          const emissions = factor * quantity;
          
          // Make sure we convert the type to string to avoid issues with object keys
          const typeKey = String(materialType);
          console.log(`Adding to breakdownByMaterial: type=${typeKey}, emissions=${emissions}`);
          
          breakdownByMaterial[typeKey] = (breakdownByMaterial[typeKey] || 0) + emissions;
        } else {
          console.warn(`Missing factor for material type: ${materialType}`);
        }
      }
    });

    // Log the breakdown to verify it's populated
    console.log("Material breakdown:", breakdownByMaterial);
    console.log("Breakdown keys:", Object.keys(breakdownByMaterial));

    // Create transport breakdown
    const breakdownByTransport: Record<string, number> = {};
    
    transport.forEach(transport => {
      if (transport && transport.type) {
        const transportType = transport.type as Transport;
        const factor = TRANSPORT_FACTORS[transportType]?.factor || 0;
        
        if (factor) {
          const distance = Number(transport.distance) || 0;
          const weight = Number(transport.weight) || 0;
          const tonneKm = (weight / 1000) * distance;
          const emissions = factor * tonneKm;
          
          const typeKey = String(transportType);
          breakdownByTransport[typeKey] = (breakdownByTransport[typeKey] || 0) + emissions;
        }
      }
    });

    // Create energy breakdown
    const breakdownByEnergy: Record<string, number> = {};
    
    energy.forEach(energy => {
      if (energy && energy.type) {
        const energyType = energy.type as Energy;
        const factor = ENERGY_FACTORS[energyType]?.factor || 0;
        
        if (factor) {
          const amount = Number(energy.amount) || 0;
          const emissions = factor * amount;
          
          const typeKey = String(energyType);
          breakdownByEnergy[typeKey] = (breakdownByEnergy[typeKey] || 0) + emissions;
        }
      }
    });
    
    console.log("Calculation completed successfully");
    console.log("Final breakdown keys - Materials:", Object.keys(breakdownByMaterial).length);
    console.log("Final breakdown keys - Transport:", Object.keys(breakdownByTransport).length);
    console.log("Final breakdown keys - Energy:", Object.keys(breakdownByEnergy).length);

    return {
      materialEmissions,
      transportEmissions,
      energyEmissions,
      totalEmissions,
      breakdownByMaterial: breakdownByMaterial as Record<Material, number>,
      breakdownByTransport: breakdownByTransport as Record<Transport, number>,
      breakdownByEnergy: breakdownByEnergy as Record<Energy, number>
    };
  } catch (error) {
    console.error("Error in calculateTotalEmissions:", error);
    return {
      materialEmissions: 0,
      transportEmissions: 0,
      energyEmissions: 0,
      totalEmissions: 0,
      breakdownByMaterial: {} as Record<Material, number>,
      breakdownByTransport: {} as Record<Transport, number>,
      breakdownByEnergy: {} as Record<Energy, number>
    };
  }
};
