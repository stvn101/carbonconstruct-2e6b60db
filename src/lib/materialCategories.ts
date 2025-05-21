
/**
 * Material Categories and Analysis Utilities
 */

import { ExtendedMaterialData } from "./materials/materialTypes";

export interface Material {
  id: string;
  name: string;
  carbon_footprint_kgco2e_kg?: number;
  quantity?: number;
}

export interface MaterialAnalysisResult {
  highImpactMaterials: {
    id: string;
    name: string;
    impact: number;
    percentage: number;
    quantity: number;
    factor: number;
    recyclable?: boolean;
  }[];
  sustainabilityScore: number;
  sustainabilityPercentage: number;
  recommendations: string[];
  alternatives: {
    [materialId: string]: ExtendedMaterialData[];
  };
}

/**
 * Generate a material analysis from material data
 */
export function generateMaterialAnalysis(materials: Material[]): MaterialAnalysisResult {
  if (!materials || materials.length === 0) {
    return {
      highImpactMaterials: [],
      sustainabilityScore: 0,
      sustainabilityPercentage: 0,
      recommendations: [],
      alternatives: {}
    };
  }
  
  // Calculate total impact
  const totalImpact = materials.reduce((sum, material) => {
    const impact = calculateMaterialImpact(material);
    return sum + impact;
  }, 0);
  
  // Identify high impact materials (those contributing >10% to total)
  const highImpactMaterials = materials
    .map(material => {
      const impact = calculateMaterialImpact(material);
      const percentage = totalImpact > 0 ? (impact / totalImpact) * 100 : 0;
      
      return {
        id: material.id,
        name: material.name,
        impact,
        percentage,
        quantity: material.quantity || 0,
        factor: material.carbon_footprint_kgco2e_kg || 0,
        recyclable: false // Default value
      };
    })
    .filter(material => material.percentage >= 10)
    .sort((a, b) => b.impact - a.impact);
  
  // Generate material recommendations based on high impact materials
  const recommendations = generateRecommendations(highImpactMaterials);
  
  // Calculate overall sustainability score (placeholder implementation)
  const sustainabilityScore = calculateSustainabilityScore(materials, highImpactMaterials);
  
  // Calculate sustainability percentage (placeholder)
  const sustainabilityPercentage = Math.min(100, sustainabilityScore);
  
  return {
    highImpactMaterials,
    sustainabilityScore,
    sustainabilityPercentage,
    recommendations,
    alternatives: {} // Empty for now, would be populated by material service
  };
}

/**
 * Calculate the carbon impact of a material
 */
function calculateMaterialImpact(material: Material): number {
  const quantity = Number(material.quantity) || 0;
  const factor = material.carbon_footprint_kgco2e_kg || 1;
  
  return quantity * factor;
}

/**
 * Generate recommendations based on high impact materials
 */
function generateRecommendations(highImpactMaterials: any[]): string[] {
  const recommendations: string[] = [];
  
  if (highImpactMaterials.length === 0) {
    return [
      "No high-impact materials identified. Continue monitoring material usage."
    ];
  }
  
  // Generate specific recommendations based on material types
  highImpactMaterials.forEach(material => {
    const materialName = material.name.toLowerCase();
    
    if (materialName.includes('concrete')) {
      recommendations.push(
        `Consider using low-carbon concrete alternatives for ${material.name}.`,
        `Reduce the quantity of ${material.name} through optimized design.`
      );
    } else if (materialName.includes('steel')) {
      recommendations.push(
        `Source ${material.name} with higher recycled content.`,
        `Optimize structural design to reduce the quantity of ${material.name}.`
      );
    } else if (materialName.includes('aluminum') || materialName.includes('aluminium')) {
      recommendations.push(
        `Consider using locally sourced ${material.name} to reduce transportation emissions.`,
        `Explore alternatives to ${material.name} with lower embodied carbon.`
      );
    } else {
      recommendations.push(
        `Investigate lower carbon alternatives for ${material.name}.`,
        `Review the specification and quantity of ${material.name}.`
      );
    }
  });
  
  // Add general recommendations
  recommendations.push(
    "Consider life cycle assessment (LCA) when selecting materials.",
    "Prioritize materials with Environmental Product Declarations (EPDs)."
  );
  
  return recommendations;
}

/**
 * Calculate sustainability score based on materials
 */
function calculateSustainabilityScore(materials: Material[], highImpactMaterials: any[]): number {
  // Base score starting point
  let baseScore = 70;
  
  // Adjust based on how many high impact materials
  if (highImpactMaterials.length > 3) {
    baseScore -= 10;
  } else if (highImpactMaterials.length <= 1) {
    baseScore += 10;
  }
  
  // Look for keywords in material names that indicate sustainability
  let sustainableMaterialCount = 0;
  materials.forEach(material => {
    const materialName = material.name.toLowerCase();
    
    if (
      materialName.includes('recycled') ||
      materialName.includes('sustainable') ||
      materialName.includes('low carbon') ||
      materialName.includes('low-carbon') ||
      materialName.includes('reclaimed') ||
      materialName.includes('bio-based')
    ) {
      sustainableMaterialCount++;
    }
  });
  
  // Adjust score based on sustainable materials
  if (materials.length > 0) {
    const sustainableRatio = sustainableMaterialCount / materials.length;
    baseScore += Math.round(sustainableRatio * 20);
  }
  
  // Ensure score is between 0-100
  return Math.min(100, Math.max(0, baseScore));
}
