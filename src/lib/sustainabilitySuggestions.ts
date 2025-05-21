
import { CalculationResult, CalculationInput, MaterialInput } from './carbonExports';
import { Material } from './carbonTypes';

export function generateSuggestions(result: CalculationResult): string[] {
  const suggestions: string[] = [];

  // Get the total emissions
  const totalEmissions = result.totalEmissions;

  // Check which category contributes the most to emissions
  const materialPercentage = result.materialEmissions / totalEmissions * 100;
  const transportPercentage = result.transportEmissions / totalEmissions * 100;
  const energyPercentage = result.energyEmissions / totalEmissions * 100;

  // Add category-specific suggestions
  if (materialPercentage > 50) {
    suggestions.push('Materials make up over 50% of your emissions. Consider using low-carbon alternatives.');
    suggestions.push('Look into recycled or locally-sourced materials to reduce your carbon footprint.');
  } else if (transportPercentage > 50) {
    suggestions.push('Transportation accounts for over 50% of your emissions. Consider optimizing delivery routes.');
    suggestions.push('Look into more efficient transport methods or local sourcing to reduce transport distances.');
  } else if (energyPercentage > 50) {
    suggestions.push('Energy consumption is your largest emission source. Consider using renewable energy sources.');
    suggestions.push('Implement energy-efficient practices on construction sites to reduce consumption.');
  }

  // Add material-specific suggestions
  const materialBreakdown = result.breakdownByMaterial;
  if (materialBreakdown) {
    const highImpactMaterials = Object.entries(materialBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2);
    
    for (const [material, impact] of highImpactMaterials) {
      const percentage = (impact / result.materialEmissions * 100).toFixed(1);
      
      if (material.includes('concrete')) {
        suggestions.push(`Concrete accounts for ${percentage}% of your material emissions. Consider using low-carbon concrete mixes with fly ash or GGBS.`);
      } else if (material.includes('steel')) {
        suggestions.push(`Steel accounts for ${percentage}% of your material emissions. Consider using recycled steel or optimizing structural designs to use less material.`);
      } else if (material.includes('timber') || material.includes('wood')) {
        suggestions.push(`Wood products account for ${percentage}% of your material emissions. Ensure all timber is sourced from certified sustainable forests.`);
      }
    }
  }

  // Add general sustainability suggestions
  suggestions.push('Consider implementing a material efficiency strategy to reduce waste and optimize usage.');
  suggestions.push('Track and monitor your carbon emissions throughout the project to identify further reduction opportunities.');

  return suggestions;
}

export interface PotentialSaving {
  material: string;
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
  alternative: {
    name: string;
    description: string;
  };
}

export function calculatePotentialSavings(input: CalculationInput): PotentialSaving[] {
  const potentialSavings: PotentialSaving[] = [];

  // Analyze materials for potential savings
  input.materials.forEach((material: MaterialInput) => {
    if (!material.type) return;

    const quantity = Number(material.quantity) || 0;
    if (quantity <= 0) return;

    // Calculate original emissions (simplified calculation)
    const factor = material.factor || 1;
    const originalEmissions = quantity * factor;

    // Check for high-impact materials and suggest alternatives
    if (material.type === 'concrete' || material.type.includes('concrete')) {
      // Suggest low-carbon concrete
      const potentialEmissions = quantity * factor * 0.7; // 30% reduction
      const savings = originalEmissions - potentialEmissions;
      const savingsPercentage = (savings / originalEmissions) * 100;

      potentialSavings.push({
        material: material.type,
        originalEmissions,
        potentialEmissions,
        savings,
        savingsPercentage,
        alternative: {
          name: 'Low-carbon concrete',
          description: 'Concrete with 30% GGBS/fly ash replacement'
        }
      });
    } else if (material.type === 'steel' || material.type.includes('steel')) {
      // Suggest recycled steel
      const potentialEmissions = quantity * factor * 0.6; // 40% reduction
      const savings = originalEmissions - potentialEmissions;
      const savingsPercentage = (savings / originalEmissions) * 100;

      potentialSavings.push({
        material: material.type,
        originalEmissions,
        potentialEmissions,
        savings,
        savingsPercentage,
        alternative: {
          name: 'Recycled steel',
          description: 'Steel with minimum 90% recycled content'
        }
      });
    } else if (material.type === 'insulation' || material.type.includes('insulation')) {
      // Suggest bio-based insulation
      const potentialEmissions = quantity * factor * 0.5; // 50% reduction
      const savings = originalEmissions - potentialEmissions;
      const savingsPercentage = (savings / originalEmissions) * 100;

      potentialSavings.push({
        material: material.type,
        originalEmissions,
        potentialEmissions,
        savings,
        savingsPercentage,
        alternative: {
          name: 'Bio-based insulation',
          description: 'Natural fiber insulation from renewable sources'
        }
      });
    }
  });

  return potentialSavings;
}
