import { EnergyItem, SustainableEnergy, EnergySource, EnergyUnit } from './Energy.ts';

/**
 * Calculate total energy consumption across all energy items
 */
export function calculateTotalEnergyConsumption(
  energyItems: EnergyItem[]
): { total: number; unit: EnergyUnit } {
  if (!energyItems || energyItems.length === 0) {
    return { total: 0, unit: EnergyUnit.KWH };
  }
  
  // Convert all energy to kWh for consistent calculation
  let totalKwh = 0;
  
  energyItems.forEach(item => {
    let itemKwh = item.quantity;
    
    // Convert to kWh based on unit
    switch(item.unit) {
      case EnergyUnit.MWH:
        itemKwh = item.quantity * 1000; // 1 MWh = 1000 kWh
        break;
      case EnergyUnit.LITER:
        // Diesel conversion - approximate 10 kWh per liter
        if (item.source === EnergySource.DIESEL_GENERATOR) {
          itemKwh = item.quantity * 10;
        }
        break;
      case EnergyUnit.M3:
        // Natural gas conversion - approximate 10 kWh per m3
        itemKwh = item.quantity * 10;
        break;
      case EnergyUnit.KWH:
      default:
        // Already in kWh
        break;
    }
    
    totalKwh += itemKwh;
  });
  
  return { total: totalKwh, unit: EnergyUnit.KWH };
}

/**
 * Calculate percentage of renewable energy used
 */
export function calculateRenewablePercentage(
  energyItems: EnergyItem[]
): number {
  if (!energyItems || energyItems.length === 0) return 0;
  
  const consumption = calculateTotalEnergyConsumption(energyItems);
  
  if (consumption.total === 0) return 0;
  
  // Calculate renewable energy in kWh
  let renewableKwh = 0;
  
  energyItems.forEach(item => {
    // Only count renewable sources
    if (item.source === EnergySource.SOLAR || 
        item.source === EnergySource.WIND || 
        item.source === EnergySource.BATTERY) {
      
      let itemKwh = item.quantity;
      
      // Convert to kWh based on unit
      switch(item.unit) {
        case EnergyUnit.MWH:
          itemKwh = item.quantity * 1000; // 1 MWh = 1000 kWh
          break;
        case EnergyUnit.KWH:
          // Already in kWh
          break;
        default:
          // Other units don't apply to renewables in this simplified model
          itemKwh = 0;
          break;
      }
      
      renewableKwh += itemKwh;
    }
  });
  
  return (renewableKwh / consumption.total) * 100;
}

/**
 * Calculate potential peak demand reduction
 */
export function calculatePeakDemandReductionPotential(
  energyItems: EnergyItem[]
): number {
  if (!energyItems || energyItems.length === 0) return 0;
  
  // This is a simplified calculation
  // In a real scenario, this would analyze time-of-use patterns
  
  // Check if there are already battery storage systems
  const hasBatteryStorage = energyItems.some(item => item.source === EnergySource.BATTERY);
  
  // Calculate grid energy percentage
  const gridItems = energyItems.filter(item => item.source === EnergySource.GRID);
  const consumption = calculateTotalEnergyConsumption(energyItems);
  const gridConsumption = calculateTotalEnergyConsumption(gridItems);
  
  const gridPercentage = consumption.total > 0 ? 
    (gridConsumption.total / consumption.total) * 100 : 0;
  
  // Estimate peak reduction potential
  if (hasBatteryStorage) {
    // With existing batteries, less additional potential
    return Math.min(15, gridPercentage * 0.2);
  } else {
    // Without batteries, higher potential
    return Math.min(30, gridPercentage * 0.3);
  }
}

/**
 * Identify energy efficiency opportunities
 */
export function identifyEnergyEfficiencyOpportunities(
  energyItems: EnergyItem[]
): SustainableEnergy[] {
  if (!energyItems || energyItems.length === 0) return [];
  
  const opportunities: SustainableEnergy[] = [];
  
  // Look for non-renewable energy sources to replace
  energyItems.forEach(item => {
    if (item.source === EnergySource.GRID) {
      // Suggest solar for grid electricity
      opportunities.push({
        ...item,
        id: `opt-${item.id}-solar`,
        source: EnergySource.SOLAR,
        emissionsFactor: item.emissionsFactor * 0.05, // 95% reduction
        sustainabilityScore: 95,
        alternativeTo: item.id,
        carbonReduction: 95,
        costDifference: 20, // Higher upfront cost
        implementationComplexity: 'moderate'
      });
      
      // Suggest battery storage
      opportunities.push({
        ...item,
        id: `opt-${item.id}-battery`,
        source: EnergySource.BATTERY,
        quantity: item.quantity * 0.3, // Size for 30% of consumption
        emissionsFactor: 0,
        sustainabilityScore: 90,
        alternativeTo: item.id,
        carbonReduction: 30, // For peak shaving
        costDifference: 25,
        implementationComplexity: 'moderate'
      });
    }
    
    if (item.source === EnergySource.DIESEL_GENERATOR) {
      // Suggest hydrogen fuel cell
      opportunities.push({
        ...item,
        id: `opt-${item.id}-hydrogen`,
        source: EnergySource.HYDROGEN,
        emissionsFactor: item.emissionsFactor * 0.1, // 90% reduction
        sustainabilityScore: 85,
        alternativeTo: item.id,
        carbonReduction: 90,
        costDifference: 40, // Significantly higher cost
        implementationComplexity: 'complex'
      });
      
      // Suggest hybrid system with solar
      opportunities.push({
        ...item,
        id: `opt-${item.id}-hybrid`,
        source: EnergySource.SOLAR,
        quantity: item.quantity * 0.7, // 70% solar, 30% diesel remains
        emissionsFactor: item.emissionsFactor * 0.3,
        sustainabilityScore: 80,
        alternativeTo: item.id,
        carbonReduction: 70,
        costDifference: 15,
        implementationComplexity: 'moderate'
      });
    }
  });
  
  return opportunities;
}
