import { Material } from "./carbonTypes";

export enum MaterialCategoryEnum {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  BRICK = 'brick',
  ALUMINUM = 'aluminum',
  GLASS = 'glass',
  INSULATION = 'insulation',
  OTHER = 'other',
  WOOD = 'wood' // Added wood as an alias for timber for compatibility
}

export interface SustainableMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  quantity?: number;
  category?: string;
  unit?: string;
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of material this is an alternative to
  carbonReduction: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference (+/- %)
  availability?: 'low' | 'medium' | 'high';
  recyclable?: boolean;
  recycledContent?: number; // percentage
  locallySourced?: boolean;
}
