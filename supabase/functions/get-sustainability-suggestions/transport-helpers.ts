/**
 * Transport-related helper functions for sustainability analysis
 * 
 * This module provides utility functions for analyzing transport data,
 * calculating emissions, and generating recommendations for sustainable
 * transportation in construction projects.
 */

import type { TransportItem, SustainableTransport } from 'interfaces/transport';

/**
 * Calculate the total distance for all transport items
 * 
 * @param transport Array of transport data
 * @returns Total distance in kilometers
 */
export function calculateTotalDistance(transport: (TransportItem | SustainableTransport)[]): number {
  return transport.reduce((total, t) => 
    total + (('distance' in t && typeof t.distance === 'number') ? t.distance : 0), 0);
}

/**
 * Calculate the average emissions factor across all transport items
 * 
 * @param transport Array of transport data
 * @returns Average emissions factor
 */
export function calculateAverageEmissionsFactor(transport: (TransportItem | SustainableTransport)[]): number {
  const transportWithEmissions = transport.filter(t => 
    'emissionsFactor' in t && typeof t.emissionsFactor === 'number');
  
  if (transportWithEmissions.length === 0) return 0;
  
  const totalEmissionsFactor = transportWithEmissions.reduce((total, t) => 
    total + ('emissionsFactor' in t && typeof t.emissionsFactor === 'number' ? t.emissionsFactor : 0), 0);
  
  return totalEmissionsFactor / transportWithEmissions.length;
}

/**
 * Calculate the percentage of sustainable transport methods
 * 
 * @param transport Array of transport data
 * @returns Percentage of sustainable transport
 */
export function calculateSustainableTransportPercentage(transport: (TransportItem | SustainableTransport)[]): number {
  if (transport.length === 0) return 0;
  
  const sustainableTransportCount = transport.filter(t => 
    'carbonFootprint' in t || 
    ('isElectric' in t && t.isElectric === true) ||
    ('routeOptimization' in t && t.routeOptimization === true)
  ).length;
  
  return (sustainableTransportCount / transport.length) * 100;
}

/**
 * Identify routes with high emissions
 * 
 * @param transport Array of transport data
 * @returns Array of high-emission routes with details
 */
export function identifyHighEmissionRoutes(transport: (TransportItem | SustainableTransport)[]): {
  origin: string;
  destination: string;
  distance: number;
  emissions: number;
}[] {
  return transport
    .filter(t => 
      'emissionsFactor' in t && typeof t.emissionsFactor === 'number' && t.emissionsFactor > 0.8 &&
      'distance' in t && typeof t.distance === 'number'
    )
    .map(t => ({
      origin: "Origin", // Placeholder - would be replaced with actual data in a real implementation
      destination: "Destination", // Placeholder
      distance: ('distance' in t && typeof t.distance === 'number') ? t.distance : 0,
      emissions: ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') ? t.emissionsFactor : 0
    }));
}

/**
 * Calculate the potential for route optimization
 * 
 * @param transport Array of transport data
 * @returns Potential improvement factor (0-1)
 */
export function calculateRouteOptimizationPotential(transport: (TransportItem | SustainableTransport)[]): number {
  // In a real implementation, this would analyze routes for optimization potential
  // For now, we'll use a simplified calculation
  
  // Count transport items without route optimization
  const nonOptimizedCount = transport.filter(t => 
    !('routeOptimization' in t) || t.routeOptimization !== true).length;
  
  // Calculate potential based on non-optimized routes
  if (transport.length === 0) return 0;
  return Math.min(0.5, nonOptimizedCount / transport.length * 0.3);
}

/**
 * Calculate the average efficiency of transport methods
 * 
 * @param transport Array of transport data
 * @returns Average efficiency (0-1)
 */
export function calculateAverageEfficiency(transport: (TransportItem | SustainableTransport)[]): number {
  const transportWithEfficiency = transport.filter(t => 
    'efficiency' in t && typeof t.efficiency === 'number');
  
  if (transportWithEfficiency.length === 0) return 0;
  
  const totalEfficiency = transportWithEfficiency.reduce((total, t) => 
    total + ('efficiency' in t && typeof t.efficiency === 'number' ? t.efficiency : 0), 0);
  
  return totalEfficiency / transportWithEfficiency.length;
}

/**
 * Group transport items by type
 * 
 * @param transport Array of transport data
 * @returns Object with counts of transport by type
 */
