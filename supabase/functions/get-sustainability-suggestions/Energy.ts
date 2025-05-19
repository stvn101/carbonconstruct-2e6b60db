
// Energy types and enums for sustainability suggestions

export enum EnergySource {
  GRID = 'grid',
  DIESEL_GENERATOR = 'diesel_generator',
  SOLAR = 'solar',
  WIND = 'wind',
  BATTERY = 'battery',
  HYDROGEN = 'hydrogen'
}

export enum EnergyUnit {
  KWH = 'kwh',
  MWH = 'mwh',
  LITER = 'liter',
  M3 = 'cubic_meter'
}

export interface EnergyItem {
  id: string;
  source: EnergySource;
  quantity: number;
  unit: EnergyUnit;
  emissionsFactor: number; // kg CO2e per unit
}

export interface SustainableEnergy extends EnergyItem {
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of energy this can replace
  carbonReduction?: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference in cost (+ more expensive, - cheaper)
  implementationComplexity: 'high' | 'medium' | 'low';
}
