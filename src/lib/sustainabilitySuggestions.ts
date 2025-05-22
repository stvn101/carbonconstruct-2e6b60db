
import { CalculationInput, MaterialInput, TransportInput, EnergyInput } from './carbonExports';

interface PotentialSaving {
  material: string;
  alternative: string;
  originalEmissions: number;
  potentialEmissions: number;
  savings: number;
  savingsPercentage: number;
}

export const calculatePotentialSavings = (input: CalculationInput): PotentialSaving[] => {
  const potentialSavings: PotentialSaving[] = [];
  
  // Material substitution opportunities
  input.materials.forEach(material => {
    if (material.type === 'concrete' || material.name === 'Concrete') {
      // Low-carbon concrete alternatives
      const originalEmissions = material.carbonFootprint * material.quantity;
      const potentialEmissions = originalEmissions * 0.7; // 30% reduction
      potentialSavings.push({
        material: 'Concrete',
        alternative: 'Low-carbon concrete with supplementary cementitious materials',
        originalEmissions,
        potentialEmissions,
        savings: originalEmissions - potentialEmissions,
        savingsPercentage: 30
      });
    }
    
    if (material.type === 'steel' || material.name === 'Steel') {
      // Recycled steel alternatives
      const originalEmissions = material.carbonFootprint * material.quantity;
      const potentialEmissions = originalEmissions * 0.6; // 40% reduction
      potentialSavings.push({
        material: 'Steel',
        alternative: 'Recycled steel with electric arc furnace production',
        originalEmissions,
        potentialEmissions,
        savings: originalEmissions - potentialEmissions,
        savingsPercentage: 40
      });
    }
  });
  
  // Transport optimization opportunities
  input.transport.forEach(transport => {
    if (transport.mode === 'truck' || transport.mode === 'Truck') {
      // Electric or hybrid alternatives
      const originalEmissions = transport.carbonFootprint;
      const potentialEmissions = originalEmissions * 0.75; // 25% reduction
      potentialSavings.push({
        material: 'Truck Transport',
        alternative: 'Electric or hybrid vehicle fleet',
        originalEmissions,
        potentialEmissions,
        savings: originalEmissions - potentialEmissions,
        savingsPercentage: 25
      });
    }
  });
  
  // Energy optimization opportunities
  input.energy.forEach(energy => {
    if (energy.type === 'electricity' || energy.type === 'Electricity') {
      // Renewable energy
      const originalEmissions = energy.carbonFootprint;
      const potentialEmissions = originalEmissions * 0.2; // 80% reduction
      potentialSavings.push({
        material: 'Grid Electricity',
        alternative: 'On-site renewable energy (solar + battery)',
        originalEmissions,
        potentialEmissions,
        savings: originalEmissions - potentialEmissions,
        savingsPercentage: 80
      });
    }
    
    if (energy.type === 'diesel' || energy.type === 'Diesel') {
      // Biodiesel blend alternatives
      const originalEmissions = energy.carbonFootprint;
      const potentialEmissions = originalEmissions * 0.8; // 20% reduction
      potentialSavings.push({
        material: 'Diesel Fuel',
        alternative: 'Biodiesel blend (B20)',
        originalEmissions,
        potentialEmissions,
        savings: originalEmissions - potentialEmissions,
        savingsPercentage: 20
      });
    }
  });
  
  return potentialSavings;
};

export const generateSuggestions = (calculationResult: any): string[] => {
  const suggestions: string[] = [
    "Consider using low-carbon alternatives for concrete and steel",
    "Source materials locally to reduce transportation emissions",
    "Implement renewable energy sources on-site during construction",
    "Optimize equipment usage to reduce idle time and fuel consumption",
    "Use recycled and reclaimed materials where possible"
  ];
  
  // Add material-specific suggestions
  if ((calculationResult.breakdownByMaterial && Object.keys(calculationResult.breakdownByMaterial).includes('concrete')) || 
      (calculationResult.breakdownByCategory && calculationResult.breakdownByCategory.materials > 1000)) {
    suggestions.push(
      "Replace Portland cement with geopolymer or supplementary cementitious materials",
      "Consider using carbon-cured concrete where available"
    );
  }
  
  // Add transport-specific suggestions
  if (calculationResult.transportEmissions > 500 || 
      (calculationResult.breakdownByCategory && calculationResult.breakdownByCategory.transport > 500)) {
    suggestions.push(
      "Implement a logistics optimization plan to reduce delivery distances",
      "Use rail transport instead of trucks for long-distance material delivery"
    );
  }
  
  // Add energy-specific suggestions
  if (calculationResult.energyEmissions > 300 || 
      (calculationResult.breakdownByCategory && calculationResult.breakdownByCategory.energy > 300)) {
    suggestions.push(
      "Switch to hybrid or electric construction equipment",
      "Install solar-powered site offices and temporary facilities"
    );
  }
  
  return suggestions;
};
