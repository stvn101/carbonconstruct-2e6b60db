import { TransportItem, SustainableTransport, TransportType as _TransportType, FuelType as _FuelType } from './Transport.ts';

/**
 * Interface for detailed transport metrics
 */
export interface TransportMetrics {
  totalTransportItems: number;
  totalDistance: number;
  averageEmissionsFactor: number;
  sustainableTransportPercentage: number;
  electricVehiclePercentage: number;
  routeOptimizationPercentage: number;
  fuelEfficiency: number;
  transportByType: Record<string, number>;
  fuelByType: Record<string, number>;
  carbonIntensity: number;
  idlingTimePercentage?: number;
  maintenanceScore?: number;
  noiseImpact?: number;
  airQualityImpact?: number;
  congestionContribution?: number;
}

/**
 * Calculate detailed transport metrics
 */
export function calculateDetailedTransportMetrics(transport: (TransportItem | SustainableTransport)[]): TransportMetrics {
  if (!transport || transport.length === 0) {
    return {
      totalTransportItems: 0,
      totalDistance: 0,
      averageEmissionsFactor: 0,
      sustainableTransportPercentage: 0,
      electricVehiclePercentage: 0,
      routeOptimizationPercentage: 0,
      fuelEfficiency: 0,
      transportByType: {},
      fuelByType: {},
      carbonIntensity: 0
    };
  }

  // Count total transport items
  const totalTransportItems = transport.length;

  // Calculate total distance
  const transportWithDistance = transport.filter(t => 
    'distance' in t && typeof t.distance === 'number'
  );
  const totalDistance = transportWithDistance.reduce((sum, t) => 
    sum + (t.distance as number), 0);

  // Calculate average emissions factor
  const transportWithEmissions = transport.filter(t => 
    'emissionsFactor' in t && typeof t.emissionsFactor === 'number'
  );
  const averageEmissionsFactor = transportWithEmissions.length > 0
    ? transportWithEmissions.reduce((sum, t) => sum + (t.emissionsFactor as number), 0) / transportWithEmissions.length
    : 0;

  // Calculate sustainable transport percentage
  const sustainableTransportCount = transport.filter(t => 
    'carbonFootprint' in t || 
    ('isElectric' in t && t.isElectric === true) ||
    ('routeOptimization' in t && t.routeOptimization === true)
  ).length;
  const sustainableTransportPercentage = (sustainableTransportCount / totalTransportItems) * 100;

  // Calculate electric vehicle percentage
  const electricVehicleCount = transport.filter(t => 
    ('isElectric' in t && t.isElectric === true) ||
    ('fuel' in t && typeof t.fuel === 'string' && t.fuel.toLowerCase() === 'electricity')
  ).length;
  const electricVehiclePercentage = (electricVehicleCount / totalTransportItems) * 100;

  // Calculate route optimization percentage
  const routeOptimizationCount = transport.filter(t => 
    'routeOptimization' in t && t.routeOptimization === true
  ).length;
  const routeOptimizationPercentage = (routeOptimizationCount / totalTransportItems) * 100;

  // Calculate fuel efficiency
  const transportWithEfficiency = transport.filter(t => 
    'efficiency' in t && typeof t.efficiency === 'number'
  );
  const fuelEfficiency = transportWithEfficiency.length > 0
    ? transportWithEfficiency.reduce((sum, t) => sum + (t.efficiency as number), 0) / transportWithEfficiency.length
    : 0;

  // Count transport by type
  const transportByType: Record<string, number> = {};
  transport.forEach(t => {
    if ('type' in t && typeof t.type === 'string') {
      transportByType[t.type] = (transportByType[t.type] || 0) + 1;
    }
  });

  // Count fuel by type
  const fuelByType: Record<string, number> = {};
  transport.forEach(t => {
    if ('fuel' in t && typeof t.fuel === 'string') {
      fuelByType[t.fuel] = (fuelByType[t.fuel] || 0) + 1;
    }
  });

  // Calculate carbon intensity (emissions per distance)
  let carbonIntensity = 0;
  if (totalDistance > 0) {
    const totalEmissions = transportWithEmissions.reduce((sum, t) => {
      const distance = 'distance' in t && typeof t.distance === 'number' ? t.distance : 0;
      return sum + ((t.emissionsFactor as number) * distance);
    }, 0);
    carbonIntensity = totalEmissions / totalDistance;
  }

  // Calculate idling time percentage if available
  let idlingTimePercentage: number | undefined;
  const transportWithIdlingAndOperating = transport.filter(t => 
    'idlingTime' in t && typeof t.idlingTime === 'number' &&
    'operatingHours' in t && typeof t.operatingHours === 'number'
  );
  if (transportWithIdlingAndOperating.length > 0) {
    const totalIdlingTime = transportWithIdlingAndOperating.reduce((sum, t) => sum + (t.idlingTime as number), 0);
    const totalOperatingHours = transportWithIdlingAndOperating.reduce((sum, t) => sum + (t.operatingHours as number), 0);
    idlingTimePercentage = (totalIdlingTime / totalOperatingHours) * 100;
  }

  // Calculate maintenance score if available
  let maintenanceScore: number | undefined;
  const transportWithMaintenanceStatus = transport.filter(t => 
    'maintenanceStatus' in t && typeof t.maintenanceStatus === 'string'
  );
  if (transportWithMaintenanceStatus.length > 0) {
    const goodMaintenanceCount = transportWithMaintenanceStatus.filter(t => 
      (t.maintenanceStatus as string).toLowerCase() === 'good' || 
      (t.maintenanceStatus as string).toLowerCase() === 'excellent'
    ).length;
    maintenanceScore = (goodMaintenanceCount / transportWithMaintenanceStatus.length) * 100;
  }

  // Calculate noise impact if available
  let noiseImpact: number | undefined;
  const transportWithNoiseLevel = transport.filter(t => 
    'noiseLevel' in t && typeof t.noiseLevel === 'number'
  );
  if (transportWithNoiseLevel.length > 0) {
    noiseImpact = transportWithNoiseLevel.reduce((sum, t) => sum + (t.noiseLevel as number), 0) / transportWithNoiseLevel.length;
  }

  // Calculate air quality impact if available
  let airQualityImpact: number | undefined;
  const transportWithAirQualityImpact = transport.filter(t => 
    'airQualityImpact' in t && typeof t.airQualityImpact === 'number'
  );
  if (transportWithAirQualityImpact.length > 0) {
    airQualityImpact = transportWithAirQualityImpact.reduce((sum, t) => sum + (t.airQualityImpact as number), 0) / transportWithAirQualityImpact.length;
  }

  // Calculate congestion contribution (placeholder)
  const congestionContribution = 0.5; // Placeholder value

  return {
    totalTransportItems,
    totalDistance,
    averageEmissionsFactor,
    sustainableTransportPercentage,
    electricVehiclePercentage,
    routeOptimizationPercentage,
    fuelEfficiency,
    transportByType,
    fuelByType,
    carbonIntensity,
    idlingTimePercentage,
    maintenanceScore,
    noiseImpact,
    airQualityImpact,
    congestionContribution
  };
}

