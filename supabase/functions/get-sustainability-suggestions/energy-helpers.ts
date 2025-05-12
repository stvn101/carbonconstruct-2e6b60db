/**
 * Energy-related helper functions for sustainability analysis
 * 
 * This module provides utility functions for analyzing energy data,
 * calculating consumption metrics, and generating recommendations
 * for sustainable energy use in construction projects.
 */

import type { EnergyItem, SustainableEnergy } from 'interfaces/energy';

/**
 * Calculate the total energy consumption across all energy items
 * 
 * @param energy Array of energy data
 * @returns Total energy consumption
 */
export function calculateTotalEnergyConsumption(energy: (EnergyItem | SustainableEnergy)[]): number {
  return energy.reduce((total, e) => 
    total + (('consumption' in e && typeof e.consumption === 'number') ? e.consumption : 0), 0);
}

/**
 * Calculate the percentage of renewable energy sources
 * 
 * @param energy Array of energy data
 * @returns Percentage of renewable energy
 */
export function calculateRenewablePercentage(energy: (EnergyItem | SustainableEnergy)[]): number {
  if (energy.length === 0) return 0;
  
  const renewableEnergyCount = energy.filter(e => 
    ('renewable' in e && e.renewable === true) ||
    ('source' in e && typeof e.source === 'string' && 
      ['solar', 'wind', 'geothermal', 'biomass'].some(r => e.source.toLowerCase().includes(r)))
  ).length;
  
  return (renewableEnergyCount / energy.length) * 100;
}

/**
 * Calculate the potential for peak demand reduction
 * 
 * @param energy Array of energy data
 * @returns Potential reduction factor (0-1)
 */
export function calculatePeakDemandReductionPotential(energy: (EnergyItem | SustainableEnergy)[]): number {
  // Count energy items with high peak demand
  const highPeakDemandCount = energy.filter(e => 
    'peakDemand' in e && typeof e.peakDemand === 'number' && e.peakDemand > 0.7).length;
  
  // Count energy items with smart monitoring or demand response
  const smartEnergyCount = energy.filter(e => 
    ('smartMonitoring' in e && e.smartMonitoring === true) ||
    ('demandResponse' in e && e.demandResponse === true)).length;
  
  if (energy.length === 0) return 0;
  
  // Calculate potential based on high peak demand items without smart features
  const potentialReduction = (highPeakDemandCount - smartEnergyCount) / energy.length * 0.4;
  return Math.max(0, Math.min(0.5, potentialReduction));
}

/**
 * Identify energy efficiency opportunities
 * 
 * @param energy Array of energy data
 * @returns Array of efficiency opportunities with details
 */
export function identifyEnergyEfficiencyOpportunities(energy: (EnergyItem | SustainableEnergy)[]): {
  area: string;
  potentialSavings: number;
  investmentRequired?: number;
  paybackPeriod?: number;
}[] {
  // In a real implementation, this would analyze energy data to identify specific opportunities
  // For now, we'll return standard opportunities
  
  const opportunities = [
    {
      area: "Lighting",
      potentialSavings: 0.3,
      investmentRequired: 5000,
      paybackPeriod: 2.5
    },
    {
      area: "HVAC",
      potentialSavings: 0.25,
      investmentRequired: 12000,
      paybackPeriod: 4
    },
    {
      area: "Equipment",
      potentialSavings: 0.2,
      investmentRequired: 8000,
      paybackPeriod: 3
    }
  ];
  
  // If we have energy data, we can customize the opportunities
  if (energy.length > 0) {
    // Check if there's a high proportion of non-renewable energy
    const renewablePercentage = calculateRenewablePercentage(energy);
    if (renewablePercentage < 30) {
      opportunities.push({
        area: "Renewable Energy Installation",
        potentialSavings: 0.4,
        investmentRequired: 25000,
        paybackPeriod: 6
      });
    }
    
    // Check if there's a high average carbon intensity
    const averageCarbonIntensity = calculateAverageCarbonIntensity(energy);
    if (averageCarbonIntensity > 0.6) {
      opportunities.push({
        area: "Low-Carbon Energy Sources",
        potentialSavings: 0.35,
        investmentRequired: 15000,
        paybackPeriod: 5
      });
    }
  }
  
  return opportunities;
}

/**
 * Calculate the average carbon intensity of energy sources
 * 
 * @param energy Array of energy data
 * @returns Average carbon intensity
 */
