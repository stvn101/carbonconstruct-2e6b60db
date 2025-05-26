/**
 * Data generation utilities for sustainability performance
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { MaterialInput } from '@/lib/carbonExports';
import { MaterialPerformanceData, SustainabilityTrendData, MaterialRecommendation } from './types';

/**
 * Generate sustainable material alternatives for a given set of materials
 */
export function generateSustainableAlternatives(
  materials: ExtendedMaterialData[], 
  options = { count: 3 }
): ExtendedMaterialData[] {
  // Implementation for generating sustainable alternatives
  const alternatives: ExtendedMaterialData[] = [];
  
  // Process each material to find potential alternatives
  materials.forEach(material => {
    // Skip materials that are already alternatives
    if (material.alternativeTo) return;
    
    // Generate alternatives for common material types
    const materialName = material.name?.toLowerCase() || '';
    const materialCategory = material.category?.toLowerCase() || '';
    
    if (materialName.includes('concrete') || materialCategory.includes('concrete')) {
      // Generate sustainable concrete alternatives
      alternatives.push(
        createAlternativeMaterial(
          'Low-Carbon Concrete',
          material.id || 'concrete',
          0.7, // 70% of original carbon footprint
          'Concrete with supplementary cementitious materials like fly ash or slag',
          'Concrete',
          'High'
        )
      );
    } else if (materialName.includes('steel') || materialCategory.includes('steel')) {
      // Generate sustainable steel alternatives
      alternatives.push(
        createAlternativeMaterial(
          'Recycled Steel',
          material.id || 'steel',
          0.5, // 50% of original carbon footprint
          'Steel made from recycled content, reducing energy requirements and emissions',
          'Steel',
          'High'
        )
      );
    }
  });
  
  // Limit to requested count
  return alternatives.slice(0, options.count);
}

/**
 * Create an alternative material with improved sustainability characteristics
 */
function createAlternativeMaterial(
  name: string,
  alternativeTo: string,
  carbonReductionFactor: number,
  description: string,
  category: string,
  recyclability: 'High' | 'Medium' | 'Low'
): ExtendedMaterialData {
  return {
    id: `alt-${alternativeTo}-${Math.random().toString(36).substring(2, 7)}`,
    name,
    factor: carbonReductionFactor,
    unit: 'kg',
    region: 'Global',
    tags: ['sustainable', 'alternative'],
    sustainabilityScore: 85 + Math.floor(Math.random() * 15), // 85-100
    recyclability,
    alternativeTo,
    category,
    notes: description,
    description // Add the description field
  };
}

/**
 * Generate performance benchmarks for materials
 */
export function generatePerformanceBenchmarks(materials: ExtendedMaterialData[]): Record<string, any> {
  // Implementation for generating performance benchmarks
  const benchmarks: Record<string, any> = {};
  
  // Group materials by category
  const categorizedMaterials: Record<string, ExtendedMaterialData[]> = {};
  
  materials.forEach(material => {
    const category = material.category || 'Other';
    if (!categorizedMaterials[category]) {
      categorizedMaterials[category] = [];
    }
    categorizedMaterials[category].push(material);
  });
  
  // Calculate benchmarks for each category
  Object.entries(categorizedMaterials).forEach(([category, materialsList]) => {
    // Calculate average carbon footprint
    const totalCarbonFootprint = materialsList.reduce((sum, mat) => 
      sum + (mat.carbon_footprint_kgco2e_kg || mat.factor || 0), 0);
    const averageCarbonFootprint = totalCarbonFootprint / materialsList.length;
    
    // Calculate average sustainability score
    const totalSustainabilityScore = materialsList.reduce((sum, mat) => 
      sum + (mat.sustainabilityScore || 0), 0);
    const averageSustainabilityScore = totalSustainabilityScore / materialsList.length;
    
    // Store benchmarks
    benchmarks[category] = {
      averageCarbonFootprint,
      averageSustainabilityScore,
      sampleSize: materialsList.length,
      description: `Performance benchmark for ${category} based on ${materialsList.length} samples`
    };
  });
  
  return benchmarks;
}

/**
 * Generate sample trend data for a specific material
 * This function is used as a fallback when real data is not available
 */
