
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

// Define MaterialAnalysisResult locally instead of importing from edge functions
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

// Create adapter function to convert database material to our application format
export function adaptMaterialFromDatabase(dbMaterial: any): SustainableMaterial {
  return {
    id: dbMaterial.id || `material-${Math.random().toString(36).substring(2, 9)}`,
    name: dbMaterial.material || dbMaterial.name || '',
    carbonFootprint: dbMaterial.co2e_avg || dbMaterial.carbon_footprint_kgco2e_kg || 0,
    category: dbMaterial.applicable_standards as MaterialCategory || MaterialCategory.OTHER,
    sustainabilityScore: dbMaterial.sustainability_score || 50,
    alternativeTo: dbMaterial.alternativeTo || '',
    carbonReduction: dbMaterial.carbonReduction || 0,
    costDifference: dbMaterial.costDifference || 0,
    availability: dbMaterial.availability || 'medium',
    recyclable: dbMaterial.recyclable || false,
    recycledContent: dbMaterial.recycledContent || 0,
    locallySourced: dbMaterial.locallySourced || false,
    unit: dbMaterial.unit || 'kg'
  };
}

// Create adapter function to generate MaterialAnalysisResult from material inputs
export function generateMaterialAnalysis(materials: any[]): MaterialAnalysisResult {
  // Convert materials to standardized format
  const standardizedMaterials = materials.map(adaptMaterialFromDatabase);
  
  // Find high impact materials (top 50% by carbon footprint)
  const sortedByImpact = [...standardizedMaterials].sort(
    (a, b) => b.carbonFootprint - a.carbonFootprint
  );
  
  const highImpactCount = Math.ceil(sortedByImpact.length / 2);
  const highImpactMaterials = sortedByImpact.slice(0, highImpactCount).map(m => ({
    id: m.id,
    name: m.name,
    carbonFootprint: m.carbonFootprint,
    quantity: m.quantity,
    category: m.category
  }));
  
  // Calculate sustainability metrics
  const avgSustainabilityScore = standardizedMaterials.reduce(
    (sum, m) => sum + m.sustainabilityScore, 0
  ) / standardizedMaterials.length;
  
  const sustainableCount = standardizedMaterials.filter(
    m => m.sustainabilityScore >= 70
  ).length;
  
  const sustainabilityPercentage = standardizedMaterials.length > 0
    ? Math.round((sustainableCount / standardizedMaterials.length) * 100)
    : 0;
  
  // Generate recommendations based on material properties
  const recommendations = [];
  
  if (highImpactMaterials.length > 0) {
    recommendations.push(
      `Consider alternatives to ${highImpactMaterials[0].name} to reduce carbon footprint`
    );
  }
  
  if (sustainabilityPercentage < 50) {
    recommendations.push(
      "Increase the use of sustainable materials to improve project sustainability score"
    );
  }
  
  recommendations.push(
    "Source locally produced materials to reduce transport emissions",
    "Consider using materials with higher recycled content"
  );
  
  // Group alternatives by material
  const alternatives: {[materialId: string]: SustainableMaterial[]} = {};
  
  // This would normally be populated from database queries
  // For now we'll leave it as an empty object
  
  return {
    highImpactMaterials,
    sustainabilityScore: Math.round(avgSustainabilityScore),
    sustainabilityPercentage,
    recommendations,
    alternatives
  };
}
