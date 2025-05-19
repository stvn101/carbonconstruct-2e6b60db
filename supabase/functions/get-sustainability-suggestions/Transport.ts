
// Transport types and enums for sustainability suggestions

export enum TransportType {
  ROAD = 'road',
  RAIL = 'rail',
  SEA = 'sea',
  AIR = 'air'
}

export enum FuelType {
  DIESEL = 'diesel',
  PETROL = 'petrol',
  ELECTRIC = 'electric',
  HYBRID = 'hybrid',
  BIOFUEL = 'biofuel',
  LNG = 'lng'
}

export interface TransportItem {
  id: string;
  type: TransportType;
  distance: number; // km
  weight: number; // tonnes
  fuelType: FuelType;
  emissionsFactor: number; // kg CO2e per tonne-km
}

export interface SustainableTransport extends TransportItem {
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of transport this can replace
  carbonReduction?: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference in cost (+ more expensive, - cheaper)
  feasibility: 'high' | 'medium' | 'low';
}
