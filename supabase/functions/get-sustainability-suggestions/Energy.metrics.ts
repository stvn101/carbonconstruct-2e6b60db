import { EnergyItem, SustainableEnergy, EnergySource as _EnergySource, EnergyUnit as _EnergyUnit } from './Energy.ts';

/**
 * Interface for detailed energy metrics
 */
export interface EnergyMetrics {
  totalEnergyItems: number;
  totalConsumption: number;
  averageCarbonIntensity: number;
  renewablePercentage: number;
  energyEfficiency: number;
  peakDemandReduction: number;
  energyBySource: Record<string, number>;
  energyByUnit: Record<string, number>;
  costPerUnitAverage?: number;
  storageCapacity?: number;
  gridDependency?: number;
  smartMonitoringPercentage?: number;
  demandResponseCapability?: number;
  backupSystemCoverage?: number;
  timeOfUseOptimization?: number;
}

/**
 * Calculate detailed energy metrics
 */
export function calculateDetailedEnergyMetrics(energy: (EnergyItem | SustainableEnergy)[]): EnergyMetrics {
  if (!energy || energy.length === 0) {
    return {
      totalEnergyItems: 0,
      totalConsumption: 0,
      averageCarbonIntensity: 0,
      renewablePercentage: 0,
      energyEfficiency: 0,
      peakDemandReduction: 0,
      energyBySource: {},
      energyByUnit: {}
    };
  }

  // Count total energy items
  const totalEnergyItems = energy.length;

  // Calculate total consumption
  const energyWithConsumption = energy.filter(e => 
    'consumption' in e && typeof e.consumption === 'number'
  );
  const totalConsumption = energyWithConsumption.reduce((sum, e) => 
    sum + (e.consumption as number), 0);

  // Calculate average carbon intensity
  const energyWithCarbonIntensity = energy.filter(e => 
    'carbonIntensity' in e && typeof e.carbonIntensity === 'number'
  );
  const averageCarbonIntensity = energyWithCarbonIntensity.length > 0
    ? energyWithCarbonIntensity.reduce((sum, e) => sum + (e.carbonIntensity as number), 0) / energyWithCarbonIntensity.length
    : 0;

  // Calculate renewable percentage
  const renewableEnergyCount = energy.filter(e => 
    ('renewable' in e && e.renewable === true) ||
    ('source' in e && typeof e.source === 'string' && 
      ['solar', 'wind', 'geothermal', 'biomass', 'hydro'].some(r => e.source.toLowerCase().includes(r)))
  ).length;
  const renewablePercentage = (renewableEnergyCount / totalEnergyItems) * 100;

  // Calculate energy efficiency
  const energyWithEfficiency = energy.filter(e => 
    'efficiency' in e && typeof e.efficiency === 'number'
  );
  const energyEfficiency = energyWithEfficiency.length > 0
    ? energyWithEfficiency.reduce((sum, e) => sum + (e.efficiency as number), 0) / energyWithEfficiency.length
    : 0;

  // Calculate peak demand reduction
  const energyWithPeakDemand = energy.filter(e => 
    'peakDemand' in e && typeof e.peakDemand === 'number'
  );
  // Assume a baseline peak demand of 1.0 for simplicity
  const peakDemandReduction = energyWithPeakDemand.length > 0
    ? 1.0 - (energyWithPeakDemand.reduce((sum, e) => sum + (e.peakDemand as number), 0) / energyWithPeakDemand.length)
    : 0;

  // Count energy by source
  const energyBySource: Record<string, number> = {};
  energy.forEach(e => {
    if ('source' in e && typeof e.source === 'string') {
      if ('consumption' in e && typeof e.consumption === 'number') {
        energyBySource[e.source] = (energyBySource[e.source] || 0) + e.consumption;
      } else {
        energyBySource[e.source] = (energyBySource[e.source] || 0) + 1;
      }
    }
  });

  // Count energy by unit
  const energyByUnit: Record<string, number> = {};
  energy.forEach(e => {
    if ('unit' in e && typeof e.unit === 'string' && 'consumption' in e && typeof e.consumption === 'number') {
      energyByUnit[e.unit] = (energyByUnit[e.unit] || 0) + e.consumption;
    }
  });

  // Calculate cost per unit average if available
  let costPerUnitAverage: number | undefined;
  const energyWithCost = energy.filter(e => 
    'costPerUnit' in e && typeof e.costPerUnit === 'number'
  );
  if (energyWithCost.length > 0) {
    costPerUnitAverage = energyWithCost.reduce((sum, e) => sum + (e.costPerUnit as number), 0) / energyWithCost.length;
  }

  // Calculate storage capacity if available
  let storageCapacity: number | undefined;
  const energyWithStorage = energy.filter(e => 
    'storageCapacity' in e && typeof e.storageCapacity === 'number'
  );
  if (energyWithStorage.length > 0) {
    storageCapacity = energyWithStorage.reduce((sum, e) => sum + (e.storageCapacity as number), 0);
  }

  // Calculate grid dependency if available
  let gridDependency: number | undefined;
  if (totalConsumption > 0) {
    const gridEnergy = energy.filter(e => 
      'source' in e && typeof e.source === 'string' && e.source.toLowerCase() === 'grid' &&
      'consumption' in e && typeof e.consumption === 'number'
    );
    const gridConsumption = gridEnergy.reduce((sum, e) => sum + (e.consumption as number), 0);
    gridDependency = (gridConsumption / totalConsumption) * 100;
  }

  // Calculate smart monitoring percentage if available
  let smartMonitoringPercentage: number | undefined;
  const energyWithSmartMonitoring = energy.filter(e => 
    'smartMonitoring' in e && e.smartMonitoring === true
  ).length;
  if (energyWithSmartMonitoring > 0) {
    smartMonitoringPercentage = (energyWithSmartMonitoring / totalEnergyItems) * 100;
  }

  // Calculate demand response capability if available
  let demandResponseCapability: number | undefined;
  const energyWithDemandResponse = energy.filter(e => 
    'demandResponse' in e && e.demandResponse === true
  ).length;
  if (energyWithDemandResponse > 0) {
    demandResponseCapability = (energyWithDemandResponse / totalEnergyItems) * 100;
  }

  // Calculate backup system coverage if available
  let backupSystemCoverage: number | undefined;
  const energyWithBackupSystem = energy.filter(e => 
    'backupSystem' in e && e.backupSystem === true
  ).length;
  if (energyWithBackupSystem > 0) {
    backupSystemCoverage = (energyWithBackupSystem / totalEnergyItems) * 100;
  }

  // Calculate time of use optimization if available
  let timeOfUseOptimization: number | undefined;
  const energyWithTimeOfUse = energy.filter(e => 
    'timeOfUse' in e && typeof e.timeOfUse === 'string' &&
    ['off-peak', 'night', 'weekend'].some(t => (e.timeOfUse as string).toLowerCase().includes(t))
  ).length;
  if (timeOfUseOptimization !== undefined) {
    timeOfUseOptimization = (energyWithTimeOfUse / totalEnergyItems) * 100;
  }

  return {
    totalEnergyItems,
    totalConsumption,
    averageCarbonIntensity,
    renewablePercentage,
    energyEfficiency,
    peakDemandReduction,
    energyBySource,
    energyByUnit,
    costPerUnitAverage,
    storageCapacity,
    gridDependency,
    smartMonitoringPercentage,
    demandResponseCapability,
    backupSystemCoverage,
    timeOfUseOptimization
  };
}

