
// Material types and enums for sustainability suggestions

export enum MaterialCategory {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  GLASS = 'glass',
  INSULATION = 'insulation',
  FINISHES = 'finishes',
  OTHER = 'other'
}

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  carbonFootprint: number; // kg CO2e per unit
  unit: string;
  recyclable: boolean;
  recycledContent?: number; // percentage
  locallySourced?: boolean;
  quantity?: number;
}

export interface SustainableMaterial extends Material {
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of material this can replace
  carbonReduction?: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference in cost (+ more expensive, - cheaper)
  availability: 'high' | 'medium' | 'low';
}
