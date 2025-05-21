
/**
 * Data generators for sample/fallback data
 */
import { SustainabilityTrendData, MaterialRecommendation } from './types';
import { MaterialInput } from '@/lib/carbonExports';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Generates sample trend data for demo purposes or when no real data is available
 */
export function generateSampleTrendData(materialType: string): SustainabilityTrendData {
  const dataPoints = [];
  const now = new Date();
  
  // Generate data points for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some realistic looking values with a general improvement trend
    const baseCarbonFootprint = 100 - (i * 1.5);
    const randomVariation = (Math.random() * 20) - 10; // -10 to +10
    
    dataPoints.push({
      timestamp: date.toISOString(),
      carbonFootprint: Math.max(50, baseCarbonFootprint + randomVariation),
      sustainabilityScore: Math.min(100, 60 + (i * 0.8)),
      quantity: 1000 - (i * 10)
    });
  }
  
  return {
    materialName: materialType,
    materialId: materialType,
    dataPoints,
    improvement: 28.5, // Sample improvement percentage
    averageFootprint: 75.3, // Sample average
    projectedFootprint: 42.8 // Sample projection
  };
}

/**
 * Finds alternative materials for a given material type
 */
export async function findAlternativeMaterials(materialType: string): Promise<ExtendedMaterialData[]> {
  // For demo purposes, generate some alternative materials
  const alternatives: ExtendedMaterialData[] = [];
  
  if (materialType.includes('concrete')) {
    alternatives.push({
      id: 'alt-concrete-1',
      name: 'Low-Carbon Concrete',
      factor: 0.13,
      carbon_footprint_kgco2e_kg: 0.13,
      unit: 'kg',
      region: 'Australia',
      tags: ['sustainable', 'alternative'],
      sustainabilityScore: 85,
      recyclability: 'Medium',
      alternativeTo: 'concrete',
      category: 'Concrete',
      description: 'A sustainable alternative to traditional concrete that reduces carbon emissions.'
    });
  }
  
  if (materialType.includes('steel')) {
    alternatives.push({
      id: 'alt-steel-1',
      name: 'Recycled Steel',
      factor: 0.7,
      carbon_footprint_kgco2e_kg: 0.7,
      unit: 'kg',
      region: 'Australia',
      tags: ['recycled', 'alternative'],
      sustainabilityScore: 90,
      recyclability: 'High',
      alternativeTo: 'steel',
      category: 'Steel',
      description: 'Steel produced from recycled materials with lower embodied carbon.'
    });
  }
  
  return alternatives;
}

/**
 * Generates sample recommendations for demo purposes
 */
export function generateSampleRecommendations(materials: MaterialInput[]): MaterialRecommendation[] {
  if (!materials.length) return [];
  
  // Generate sample recommendations for the first 2 materials
  const recommendations: MaterialRecommendation[] = [];
  
  const sampleDetails: Record<string, {
    alternative: string;
    reduction: number;
    details: string;
  }> = {
    'concrete': {
      alternative: 'Low-Carbon Concrete',
      reduction: 32.5,
      details: 'Low-carbon concrete reduces emissions by using alternative cementitious materials and optimized mix designs.'
    },
    'timber': {
      alternative: 'FSC-Certified Engineered Timber',
      reduction: 25.7,
      details: 'FSC-certified engineered timber products come from sustainably managed forests and have improved structural properties.'
    },
    'steel': {
      alternative: 'Recycled Steel',
      reduction: 40.2,
      details: 'Recycled steel reduces carbon emissions by avoiding energy-intensive primary production while maintaining strength.'
    },
    'glass': {
      alternative: 'Low-E Triple-Glazed Glass',
      reduction: 22.8,
      details: 'Triple-glazed glass with low-e coatings offers superior insulation performance, reducing energy consumption.'
    }
  };
  
  // Generate recommendations for up to 3 materials
  const materialsToProcess = materials.slice(0, 3);
  
  materialsToProcess.forEach(material => {
    const materialLower = material.type.toLowerCase();
    let recommendationInfo = null;
    
    // Find matching sample data
    for (const [key, info] of Object.entries(sampleDetails)) {
      if (materialLower.includes(key)) {
        recommendationInfo = info;
        break;
      }
    }
    
    // If no match found, create generic recommendation
    if (!recommendationInfo) {
      recommendationInfo = {
        alternative: `Eco-Friendly ${material.type}`,
        reduction: 15 + Math.round(Math.random() * 20),
        details: `This sustainable alternative to ${material.type} reduces carbon footprint while maintaining performance.`
      };
    }
    
    recommendations.push({
      originalMaterial: material.type,
      recommendedMaterial: recommendationInfo.alternative,
      potentialReduction: recommendationInfo.reduction,
      costImpact: Math.random() > 0.5 ? 'similar' : 'higher',
      availability: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      details: recommendationInfo.details
    });
  });
  
  return recommendations;
}
