
// Material type definitions for sustainability analysis

export interface Material {
  id: string;
  name: string;
  category?: string;
  carbonFootprint: number;
  unit?: string;
  recyclable?: boolean;
  recycledContent?: number;
  locallySourced?: boolean;
  quantity: number;
}

export interface MaterialAlternative {
  name: string;
  carbonFootprint: number;
  costDifference: number; // percentage relative to original (positive = more expensive)
  availability: 'high' | 'medium' | 'low';
  benefits: string[];
}
