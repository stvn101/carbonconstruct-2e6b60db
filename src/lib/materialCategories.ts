
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
  sustainabilityScore: number; // Added missing property
  sustainabilityPercentage: number; // Added missing property
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
  category?: string; // Added missing property
}

// Creating an enum version of MaterialCategory to use as values
export enum MaterialCategoryEnum {
  CONCRETE = "CONCRETE",
  STEEL = "STEEL",
  TIMBER = "TIMBER",
  BRICK = "BRICK",
  ALUMINUM = "ALUMINUM",
  GLASS = "GLASS",
  INSULATION = "INSULATION",
  OTHER = "OTHER"
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

// Add the missing generateMaterialAnalysis function
export function generateMaterialAnalysis(materials: any[]): MaterialAnalysisResult {
  // Filter materials with high carbon footprint (top 40%)
  const sortedMaterials = [...materials].sort((a, b) => 
    (b.carbon_footprint_kgco2e_kg || 0) - (a.carbon_footprint_kgco2e_kg || 0)
  );
  
  const highImpactCount = Math.ceil(sortedMaterials.length * 0.4);
  const highImpactMaterials = sortedMaterials
    .slice(0, highImpactCount)
    .map(material => ({
      id: material.id,
      name: material.name,
      carbonFootprint: material.carbon_footprint_kgco2e_kg || 0,
      quantity: material.quantity || 0
    }));

  // Calculate sustainability score (0-100) based on carbon footprint
  const totalCarbon = materials.reduce((sum, m) => 
    sum + (m.carbon_footprint_kgco2e_kg || 0) * (m.quantity || 1), 0);
  
  // Lower carbon = higher score, normalize between 0-100
  const maxPossibleCarbon = materials.length * 100; // Rough estimate for normalization
  const sustainabilityScore = Math.max(0, Math.min(100, 100 - (totalCarbon / maxPossibleCarbon * 100)));
  
  // Calculate percentage of sustainable materials
  const sustainableMaterialCount = materials.filter(m => 
    (m.sustainabilityScore || 0) > 70 || 
    (m.carbon_footprint_kgco2e_kg || 0) < 10
  ).length;
  
  const sustainabilityPercentage = materials.length > 0 
    ? (sustainableMaterialCount / materials.length) * 100
    : 0;

  return {
    highImpactMaterials,
    alternatives: {},
    sustainabilityScore,
    sustainabilityPercentage
  };
}
