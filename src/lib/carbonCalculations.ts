
import { MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from './carbonFactors';
import { MaterialInput, TransportInput, EnergyInput, CalculationResult } from './carbonTypes';

/**
 * Calculate total emissions from all inputs
 */
export function calculateTotalEmissions(materials: MaterialInput[], transport: TransportInput[], energy: number): number {
  const materialsTotal = materials.reduce((sum, item) => sum + (item.quantity * MATERIAL_FACTORS[item.type] || 0), 0);
  const transportTotal = transport.reduce((sum, item) => sum + (item.distance * TRANSPORT_FACTORS[item.type] || 0), 0);
  const energyTotal = energy * ENERGY_FACTORS.electricity || 0;
  
  return materialsTotal + transportTotal + energyTotal;
}

/**
 * Process materials in batches to prevent UI blocking
 */
export function processMaterialsInBatches(materials: MaterialInput[]): CalculationResult[] {
  const BATCH_SIZE = 100;
  const results: CalculationResult[] = [];
  
  for (let i = 0; i < materials.length; i += BATCH_SIZE) {
    const batch = materials.slice(i, i + BATCH_SIZE);
    batch.forEach(material => {
      results.push({
        type: material.type,
        quantity: material.quantity,
        emissions: material.quantity * (MATERIAL_FACTORS[material.type] || 0)
      });
    });
  }
  
  return results;
}

/**
 * Process transport calculations in batches
 */
export function processTransportInBatches(transport: TransportInput[]): CalculationResult[] {
  const BATCH_SIZE = 50;
  const results: CalculationResult[] = [];
  
  for (let i = 0; i < transport.length; i += BATCH_SIZE) {
    const batch = transport.slice(i, i + BATCH_SIZE);
    batch.forEach(item => {
      results.push({
        type: item.type,
        quantity: item.distance,
        emissions: item.distance * (TRANSPORT_FACTORS[item.type] || 0)
      });
    });
  }
  
  return results;
}

/**
 * Calculate emissions from energy usage
 */
export function calculateEnergyEmissions(energy: number): number {
  return energy * ENERGY_FACTORS.electricity || 0;
}
