
// Transport type definitions for sustainability analysis

export interface TransportItem {
  id: string;
  type: string;
  distance: number;
  weight: number;
  fuelType?: string;
  emissionsFactor: number;
}

export interface TransportAlternative {
  mode: string;
  carbonFootprint: number;
  costDifference: number; // percentage relative to original (positive = more expensive)
  feasibility: 'high' | 'medium' | 'low';
}