/**
 * Identify energy efficiency opportunities
 */
export function identifyEnergyEfficiencyOpportunities(energy: (EnergyItem | SustainableEnergy)[]): {
  area: string;
  potentialSavings: number;
  investmentRequired?: number;
  paybackPeriod?: number;
  implementationComplexity?: string;
  cobenefits?: string[];
}[] {
  if (!energy || energy.length === 0) return [];

  const opportunities: {
    area: string;
    potentialSavings: number;
    investmentRequired?: number;
    paybackPeriod?: number;
    implementationComplexity?: string;
    cobenefits?: string[];
  }[] = [];

  // Check for high consumption non-renewable sources
  const highConsumptionNonRenewable = energy.filter(e => 
    'consumption' in e && typeof e.consumption === 'number' && e.consumption > 1000 &&
    (!('renewable' in e) || e.renewable !== true) &&
    'source' in e && typeof e.source === 'string' && 
    !['solar', 'wind', 'geothermal', 'biomass', 'hydro'].some(r => e.source.toLowerCase().includes(r))
  );

  if (highConsumptionNonRenewable.length > 0) {
    opportunities.push({
      area: "Renewable Energy Integration",
      potentialSavings: 0.4,
      investmentRequired: 50000,
      paybackPeriod: 5,
      implementationComplexity: "Moderate",
      cobenefits: ["Reduced carbon emissions", "Energy independence", "Regulatory compliance"]
    });
  }

  // Check for low efficiency equipment
  const lowEfficiencyEquipment = energy.filter(e => 
    'efficiency' in e && typeof e.efficiency === 'number' && e.efficiency < 0.7
  );

  if (lowEfficiencyEquipment.length > 0) {
    opportunities.push({
      area: "Equipment Upgrades",
      potentialSavings: 0.25,
      investmentRequired: 30000,
      paybackPeriod: 3,
      implementationComplexity: "Moderate",
      cobenefits: ["Reduced maintenance costs", "Improved reliability", "Extended equipment life"]
    });
  }

  // Check for high peak demand
  const highPeakDemand = energy.filter(e => 
    'peakDemand' in e && typeof e.peakDemand === 'number' && e.peakDemand > 0.8
  );

  if (highPeakDemand.length > 0) {
    opportunities.push({
      area: "Peak Demand Management",
      potentialSavings: 0.2,
      investmentRequired: 15000,
      paybackPeriod: 2,
      implementationComplexity: "Simple",
      cobenefits: ["Reduced utility demand charges", "Grid stability", "Avoided capacity upgrades"]
    });
  }

  // Check for lack of smart monitoring
  const lackSmartMonitoring = energy.filter(e => 
    !('smartMonitoring' in e) || e.smartMonitoring !== true
  );

  if (lackSmartMonitoring.length > energy.length * 0.5) {
    opportunities.push({
      area: "Energy Monitoring Systems",
      potentialSavings: 0.15,
      investmentRequired: 20000,
      paybackPeriod: 2.5,
      implementationComplexity: "Simple",
      cobenefits: ["Real-time energy visibility", "Anomaly detection", "Behavior change enablement"]
    });
  }

  // Check for lack of storage capacity
  const lackStorageCapacity = energy.filter(e => 
    !('storageCapacity' in e) || typeof e.storageCapacity !== 'number' || e.storageCapacity < 10
  );

  if (lackStorageCapacity.length > energy.length * 0.7) {
    opportunities.push({
      area: "Energy Storage Implementation",
      potentialSavings: 0.3,
      investmentRequired: 40000,
      paybackPeriod: 6,
      implementationComplexity: "Complex",
      cobenefits: ["Resilience during outages", "Renewable energy optimization", "Demand charge reduction"]
    });
  }

  // Add standard opportunities if specific ones are limited
  if (opportunities.length < 3) {
    opportunities.push({
      area: "Lighting Systems",
      potentialSavings: 0.3,
      investmentRequired: 10000,
      paybackPeriod: 2,
      implementationComplexity: "Simple",
      cobenefits: ["Improved lighting quality", "Reduced maintenance", "Occupant comfort"]
    });

    opportunities.push({
      area: "HVAC Optimization",
      potentialSavings: 0.25,
      investmentRequired: 25000,
      paybackPeriod: 3.5,
      implementationComplexity: "Moderate",
      cobenefits: ["Improved comfort", "Better air quality", "Extended equipment life"]
    });
  }

  return opportunities;
}

