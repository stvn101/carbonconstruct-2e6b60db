
import { ExtendedMaterialInput, ExtendedTransportInput, ExtendedEnergyInput, SuggestionsResponse } from './types';

// Generate local fallback suggestions when API fails
export const generateLocalFallbackSuggestions = (
  materials: ExtendedMaterialInput[],
  transport: ExtendedTransportInput[],
  energy: ExtendedEnergyInput[]
): SuggestionsResponse => {
  // Basic generic suggestions
  const generalSuggestions = [
    'Consider using low-carbon alternatives for high-emission materials',
    'Source materials locally to reduce embodied carbon',
    'Optimize transport routes to minimize distances',
    'Consider using lower-emission transport options',
    'Use renewable energy sources for construction operations',
    'Implement energy-efficient practices on construction sites',
    'Plan for material reuse and recycling at the end of the building lifecycle',
    'Consider lifecycle assessment in material selection'
  ];
  
  // Identify priority areas
  const priorities: string[] = [];
  
  // Check if concrete is used in large quantities
  const concreteInputs = materials.filter(m => m.type.toLowerCase().includes('concrete'));
  if (concreteInputs.some(m => {
    const quantity = typeof m.quantity === 'string' ? parseFloat(m.quantity) : m.quantity;
    return !isNaN(Number(quantity)) && Number(quantity) > 100;
  })) {
    priorities.push('Priority: Replace traditional concrete with lower-carbon alternatives');
  }
  
  // Check if there's long-distance transport
  if (transport.some(t => {
    const distance = typeof t.distance === 'string' ? parseFloat(t.distance) : t.distance;
    return !isNaN(Number(distance)) && Number(distance) > 200;
  })) {
    priorities.push('Priority: Source materials locally to reduce transportation emissions');
  }
  
  // Check if there's high energy use
  if (energy.some(e => {
    const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
    return !isNaN(Number(amount)) && Number(amount) > 1000;
  })) {
    priorities.push('Priority: Implement on-site renewable energy generation');
  }
  
  // Combine suggestions, prioritizing the priority ones
  const allSuggestions = [...priorities, ...generalSuggestions];
  
  return {
    suggestions: allSuggestions,
    prioritySuggestions: priorities,
    metadata: {
      source: 'local',
      count: allSuggestions.length,
      categories: {
        material: materials.length > 0 ? 2 : 0,
        transport: transport.length > 0 ? 2 : 0,
        energy: energy.length > 0 ? 2 : 0,
        general: generalSuggestions.length,
        priority: priorities.length
      },
      generatedAt: new Date().toISOString()
    }
  };
};
