
/**
 * This file contains optimized calculation functions for carbon emissions
 * with improved memory management and batch processing for large datasets.
 * 
 * Optimizations include:
 * - Batch processing of large datasets
 * - Memory-efficient calculations
 * - Type-safety for better performance
 * - Improved error handling
 */

import { MaterialInput, TransportInput, EnergyInput } from "./carbonTypes";

export interface CalculationInput {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

export interface CalculationResult {
  totalEmissions: number;
  materialEmissions: number;
  transportEmissions: number;
  energyEmissions: number;
  breakdown: {
    materials: number;
    transport: number;
    energy: number;
  };
  breakdownByMaterial: Record<string, number>;
  breakdownByTransport: Record<string, number>;
  breakdownByEnergy: Record<string, number>;
}

// Material factors (kg CO2e per unit)
const materialFactors: { [key: string]: number } = {
  concrete: 0.15,
  steel: 2.00,
  wood: 0.05,
  glass: 1.00,
  insulation: 0.20,
};

// Transport factors (kg CO2e per km per tonne)
const transportFactors: { [key: string]: number } = {
  truck: 0.10,
  train: 0.03,
  ship: 0.01,
};

// Energy factors (kg CO2e per kWh)
const energyFactors: { [key: string]: number } = {
  electricity: 0.50,
  naturalGas: 0.20,
  renewableEnergy: 0.05,
};

/**
 * Optimized calculation of total emissions that can handle larger datasets
 * by processing data in batches and with improved memory usage
 */
export const calculateTotalEmissions = (input: CalculationInput): CalculationResult => {
  // Defensive validation of input
  if (!input) {
    console.error("Invalid calculation input: input is null or undefined");
    return getEmptyResult();
  }

  console.log("Starting emission calculation with input:", JSON.stringify(input, null, 2));
  
  try {
    // Materials calculation with batch processing
    const materialResults = processMaterialsInBatches(input.materials || []);
    
    // Transport calculation with batch processing
    const transportResults = processTransportInBatches(input.transport || []);
    
    // Energy calculation is typically small, so doesn't need batching
    const energyResults = calculateEnergyEmissions(input.energy || []);
    
    // Combine all results
    const totalEmissions = materialResults.total + transportResults.total + energyResults.total;
    
    // Create the final result object with detailed breakdowns
    return {
      totalEmissions,
      materialEmissions: materialResults.total,
      transportEmissions: transportResults.total,
      energyEmissions: energyResults.total,
      breakdown: {
        materials: materialResults.total / totalEmissions * 100 || 0,
        transport: transportResults.total / totalEmissions * 100 || 0,
        energy: energyResults.total / totalEmissions * 100 || 0
      },
      breakdownByMaterial: materialResults.breakdown,
      breakdownByTransport: transportResults.breakdown,
      breakdownByEnergy: energyResults.breakdown
    };
  } catch (error) {
    console.error("Error in calculation:", error);
    return getEmptyResult();
  }
};

/**
 * Process materials in batches to handle large datasets more efficiently
 */
export function processMaterialsInBatches(materials: MaterialInput[], batchSize = 100) {
  const result = {
    total: 0,
    breakdown: {} as Record<string, number>
  };
  
  // Process in batches
  for (let i = 0; i < materials.length; i += batchSize) {
    const batch = materials.slice(i, i + batchSize);
    
    for (const material of batch) {
      if (!material || !material.type) continue;
      
      // Ensure we have valid numbers
      const quantity = Number(material.quantity) || 0;
      if (quantity <= 0) continue;
      
      const factor = getMaterialFactor(material.type);
      const emissions = quantity * factor;
      
      result.total += emissions;
      result.breakdown[material.type] = (result.breakdown[material.type] || 0) + emissions;
    }
  }
  
  return result;
}

/**
 * Process transport in batches to handle large datasets more efficiently
 */
export function processTransportInBatches(transport: TransportInput[], batchSize = 100) {
  const result = {
    total: 0,
    breakdown: {} as Record<string, number>
  };
  
  // Process in batches
  for (let i = 0; i < transport.length; i += batchSize) {
    const batch = transport.slice(i, i + batchSize);
    
    for (const item of batch) {
      if (!item || !item.type) continue;
      
      // Ensure we have valid numbers
      const distance = Number(item.distance) || 0;
      const weight = Number(item.weight) || 0;
      if (distance <= 0 || weight <= 0) continue;
      
      const factor = getTransportFactor(item.type);
      const emissions = distance * weight * factor / 1000; // Convert to appropriate units
      
      result.total += emissions;
      result.breakdown[item.type] = (result.breakdown[item.type] || 0) + emissions;
    }
  }
  
  return result;
}

/**
 * Calculate energy emissions (typically a smaller dataset)
 */
export function calculateEnergyEmissions(energy: EnergyInput[]) {
  const result = {
    total: 0,
    breakdown: {} as Record<string, number>
  };
  
  for (const item of energy) {
    if (!item || !item.type) continue;
    
    // Ensure we have valid numbers
    const amount = Number(item.amount) || 0;
    if (amount <= 0) continue;
    
    const factor = getEnergyFactor(item.type);
    const emissions = amount * factor;
    
    result.total += emissions;
    result.breakdown[item.type] = (result.breakdown[item.type] || 0) + emissions;
  }
  
  return result;
}

/**
 * Get an empty result object for error cases
 */
function getEmptyResult(): CalculationResult {
  return {
    totalEmissions: 0,
    materialEmissions: 0,
    transportEmissions: 0,
    energyEmissions: 0,
    breakdown: {
      materials: 0,
      transport: 0,
      energy: 0
    },
    breakdownByMaterial: {},
    breakdownByTransport: {},
    breakdownByEnergy: {}
  };
}

// Helper functions to get factors
const getMaterialFactor = (type: string): number => {
  return materialFactors[type] || 0;
};

const getTransportFactor = (type: string): number => {
  return transportFactors[type] || 0;
};

const getEnergyFactor = (type: string): number => {
  return energyFactors[type] || 0;
};
