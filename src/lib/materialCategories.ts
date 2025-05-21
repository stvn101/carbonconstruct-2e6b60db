
// Define material categories that can be used throughout the application
export enum MaterialCategory {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  BRICK = 'brick',
  ALUMINUM = 'aluminum',
  GLASS = 'glass',
  INSULATION = 'insulation',
  OTHER = 'other',
  WOOD = 'wood' // Added as an alias for timber for compatibility
}

// Also define the SustainableMaterial interface
export interface SustainableMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  quantity?: number;
  category?: MaterialCategory;
  unit?: string;
  sustainabilityScore: number;
  alternativeTo?: string;
  carbonReduction: number;
  costDifference?: number;
  availability?: 'low' | 'medium' | 'high';
  recyclable?: boolean;
  recycledContent?: number;
  locallySourced?: boolean;
}

export interface MaterialAnalysisResult {
  highImpactMaterials: Array<{
    id: string;
    name: string;
    carbonFootprint: number;
    quantity?: number;
    category?: string;
  }>;
  sustainabilityScore: number;
  sustainabilityPercentage: number;
  recommendations: string[];
  alternatives: {
    [materialId: string]: SustainableMaterial[];
  };
}