/**
 * Calculate peak demand reduction potential
 */
export function calculatePeakDemandReductionPotential(energy: (EnergyItem | SustainableEnergy)[]): {
  overallPotential: number;
  costSavingsPotential: number;
  implementationApproaches: {
    approach: string;
    potentialReduction: number;
    implementationCost: string;
    complexity: string;
  }[];
  recommendedActions: string[];
} {
  if (!energy || energy.length === 0) {
    return {
      overallPotential: 0,
      costSavingsPotential: 0,
      implementationApproaches: [],
      recommendedActions: []
    };
  }

  // Calculate overall potential based on current peak demand
  const energyWithPeakDemand = energy.filter(e => 
    'peakDemand' in e && typeof e.peakDemand === 'number'
  );
  
  const averagePeakDemand = energyWithPeakDemand.length > 0
    ? energyWithPeakDemand.reduce((sum, e) => sum + (e.peakDemand as number), 0) / energyWithPeakDemand.length
    : 0.8; // Default assumption if no peak demand data
  
  const overallPotential = Math.min(0.5, Math.max(0.1, averagePeakDemand * 0.4));
  
  // Calculate cost savings potential (typically 10-20% of energy costs)
  const costSavingsPotential = overallPotential * 1.5;
  
  // Define implementation approaches
  const implementationApproaches = [
    {
      approach: "Load Shifting",
      potentialReduction: overallPotential * 0.6,
      implementationCost: "Low",
      complexity: "Moderate"
    },
    {
      approach: "Energy Storage",
      potentialReduction: overallPotential * 0.8,
      implementationCost: "High",
      complexity: "Complex"
    },
    {
      approach: "Demand Response Programs",
      potentialReduction: overallPotential * 0.5,
      implementationCost: "Low",
      complexity: "Simple"
    },
    {
      approach: "Peak-Aware Equipment Scheduling",
      potentialReduction: overallPotential * 0.4,
      implementationCost: "Medium",
      complexity: "Moderate"
    }
  ];
  
  // Generate recommended actions based on energy profile
  const recommendedActions: string[] = [];
  
  // Check for high peak demand
  if (averagePeakDemand > 0.7) {
    recommendedActions.push("Implement an automated load management system to monitor and control peak demand");
  }
  
  // Check for storage capacity
  const hasStorageCapacity = energy.some(e => 
    'storageCapacity' in e && typeof e.storageCapacity === 'number' && e.storageCapacity > 0
  );
  if (!hasStorageCapacity) {
    recommendedActions.push("Install energy storage systems to offset peak demand periods");
  }
  
  // Check for demand response capability
  const hasDemandResponse = energy.some(e => 
    'demandResponse' in e && e.demandResponse === true
  );
  if (!hasDemandResponse) {
    recommendedActions.push("Enroll in utility demand response programs to receive incentives for reducing peak demand");
  }
  
  // Check for time-of-use optimization
  const hasTimeOfUseOptimization = energy.some(e => 
    'timeOfUse' in e && typeof e.timeOfUse === 'string' &&
    ['off-peak', 'night', 'weekend'].some(t => (e.timeOfUse as string).toLowerCase().includes(t))
  );
  if (!hasTimeOfUseOptimization) {
    recommendedActions.push("Shift energy-intensive operations to off-peak hours to reduce demand charges");
  }
  
  // Add general recommendations if specific ones are limited
  if (recommendedActions.length < 3) {
    recommendedActions.push("Conduct a detailed peak demand analysis to identify specific reduction opportunities");
    recommendedActions.push("Implement smart controls for major energy-consuming equipment to prevent simultaneous operation");
  }

  return {
    overallPotential,
    costSavingsPotential,
    implementationApproaches,
    recommendedActions
  };
}