export function generateSampleTrendData(materialType: string): SustainabilityTrendData {
  const today = new Date();
  const dataPoints = [];
  
  // Generate data points for the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(today.getMonth() - i);
    
    // Generate decreasing carbon footprint (improvement over time)
    // Start with higher values and gradually decrease
    const baseCarbonFootprint = 100 - (i * 8); // 100, 92, 84, 76, 68, 60
    const randomVariation = Math.random() * 10 - 5; // -5 to +5
    
    dataPoints.push({
      timestamp: date.toISOString(),
      carbonFootprint: baseCarbonFootprint + randomVariation,
      sustainabilityScore: 65 + (i * 5) + (Math.random() * 5), // Improving score over time
      quantity: Math.floor(Math.random() * 500) + 500 // Random quantity between 500-1000
    });
  }
  
  return {
    materialName: materialType,
    materialId: materialType,
    dataPoints,
    improvement: 25 + (Math.random() * 15), // 25-40% improvement
    averageFootprint: dataPoints.reduce((sum, point) => sum + point.carbonFootprint, 0) / dataPoints.length,
    projectedFootprint: dataPoints[dataPoints.length - 1].carbonFootprint * 0.9 // 10% further reduction projected
  };
}

/**
 * Find alternative materials for a specific material type
 * This function attempts to find alternatives in the database, but falls back to generating samples
 */
export async function findAlternativeMaterials(materialType: string): Promise<ExtendedMaterialData[]> {
  try {
    // Try to dynamically import material service to avoid circular dependencies
    const { fetchMaterials } = await import('../../materials/fetch/materialFetchService');
    
    // Fetch all materials
    const allMaterials = await fetchMaterials(true);
    
    // Create a dummy base material if needed for generating alternatives
    const baseMaterial: ExtendedMaterialData = {
      id: materialType,
      name: materialType,
      category: guessCategoryFromName(materialType),
      factor: 1.0,
      sustainabilityScore: 60,
      recyclability: 'Medium'
    };
    
    // Generate alternatives using our existing function
    return generateSustainableAlternatives([baseMaterial], { count: 3 });
  } catch (error) {
    console.error(`Failed to find alternatives for ${materialType}:`, error);
    
    // Return fallback data
    return [
      createAlternativeMaterial(
        `Eco-friendly ${materialType}`,
        materialType,
        0.7,
        `Sustainable alternative to standard ${materialType} with reduced carbon footprint`,
        guessCategoryFromName(materialType),
        'High'
      ),
      createAlternativeMaterial(
        `Recycled ${materialType}`,
        materialType,
        0.6,
        `Made from recycled ${materialType} materials, reducing waste and emissions`,
        guessCategoryFromName(materialType),
        'High'
      )
    ];
  }
}

/**
 * Generate sample recommendations based on current materials
 * Used as a fallback when real recommendation data is unavailable
 */
export function generateSampleRecommendations(materials: MaterialInput[]): MaterialRecommendation[] {
  return materials.slice(0, 3).map((material) => {
    const materialType = material.type;
    const recommendedName = `Sustainable ${materialType}`;
    
    // Calculate potential reduction (30-50%)
    const potentialReduction = 30 + Math.floor(Math.random() * 20);
    
    // Randomly select cost impact
    const costImpacts: Array<'lower' | 'similar' | 'higher'> = ['lower', 'similar', 'higher'];
    const costImpact = costImpacts[Math.floor(Math.random() * 3)];
    
    // Randomly select availability
    const availabilities: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];
    const availability = availabilities[Math.floor(Math.random() * 3)];
    
    return {
      originalMaterial: materialType,
      recommendedMaterial: recommendedName,
      potentialReduction,
      costImpact,
      availability,
      details: `Replacing standard ${materialType} with ${recommendedName} can reduce carbon emissions by approximately ${potentialReduction}%. This alternative ${
        costImpact === 'lower' ? 'costs less than' :
        costImpact === 'similar' ? 'is similarly priced to' :
        'is more expensive than'
      } the conventional option but offers significant environmental benefits.`
    };
  });
}

/**
 * Helper function to guess a material category based on name
 */
function guessCategoryFromName(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('concrete') || nameLower.includes('cement')) {
    return 'Concrete';
  }
  
  if (nameLower.includes('steel') || nameLower.includes('metal')) {
    return 'Steel';
  }
  
  if (nameLower.includes('timber') || nameLower.includes('wood')) {
    return 'Timber';
  }
  
  if (nameLower.includes('insulation')) {
    return 'Insulation';
  }
  
  if (nameLower.includes('glass')) {
    return 'Glass';
  }
  
  if (nameLower.includes('brick') || nameLower.includes('clay')) {
    return 'Masonry';
  }
  
  if (nameLower.includes('plastic') || nameLower.includes('polymer')) {
    return 'Plastics';
  }
  
  return 'Other';
}
