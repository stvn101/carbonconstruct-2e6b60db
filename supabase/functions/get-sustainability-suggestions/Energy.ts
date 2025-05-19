
// Energy type definitions for sustainability analysis

export interface EnergyItem {
  id: string;
  source: string;
  quantity: number;
  unit?: string;
  emissionsFactor: number;
}

export interface EnergyAlternative {
  source: string;
  carbonFootprint: number;
  costDifference: number; // percentage relative to original (positive = more expensive)
  implementationComplexity: 'high' | 'medium' | 'low';
}