/**
 * Calculate energy lifecycle assessment
 */
export function calculateEnergyLifecycleAssessment(energy: (EnergyItem | SustainableEnergy)[]): {
  generationEmissions: number;
  transmissionLosses: number;
  endUseEfficiency: number;
  totalLifecycleEmissions: number;
  renewablePercentage: number;
  embodiedEnergy: number;
  hotspots: string[];
  improvementPotential: number;
} {
  if (!energy || energy.length === 0) {
    return {
      generationEmissions: 0,
      transmissionLosses: 0,
      endUseEfficiency: 0,
      totalLifecycleEmissions: 0,
      renewablePercentage: 0,
      embodiedEnergy: 0,
      hotspots: [],
      improvementPotential: 0
    };
  }

  // Calculate generation emissions
  const energyWithCarbonIntensity = energy.filter(e => 
    'carbonIntensity' in e && typeof e.carbonIntensity === 'number' &&
    'consumption' in e && typeof e.consumption === 'number'
  );
  
  const generationEmissions = energyWithCarbonIntensity.reduce((sum, e) => 
    sum + ((e.carbonIntensity as number) * (e.consumption as number)), 0);
  
  // Estimate transmission losses (typically 5-10% of total energy)
  const totalConsumption = energy.reduce((sum, e) => 
    sum + (('consumption' in e && typeof e.consumption === 'number') ? e.consumption : 0), 0);
  
  const transmissionLosses = totalConsumption * 0.08; // Assume 8% transmission losses
  
  // Calculate end use efficiency
  const energyWithEfficiency = energy.filter(e => 
    'efficiency' in e && typeof e.efficiency === 'number'
  );
  
  const endUseEfficiency = energyWithEfficiency.length > 0
    ? energyWithEfficiency.reduce((sum, e) => sum + (e.efficiency as number), 0) / energyWithEfficiency.length
    : 0.7; // Default assumption if no efficiency data
  
  // Calculate total lifecycle emissions (including embodied energy)
  const embodiedEnergyFactor = 0.15; // Assume embodied energy is 15% of operational energy
  const embodiedEnergy = totalConsumption * embodiedEnergyFactor;
  
  const totalLifecycleEmissions = generationEmissions + (transmissionLosses * 0.5) + (embodiedEnergy * 0.4);
  
  // Calculate renewable percentage
  const renewableEnergyConsumption = energy.reduce((sum, e) => {
    if (('renewable' in e && e.renewable === true) || 
        ('source' in e && typeof e.source === 'string' && 
         ['solar', 'wind', 'geothermal', 'biomass', 'hydro'].some(r => e.source.toLowerCase().includes(r)))) {
      return sum + (('consumption' in e && typeof e.consumption === 'number') ? e.consumption : 0);
    }
    return sum;
  }, 0);
  
  const renewablePercentage = totalConsumption > 0 ? (renewableEnergyConsumption / totalConsumption) * 100 : 0;
  
  // Identify hotspots
  const hotspots: string[] = [];
  
  // Check non-renewable sources
  const nonRenewablePercentage = 100 - renewablePercentage;
  if (nonRenewablePercentage > 70) {
    hotspots.push("High dependence on non-renewable energy sources");
  }
  
  // Check efficiency
  if (endUseEfficiency < 0.7) {
    hotspots.push("Low end-use energy efficiency");
  }
  
  // Check for high carbon intensity sources
  const highCarbonSources = energy.filter(e => 
    'carbonIntensity' in e && typeof e.carbonIntensity === 'number' && e.carbonIntensity > 0.7
  );
  if (highCarbonSources.length > 0) {
    hotspots.push("High carbon intensity energy sources");
  }
  
  // Check for peak demand issues
  const highPeakDemand = energy.filter(e => 
    'peakDemand' in e && typeof e.peakDemand === 'number' && e.peakDemand > 0.8
  );
  if (highPeakDemand.length > 0) {
    hotspots.push("High peak demand periods");
  }
  
  // Add general hotspot if specific ones are limited
  if (hotspots.length === 0) {
    hotspots.push("Overall energy system optimization");
  }
  
  // Calculate improvement potential
  const improvementPotential = (1 - (renewablePercentage / 100)) * 0.6 + (1 - endUseEfficiency) * 0.4;

  return {
    generationEmissions,
    transmissionLosses,
    endUseEfficiency,
    totalLifecycleEmissions,
    renewablePercentage,
    embodiedEnergy,
    hotspots,
    improvementPotential
  };
}
