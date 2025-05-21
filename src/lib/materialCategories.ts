
export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
  subcategories?: MaterialCategory[];
}

export interface MaterialAnalysisResult {
  highImpactMaterials: {
    id: string;
    name: string;
    carbonFootprint: number;
    quantity?: number;
  }[];
  alternatives: Record<string, SustainableMaterial[]>;
  recommendations?: string[];
}

export interface SustainableMaterial {
  id: string;
  name: string;
  carbonFootprint: number;
  carbonReduction: number; // percentage reduction compared to original
  sustainabilityScore: number;
  unit?: string;
  costDifference?: number; // percentage difference, positive means more expensive
  availability?: 'low' | 'medium' | 'high';
  recyclable?: boolean;
  recycledContent?: number; // percentage
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  {
    id: 'structural',
    name: 'Structural',
    description: 'Materials used for the main structure and load-bearing elements',
    subcategories: [
      { id: 'concrete', name: 'Concrete' },
      { id: 'steel', name: 'Steel' },
      { id: 'timber', name: 'Timber' }
    ]
  },
  {
    id: 'envelope',
    name: 'Building Envelope',
    description: 'Materials used for the exterior building envelope',
    subcategories: [
      { id: 'cladding', name: 'Cladding' },
      { id: 'insulation', name: 'Insulation' },
      { id: 'glazing', name: 'Glazing' }
    ]
  },
  {
    id: 'finishes',
    name: 'Finishes',
    description: 'Interior and exterior finishing materials',
    subcategories: [
      { id: 'flooring', name: 'Flooring' },
      { id: 'walls', name: 'Wall Finishes' },
      { id: 'ceilings', name: 'Ceiling Finishes' }
    ]
  }
];
