
import { useState, useEffect } from 'react';
import { MaterialInput } from '@/lib/carbonExports';
import { MaterialAnalysisResult } from '@/types/materialAnalysis';

export function useMaterialAnalysis(
  materials: MaterialInput[],
  materialBreakdown?: Record<string, number>
) {
  const [materialAnalysis, setMaterialAnalysis] = useState<MaterialAnalysisResult | null>(null);
  
  // Generate material analysis when materials change
  useEffect(() => {
    if (materials && materials.length > 0) {
      const analysis = generateMaterialAnalysis(materials, materialBreakdown);
      setMaterialAnalysis(analysis);
    }
  }, [materials, materialBreakdown]);
  
  return {
    materialAnalysis,
    setMaterialAnalysis
  };
}

function generateMaterialAnalysis(
  materials: MaterialInput[],
  materialBreakdown?: Record<string, number>
): MaterialAnalysisResult {
  // Group materials by type/category
  const categories: Record<string, MaterialInput[]> = {};
  
  // Group materials by type
  materials.forEach(material => {
    const category = material.type || 'Other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(material);
  });
  
  // Calculate average carbon footprint
  const averageCarbonFootprint = materials.reduce((sum, m) => sum + (m.carbonFootprint || 0), 0) / materials.length;
  
  // Find material with highest footprint
  const materialWithHighestFootprint = [...materials].sort((a, b) => 
    (b.carbonFootprint || 0) - (a.carbonFootprint || 0)
  )[0];
  
  const firstMaterial: MaterialInput = {
    type: materials[0]?.type || 'unknown',
    quantity: materials[0]?.quantity || 0,
    unit: materials[0]?.unit || 'kg',
    name: materials[0]?.name || 'Unknown Material',
    carbonFootprint: materials[0]?.carbonFootprint || 0
  };
  
  return {
    material: firstMaterial,
    sustainabilityScore: Math.max(0, Math.min(100, 100 - (averageCarbonFootprint * 10))),
    alternatives: {},
    recommendations: [
      "Consider replacing high-carbon materials with sustainable alternatives",
      "Source materials locally to reduce transportation emissions"
    ],
    materialScores: {},
    impactSummary: `Analysis based on ${materials.length} materials`,
    highImpactMaterials: [],
    sustainabilityPercentage: 50,
    sustainabilityIssues: [],
    categories,
    materialCount: materials.length,
    sustainabilityStrengths: [],
    averageCarbonFootprint,
    materialWithHighestFootprint
  };
}
