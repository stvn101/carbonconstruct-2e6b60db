// Transport interface definition
export interface TransportItem {
  type: string;
  distance?: number;
  fuel?: string;
  emissionsFactor?: number;
  loadCapacity?: number;
  efficiency?: number;
  isElectric?: boolean;
  routeOptimization?: boolean;
  maintenanceStatus?: string;
  vehicleAge?: number;
  operator?: string;
  operatingHours?: number;
  idlingTime?: number;
  [key: string]: unknown;
}

// Transport type enum
export enum TransportType {
  TRUCK = "truck",
  TRAIN = "train",
  SHIP = "ship",
  PLANE = "plane",
  CRANE = "crane",
  EXCAVATOR = "excavator",
  OTHER = "other"
}

// Fuel type enum
export enum FuelType {
  DIESEL = "diesel",
  GASOLINE = "gasoline",
  ELECTRICITY = "electricity",
  BIODIESEL = "biodiesel",
  HYDROGEN = "hydrogen",
  NATURAL_GAS = "natural_gas",
  OTHER = "other"
}

// Transport with sustainability metrics
export interface SustainableTransport extends TransportItem {
  carbonFootprint: number;
  fuelEfficiency: number;
  alternativeFuelOptions?: FuelType[];
  emissionsReductionPotential?: number;
  noiseLevel?: number;
  airQualityImpact?: number;
  lifecycleEmissions?: number;
  maintenanceSchedule?: string;
  ecoDriverTraining?: boolean;
}