export function calculateAverageCarbonIntensity(energy: (EnergyItem | SustainableEnergy)[]): number {
  const energyWithCarbonIntensity = energy.filter(e => 
    'carbonIntensity' in e && typeof e.carbonIntensity === 'number');
  
  if (energyWithCarbonIntensity.length === 0) return 0;
  
  const totalCarbonIntensity = energyWithCarbonIntensity.reduce((total, e) => 
    total + ('carbonIntensity' in e && typeof e.carbonIntensity === 'number' ? e.carbonIntensity : 0), 0);
  
  return totalCarbonIntensity / energyWithCarbonIntensity.length;
}

/**
 * Calculate the overall energy efficiency
 * 
 * @param energy Array of energy data
 * @returns Average efficiency (0-1)
 */
export function calculateEnergyEfficiency(energy: (EnergyItem | SustainableEnergy)[]): number {
  const energyWithEfficiency = energy.filter(e => 
    'efficiency' in e && typeof e.efficiency === 'number');
  
  if (energyWithEfficiency.length === 0) return 0;
  
  const totalEfficiency = energyWithEfficiency.reduce((total, e) => 
    total + ('efficiency' in e && typeof e.efficiency === 'number' ? e.efficiency : 0), 0);
  
  return totalEfficiency / energyWithEfficiency.length;
}

/**
 * Group energy items by source
 * 
 * @param energy Array of energy data
 * @returns Object with energy consumption by source
 */
export function groupEnergyBySource(energy: (EnergyItem | SustainableEnergy)[]): Record<string, number> {
  const sources: Record<string, number> = {};
  
  energy.forEach(e => {
    if ('source' in e && typeof e.source === 'string' && 
        'consumption' in e && typeof e.consumption === 'number') {
      const source = e.source.toLowerCase();
      sources[source] = (sources[source] || 0) + e.consumption;
    }
  });
  
  return sources;
}

/**
 * Group energy items by unit
 * 
 * @param energy Array of energy data
 * @returns Object with energy consumption by unit
 */
export function groupEnergyByUnit(energy: (EnergyItem | SustainableEnergy)[]): Record<string, number> {
  const units: Record<string, number> = {};
  
  energy.forEach(e => {
    if ('unit' in e && typeof e.unit === 'string' && 
        'consumption' in e && typeof e.consumption === 'number') {
      const unit = e.unit.toLowerCase();
      units[unit] = (units[unit] || 0) + e.consumption;
    } else if ('consumption' in e && typeof e.consumption === 'number') {
      // Default unit if not specified
      const unit = 'kWh';
      units[unit] = (units[unit] || 0) + e.consumption;
    }
  });
  
  return units;
}

/**
 * Calculate the percentage of energy with smart monitoring
 * 
 * @param energy Array of energy data
 * @returns Percentage with smart monitoring
 */
export function calculateSmartMonitoringPercentage(energy: (EnergyItem | SustainableEnergy)[]): number {
  if (energy.length === 0) return 0;
  
  const smartMonitoringCount = energy.filter(e => 
    'smartMonitoring' in e && e.smartMonitoring === true).length;
  
  return (smartMonitoringCount / energy.length) * 100;
}

/**
 * Calculate the percentage of energy with demand response capability
 * 
 * @param energy Array of energy data
 * @returns Percentage with demand response
 */
export function calculateDemandResponseCapability(energy: (EnergyItem | SustainableEnergy)[]): number {
  if (energy.length === 0) return 0;
  
  const demandResponseCount = energy.filter(e => 
    'demandResponse' in e && e.demandResponse === true).length;
  
  return (demandResponseCount / energy.length) * 100;
}

/**
 * Calculate energy data completeness score
 * 
 * @param energy Array of energy data
 * @returns Completeness score between 0 and 1
 */
export function calculateEnergyDataCompleteness(energy: (EnergyItem | SustainableEnergy)[]): number {
  if (energy.length === 0) return 0;
  
  let totalScore = 0;
  
  energy.forEach(e => {
    let itemScore = 0;
    
    // Check for essential properties
    if ('source' in e && typeof e.source === 'string') itemScore += 0.2;
    if ('consumption' in e && typeof e.consumption === 'number') itemScore += 0.2;
    if ('carbonIntensity' in e && typeof e.carbonIntensity === 'number') itemScore += 0.2;
    
    // Check for additional properties
    if ('renewable' in e) itemScore += 0.1;
    if ('efficiency' in e && typeof e.efficiency === 'number') itemScore += 0.1;
    if ('unit' in e && typeof e.unit === 'string') itemScore += 0.05;
    if ('costPerUnit' in e && typeof e.costPerUnit === 'number') itemScore += 0.05;
    if ('peakDemand' in e && typeof e.peakDemand === 'number') itemScore += 0.05;
    if ('smartMonitoring' in e) itemScore += 0.025;
    if ('demandResponse' in e) itemScore += 0.025;
    
    totalScore += itemScore;
  });
  
  return totalScore / energy.length;
}
