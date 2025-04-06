
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
