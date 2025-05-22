
import { useState, useEffect } from 'react';
import { MaterialInput } from '@/lib/carbonExports';

export interface MaterialAnalysisResult {
  categories: Record<string, MaterialInput[]>;
  materialCount: number;
  sustainabilityIssues: {
    id: string;
    title: string;
    description: string;
    recommendation: string;
  }[];
  sustainabilityStrengths: {
    id: string;
    title: string;
    description: string;
    impact: string;
  }[];
  averageCarbonFootprint: number;
  materialWithHighestFootprint?: MaterialInput;
}

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
  const sustainabilityIssues = [];
  const sustainabilityStrengths = [];
  
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
  
  // Look for common sustainability issues
  if (materials.some(m => (m.type || '').toLowerCase().includes('concrete'))) {
    sustainabilityIssues.push({
      id: 'high-carbon-concrete',
      title: 'High-carbon concrete detected',
      description: 'Traditional concrete has a significant carbon footprint',
      recommendation: 'Consider low-carbon alternatives like geopolymer concrete or concrete with SCMs'
    });
  }
  
  if (!materials.some(m => (m.recycledContent || 0) > 30)) {
    sustainabilityIssues.push({
      id: 'low-recycled-content',
      title: 'Low recycled content',
      description: 'Most materials have low recycled content percentage',
      recommendation: 'Source materials with higher recycled content'
    });
  }
  
  // Look for sustainability strengths
  if (materials.some(m => 
    (m.type || '').toLowerCase().includes('timber') || 
    (m.type || '').toLowerCase().includes('wood'))
  ) {
    sustainabilityStrengths.push({
      id: 'renewable-materials',
      title: 'Renewable materials',
      description: 'Project includes timber/wood which can sequester carbon',
      impact: 'Positive carbon sequestration'
    });
  }
  
  if (materials.some(m => (m.recycledContent || 0) > 50)) {
    sustainabilityStrengths.push({
      id: 'high-recycled-content',
      title: 'High recycled content',
      description: 'Some materials contain over 50% recycled content',
      impact: 'Reduced virgin material extraction'
    });
  }
  
  return {
    categories,
    materialCount: materials.length,
    sustainabilityIssues,
    sustainabilityStrengths,
    averageCarbonFootprint,
    materialWithHighestFootprint
  };
}