export function groupTransportByType(transport: (TransportItem | SustainableTransport)[]): Record<string, number> {
  const types: Record<string, number> = {};
  
  transport.forEach(t => {
    if ('type' in t && typeof t.type === 'string') {
      const type = t.type.toLowerCase();
      types[type] = (types[type] || 0) + 1;
    }
  });
  
  return types;
}

/**
 * Group transport items by fuel type
 * 
 * @param transport Array of transport data
 * @returns Object with counts of transport by fuel type
 */
export function groupTransportByFuel(transport: (TransportItem | SustainableTransport)[]): Record<string, number> {
  const fuels: Record<string, number> = {};
  
  transport.forEach(t => {
    let fuelType = 'unknown';
    
    if ('fuel' in t && typeof t.fuel === 'string') {
      fuelType = t.fuel.toLowerCase();
    } else if ('isElectric' in t && t.isElectric === true) {
      fuelType = 'electric';
    }
    
    fuels[fuelType] = (fuels[fuelType] || 0) + 1;
  });
  
  return fuels;
}

/**
 * Calculate the average load for transport items
 * 
 * @param transport Array of transport data
 * @returns Average load
 */
export function calculateAverageLoad(transport: (TransportItem | SustainableTransport)[]): number {
  const transportWithLoad = transport.filter(t => 
    'load' in t && typeof t.load === 'number');
  
  if (transportWithLoad.length === 0) return 0;
  
  const totalLoad = transportWithLoad.reduce((total, t) => 
    total + ('load' in t && typeof t.load === 'number' ? t.load : 0), 0);
  
  return totalLoad / transportWithLoad.length;
}

/**
 * Calculate emissions per ton-kilometer
 * 
 * @param transport Array of transport data
 * @returns Emissions per ton-kilometer
 */
export function calculateEmissionsPerTonKm(transport: (TransportItem | SustainableTransport)[]): number {
  const validTransport = transport.filter(t => 
    'emissionsFactor' in t && typeof t.emissionsFactor === 'number' &&
    'distance' in t && typeof t.distance === 'number' &&
    'load' in t && typeof t.load === 'number' &&
    t.distance > 0 && t.load > 0
  );
  
  if (validTransport.length === 0) return 0;
  
  let totalEmissionsPerTonKm = 0;
  
  validTransport.forEach(t => {
    if ('emissionsFactor' in t && typeof t.emissionsFactor === 'number' &&
        'distance' in t && typeof t.distance === 'number' &&
        'load' in t && typeof t.load === 'number') {
      const emissionsPerTonKm = t.emissionsFactor / (t.distance * t.load);
      totalEmissionsPerTonKm += emissionsPerTonKm;
    }
  });
  
  return totalEmissionsPerTonKm / validTransport.length;
}

/**
 * Calculate potential savings from electrification
 * 
 * @param transport Array of transport data
 * @returns Potential savings factor (0-1)
 */
export function calculatePotentialElectrificationSavings(transport: (TransportItem | SustainableTransport)[]): number {
  // Count non-electric transport items with high emissions
  const highEmissionNonElectric = transport.filter(t => 
    (!('isElectric' in t) || t.isElectric !== true) &&
    ('emissionsFactor' in t && typeof t.emissionsFactor === 'number' && t.emissionsFactor > 0.5)
  ).length;
  
  if (transport.length === 0) return 0;
  
  // Calculate potential savings based on proportion of high-emission non-electric transport
  return Math.min(0.8, highEmissionNonElectric / transport.length * 0.5);
}

/**
 * Calculate transport data completeness score
 * 
 * @param transport Array of transport data
 * @returns Completeness score between 0 and 1
 */
export function calculateTransportDataCompleteness(transport: (TransportItem | SustainableTransport)[]): number {
  if (transport.length === 0) return 0;
  
  let totalScore = 0;
  
  transport.forEach(t => {
    let itemScore = 0;
    
    // Check for essential properties
    if ('type' in t && typeof t.type === 'string') itemScore += 0.2;
    if ('distance' in t && typeof t.distance === 'number') itemScore += 0.2;
    if ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') itemScore += 0.2;
    
    // Check for additional properties
    if ('efficiency' in t && typeof t.efficiency === 'number') itemScore += 0.1;
    if ('fuel' in t && typeof t.fuel === 'string') itemScore += 0.1;
    if ('isElectric' in t) itemScore += 0.05;
    if ('routeOptimization' in t) itemScore += 0.05;
    if ('load' in t && typeof t.load === 'number') itemScore += 0.05;
    if ('maintenanceStatus' in t && typeof t.maintenanceStatus === 'string') itemScore += 0.05;
    
    totalScore += itemScore;
  });
  
  return totalScore / transport.length;
}