/**
 * Identify high emission routes
 */
export function identifyHighEmissionRoutes(transport: (TransportItem | SustainableTransport)[]): {
  origin: string;
  destination: string;
  distance: number;
  emissions: number;
  optimizationPotential: number;
  alternativeOptions?: string[];
}[] {
  if (!transport || transport.length === 0) return [];

  return transport
    .filter(t => 
      'emissionsFactor' in t && typeof t.emissionsFactor === 'number' && t.emissionsFactor > 0.8 &&
      'distance' in t && typeof t.distance === 'number'
    )
    .map(t => {
      // Calculate optimization potential based on transport properties
      const optimizationPotential = ('routeOptimization' in t && t.routeOptimization === true) ? 0.2 : 0.4;
      
      // Determine alternative options based on transport type
      let alternativeOptions: string[] | undefined;
      if ('type' in t && typeof t.type === 'string') {
        switch (t.type.toLowerCase()) {
          case 'truck':
            alternativeOptions = ['Rail transport', 'Electric trucks', 'Optimized routing'];
            break;
          case 'plane':
            alternativeOptions = ['Rail transport', 'Sea freight', 'Biofuel aircraft'];
            break;
          case 'ship':
            alternativeOptions = ['Slow steaming', 'Wind-assisted propulsion', 'Alternative fuels'];
            break;
          default:
            alternativeOptions = ['Electric alternatives', 'Route optimization', 'Load optimization'];
        }
      }

      return {
        origin: "Origin", // Placeholder - would be replaced with actual data in a real implementation
        destination: "Destination", // Placeholder
        distance: ('distance' in t && typeof t.distance === 'number') ? t.distance : 0,
        emissions: ('emissionsFactor' in t && typeof t.emissionsFactor === 'number') ? t.emissionsFactor : 0,
        optimizationPotential,
        alternativeOptions
      };
    });
}

