
import { CalculationResult } from "./carbonExports";
import { CalculationInput } from "./carbonCalculations";

// Placeholder function for calculating potential savings
export const calculatePotentialSavings = (input: CalculationInput) => {
  // For now return a minimal placeholder, we'll implement this properly later
  return [
    {
      originalEmissions: 1000,
      potentialEmissions: 800,
      savings: 200,
      savingsPercentage: 20,
      material: "concrete",
      alternative: "low-carbon concrete"
    }
  ];
};

// Generate suggestions based on calculation results
export function generateSuggestions(result: CalculationResult): string[] {
  const suggestions: string[] = [];
  
  if (!result) return suggestions;
  
  // Add basic suggestions based on result data
  if (result.materialEmissions > 0) {
    suggestions.push("Consider using low-carbon alternatives for high-emission materials");
    suggestions.push("Source materials locally to reduce embodied carbon");
  }
  
  if (result.transportEmissions > 0) {
    suggestions.push("Optimize transport routes to minimize distances");
    suggestions.push("Consider using lower-emission transport options");
  }
  
  if (result.energyEmissions > 0) {
    suggestions.push("Use renewable energy sources for construction operations");
    suggestions.push("Implement energy-efficient practices on construction sites");
  }
  
  // Add general sustainability suggestions
  suggestions.push("Plan for material reuse and recycling at the end of the building lifecycle");
  suggestions.push("Consider lifecycle assessment in material selection");
  
  // Ensure we have at least a few suggestions
  if (suggestions.length < 3) {
    suggestions.push("Implement a comprehensive materials management plan");
    suggestions.push("Track emissions throughout the construction process");
    suggestions.push("Set emissions reduction targets for your projects");
  }
  
  return suggestions;
}
