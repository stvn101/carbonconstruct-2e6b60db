// Energy interface definition
export interface EnergyItem {
  source: string;
  consumption?: number;
  unit?: string;
  carbonIntensity?: number;
  renewable?: boolean;
  efficiency?: number;
  peakDemand?: number;
  costPerUnit?: number;
  storageCapacity?: number;
  provider?: string;
  location?: string;
  timeOfUse?: string;
  backupSystem?: boolean;
  [key: string]: unknown;
}

// Energy source enum
export enum EnergySource {
  GRID = "grid",
  SOLAR = "solar",
  WIND = "wind",
  DIESEL_GENERATOR = "diesel_generator",
  NATURAL_GAS = "natural_gas",
  BIOMASS = "biomass",
  GEOTHERMAL = "geothermal",
  HYDROGEN = "hydrogen",
  OTHER = "other"
}

// Energy unit enum
export enum EnergyUnit {
  KWH = "kWh",
  MWH = "MWh",
  BTU = "BTU",
  JOULE = "J",
  THERM = "therm"
}

// Energy with sustainability metrics
export interface SustainableEnergy extends EnergyItem {
  carbonFootprint: number;
  renewablePercentage: number;
  energyEfficiencyRating: number;
  potentialSavings?: number;
  alternativeSourceOptions?: EnergySource[];
  gridDependency?: number;
  smartMonitoring?: boolean;
  demandResponse?: boolean;
  emissionsOffset?: number;
  certifications?: string[];
}