/**
 * Calculate route optimization potential
 */
export function calculateRouteOptimizationPotential(transport: (TransportItem | SustainableTransport)[]): {
  overallPotential: number;
  fuelSavingsPotential: number;
  timeSavingsPotential: number;
  emissionsReductionPotential: number;
  specificRecommendations: string[];
} {
  if (!transport || transport.length === 0) {
    return {
      overallPotential: 0,
      fuelSavingsPotential: 0,
      timeSavingsPotential: 0,
      emissionsReductionPotential: 0,
      specificRecommendations: []
    };
  }

  // Calculate overall potential based on current route optimization
  const routeOptimizedCount = transport.filter(t => 
    'routeOptimization' in t && t.routeOptimization === true
  ).length;
  const routeOptimizationRatio = routeOptimizedCount / transport.length;
  const overallPotential = Math.max(0, 0.5 - (routeOptimizationRatio * 0.5));

  // Calculate fuel savings potential
  const fuelSavingsPotential = overallPotential * 1.2; // Typically route optimization saves more in fuel than the optimization percentage

  // Calculate time savings potential
  const timeSavingsPotential = overallPotential * 0.8; // Typically route optimization saves slightly less in time than the optimization percentage

  // Calculate emissions reduction potential
  const emissionsReductionPotential = fuelSavingsPotential * 0.9; // Emissions reduction is closely tied to fuel savings

  // Generate specific recommendations
  const specificRecommendations: string[] = [];
  
  // Check for long distance transport
  const hasLongDistanceTransport = transport.some(t => 
    'distance' in t && typeof t.distance === 'number' && t.distance > 200
  );
  if (hasLongDistanceTransport) {
    specificRecommendations.push("Implement advanced route planning software for long-distance routes");
  }
  
  // Check for urban transport
  const hasUrbanTransport = transport.some(t => 
    'type' in t && typeof t.type === 'string' && 
    ['delivery', 'urban', 'local'].some(keyword => t.type.toLowerCase().includes(keyword))
  );
  if (hasUrbanTransport) {
    specificRecommendations.push("Use real-time traffic data to optimize urban delivery routes");
  }
  
  // Check for multiple stops
  const hasMultipleStops = true; // Placeholder - would be determined by actual data
  if (hasMultipleStops) {
    specificRecommendations.push("Optimize stop sequencing to minimize total distance traveled");
  }
  
  // Check for high fuel consumption
  const hasHighFuelConsumption = transport.some(t => 
    'efficiency' in t && typeof t.efficiency === 'number' && t.efficiency < 0.6
  );
  if (hasHighFuelConsumption) {
    specificRecommendations.push("Identify and address vehicles with high fuel consumption");
  }
  
  // Add general recommendations if specific ones are limited
  if (specificRecommendations.length < 3) {
    specificRecommendations.push("Implement load optimization to maximize vehicle capacity utilization");
    specificRecommendations.push("Consider consolidating shipments to reduce the number of trips");
  }

  return {
    overallPotential,
    fuelSavingsPotential,
    timeSavingsPotential,
    emissionsReductionPotential,
    specificRecommendations
  };
}

/**
 * Calculate transport lifecycle emissions
 */
