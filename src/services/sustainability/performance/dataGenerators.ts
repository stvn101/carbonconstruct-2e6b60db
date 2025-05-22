
/**
 * Data generation utilities for sustainability performance
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

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
