
export enum MaterialCategory {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  BRICK = 'brick',
  ALUMINUM = 'aluminum',
  GLASS = 'glass',
  INSULATION = 'insulation',
  OTHER = 'other'
}

export interface Material {
  id: string;
  name: string;
  carbonFootprint: number;
  quantity?: number;
  category?: MaterialCategory;
  unit?: string;
}

export interface SustainableMaterial extends Material {
  sustainabilityScore: number; // 0-100
  alternativeTo?: string; // ID of material this is an alternative to
  carbonReduction: number; // percentage reduction compared to conventional
  costDifference?: number; // percentage difference (+/- %)
  availability?: 'low' | 'medium' | 'high';
  recyclable?: boolean;
  recycledContent?: number; // percentage
  locallySourced?: boolean;
}

export interface MaterialAnalysisResult {
  highImpactMaterials: Material[];
  sustainabilityScore: number;
  sustainableMaterialPercentage: number;
  recommendations: string[];
  alternatives: {
    [materialId: string]: SustainableMaterial[];
  };
}