export function calculateTransportLifecycleEmissions(transport: (TransportItem | SustainableTransport)[]): {
  operationalEmissions: number;
  manufacturingEmissions: number;
  maintenanceEmissions: number;
  disposalEmissions: number;
  totalLifecycleEmissions: number;
  hotspots: string[];
} {
  if (!transport || transport.length === 0) {
    return {
      operationalEmissions: 0,
      manufacturingEmissions: 0,
      maintenanceEmissions: 0,
      disposalEmissions: 0,
      totalLifecycleEmissions: 0,
      hotspots: []
    };
  }

  // Calculate operational emissions
  const transportWithEmissions = transport.filter(t => 
    'emissionsFactor' in t && typeof t.emissionsFactor === 'number' &&
    'distance' in t && typeof t.distance === 'number'
  );
  const operationalEmissions = transportWithEmissions.reduce((sum, t) => 
    sum + ((t.emissionsFactor as number) * (t.distance as number)), 0);

  // Estimate manufacturing emissions based on vehicle type and age
  const manufacturingEmissions = transport.reduce((sum, t) => {
    let baseFactor = 0.2; // Default manufacturing emissions factor
    
    // Adjust based on vehicle type
    if ('type' in t && typeof t.type === 'string') {
      switch (t.type.toLowerCase()) {
        case 'truck':
          baseFactor = 0.3;
          break;
        case 'plane':
          baseFactor = 0.5;
          break;
        case 'ship':
          baseFactor = 0.4;
          break;
        case 'train':
          baseFactor = 0.25;
          break;
        default:
          baseFactor = 0.2;
      }
    }
    
    // Adjust based on vehicle age (newer vehicles have higher manufacturing emissions relative to lifetime)
    if ('vehicleAge' in t && typeof t.vehicleAge === 'number') {
      const ageFactor = Math.max(0.5, 1 - (t.vehicleAge / 20)); // Older vehicles have lower remaining manufacturing emissions
      baseFactor *= ageFactor;
    }
    
    return sum + baseFactor;
  }, 0);

  // Estimate maintenance emissions
  const maintenanceEmissions = operationalEmissions * 0.15; // Typically 10-20% of operational emissions

  // Estimate disposal emissions
  const disposalEmissions = manufacturingEmissions * 0.1; // Typically 5-15% of manufacturing emissions

  // Calculate total lifecycle emissions
  const totalLifecycleEmissions = operationalEmissions + manufacturingEmissions + maintenanceEmissions + disposalEmissions;

  // Identify hotspots
  const hotspots: string[] = [];
  
  // Check operational emissions
  if (operationalEmissions / totalLifecycleEmissions > 0.7) {
    hotspots.push("Operational fuel consumption");
  }
  
  // Check manufacturing emissions
  if (manufacturingEmissions / totalLifecycleEmissions > 0.3) {
    hotspots.push("Vehicle manufacturing");
  }
  
  // Check maintenance emissions
  if (maintenanceEmissions / totalLifecycleEmissions > 0.2) {
    hotspots.push("Vehicle maintenance");
  }
  
  // Check for specific vehicle types with high emissions
  const transportTypes = Object.keys(transport.reduce((types, t) => {
    if ('type' in t && typeof t.type === 'string') {
      types[t.type] = true;
    }
    return types;
  }, {} as Record<string, boolean>));
  
  for (const type of transportTypes) {
    const typeTransport = transport.filter(t => 'type' in t && t.type === type);
    const typeEmissions = typeTransport.reduce((sum, t) => {
      if ('emissionsFactor' in t && typeof t.emissionsFactor === 'number' &&
          'distance' in t && typeof t.distance === 'number') {
        return sum + (t.emissionsFactor * t.distance);
      }
      return sum;
    }, 0);
    
    if (typeEmissions / operationalEmissions > 0.4) {
      hotspots.push(`${type} operations`);
    }
  }
  
  // Add general hotspot if specific ones are limited
  if (hotspots.length === 0) {
    hotspots.push("Overall transport efficiency");
  }

  return {
    operationalEmissions,
    manufacturingEmissions,
    maintenanceEmissions,
    disposalEmissions,
    totalLifecycleEmissions,
    hotspots
  };
}
