
import { CalculationResult as ExportsCalculationResult } from '@/lib/carbonExports';
import { CalculationResult as CalcCalculationResult } from '@/lib/carbonCalculations';

/**
 * Adapts a calculation result object to ensure it contains all required fields
 * for both carbonExports.CalculationResult and carbonCalculations.CalculationResult
 */
export const adaptCalculationResult = (result: any): ExportsCalculationResult => {
  return {
    totalCO2: result.totalCO2 || result.totalEmissions || 0,
    totalEmissions: result.totalEmissions || 0, 
    breakdownByCategory: result.breakdownByCategory || {},
    breakdownByMaterial: result.breakdownByMaterial || {},
    breakdownByTransport: result.breakdownByTransport || {},
    breakdownByEnergy: result.breakdownByEnergy || {},
    sustainabilityScore: result.sustainabilityScore || 0,
    materialEmissions: result.materialEmissions || 0,
    transportEmissions: result.transportEmissions || 0,
    energyEmissions: result.energyEmissions || 0,
    breakdown: result.breakdown || {
      materials: result.materialEmissions || 0,
      transport: result.transportEmissions || 0, 
      energy: result.energyEmissions || 0
    },
    timestamp: result.timestamp || new Date().toISOString()
  };
};

/**
 * Ensures transport type compatibility between different interfaces
 */
export const ensureTransportType = (transport: any[]): any[] => {
  return transport.map(item => ({
    ...item,
    type: item.type || item.mode,
    mode: item.mode || item.type
  }));
};
