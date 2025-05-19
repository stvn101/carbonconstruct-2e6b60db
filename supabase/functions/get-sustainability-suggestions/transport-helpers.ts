
import { TransportItem, SustainableTransport, TransportType, FuelType } from './Transport.ts';

/**
 * Calculate the total distance for all transport items
 */
export function calculateTotalDistance(
  transportItems: TransportItem[]
): number {
  if (!transportItems || transportItems.length === 0) return 0;
  
  return transportItems.reduce((total, item) => total + item.distance, 0);
}

/**
 * Calculate average emissions factor across transport methods
 */
export function calculateAverageEmissionsFactor(
  transportItems: TransportItem[]
): number {
  if (!transportItems || transportItems.length === 0) return 0;
  
  const totalEmissions = transportItems.reduce((sum, item) => sum + item.emissionsFactor, 0);
  return totalEmissions / transportItems.length;
}

/**
 * Calculate percentage of sustainable transport methods used
 */
export function calculateSustainableTransportPercentage(
  transportItems: TransportItem[]
): number {
  if (!transportItems || transportItems.length === 0) return 0;

  const sustainableCount = transportItems.filter(item => {
    // Consider electric and biofuel as sustainable options
    if (item.fuelType === FuelType.ELECTRIC || item.fuelType === FuelType.BIOFUEL) {
      return true;
    }
    
    // Consider rail transport as generally more sustainable
    if (item.type === TransportType.RAIL) {
      return true;
    }
    
    // If it's a SustainableTransport object with high score
    if ('sustainabilityScore' in item && (item as SustainableTransport).sustainabilityScore > 70) {
      return true;
    }
    
    return false;
  }).length;
  
  return (sustainableCount / transportItems.length) * 100;
}

/**
 * Identify transport routes with highest emissions
 */
export function identifyHighEmissionRoutes(
  transportItems: TransportItem[]
): TransportItem[] {
  if (!transportItems || transportItems.length === 0) return [];
  
  // Calculate total emissions for each route (emissions factor * distance * weight)
  const routesWithEmissions = transportItems.map(item => ({
    ...item,
    totalEmissions: item.emissionsFactor * item.distance * item.weight
  }));
  
  // Sort by total emissions
  const sortedRoutes = [...routesWithEmissions].sort((a, b) => 
    b.totalEmissions - a.totalEmissions
  );
  
  // Return top 30% of routes or at least 2 routes
  const numToReturn = Math.max(2, Math.ceil(transportItems.length * 0.3));
  return sortedRoutes.slice(0, numToReturn);
}

/**
 * Calculate potential emission reduction through route optimization
 */
export function calculateRouteOptimizationPotential(
  transportItems: TransportItem[]
): { 
  potentialReduction: number; 
  optimizedRoutes: SustainableTransport[] 
} {
  if (!transportItems || transportItems.length === 0) {
    return { potentialReduction: 0, optimizedRoutes: [] };
  }
  
  // This is a simplified implementation
  // In a real scenario, this would use actual route optimization algorithms
  
  // Identify high emission routes to optimize
  const highEmissionRoutes = identifyHighEmissionRoutes(transportItems);
  
  const optimizedRoutes: SustainableTransport[] = highEmissionRoutes.map(route => {
    // Different optimization strategies based on transport type
    switch(route.type) {
      case TransportType.ROAD:
        return {
          ...route,
          sustainabilityScore: 75,
          // Assume 10% distance reduction through better routing
          distance: route.distance * 0.9,
          alternativeTo: route.id,
          carbonReduction: 15,
          costDifference: -5, // Cost saving
          feasibility: 'high'
        };
        
      case TransportType.AIR:
        // Switch from air to sea or rail where possible
        return {
          ...route,
          type: TransportType.SEA,
          // Sea is slower but more efficient
          emissionsFactor: route.emissionsFactor * 0.3,
          sustainabilityScore: 85,
          alternativeTo: route.id,
          carbonReduction: 70,
          costDifference: -20, // Significant cost saving
          feasibility: 'medium'
        };
        
      case TransportType.SEA:
        return {
          ...route,
          // Optimize speed and routing
          emissionsFactor: route.emissionsFactor * 0.85,
          sustainabilityScore: 80,
          alternativeTo: route.id,
          carbonReduction: 15,
          costDifference: -3,
          feasibility: 'high'
        };
        
      case TransportType.RAIL:
        return {
          ...route,
          // Already efficient, but can use electric trains where available
          fuelType: FuelType.ELECTRIC,
          emissionsFactor: route.emissionsFactor * 0.7,
          sustainabilityScore: 90,
          alternativeTo: route.id,
          carbonReduction: 30,
          costDifference: 0,
          feasibility: 'medium'
        };
        
      default:
        return {
          ...route,
          sustainabilityScore: 70,
          emissionsFactor: route.emissionsFactor * 0.9,
          alternativeTo: route.id,
          carbonReduction: 10,
          costDifference: -2,
          feasibility: 'medium'
        };
    }
  });
  
  // Calculate total emissions before and after optimization
  const originalEmissions = transportItems.reduce((total, item) => 
    total + (item.emissionsFactor * item.distance * item.weight), 0);
  
  const optimizedEmissions = transportItems.reduce((total, item) => {
    // Find if this item has an optimized version
    const optimized = optimizedRoutes.find(r => r.alternativeTo === item.id);
    if (optimized) {
      return total + (optimized.emissionsFactor * optimized.distance * optimized.weight);
    }
    return total + (item.emissionsFactor * item.distance * item.weight);
  }, 0);
  
  const potentialReduction = ((originalEmissions - optimizedEmissions) / originalEmissions) * 100;
  
  return {
    potentialReduction,
    optimizedRoutes
  };
}
