
import { ExtendedMaterialInput, ExtendedTransportInput, ExtendedEnergyInput, SuggestionsResponse } from './types';
import { ALTERNATIVE_MATERIALS } from '@/lib/materials/alternative';

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
  
  // Material-specific suggestions
  const materialSuggestions = generateMaterialSpecificSuggestions(materials);
  
  // Transport-specific suggestions
  const transportSuggestions = generateTransportSpecificSuggestions(transport);
  
  // Energy-specific suggestions
  const energySuggestions = generateEnergySpecificSuggestions(energy);
  
  // Identify priority areas
  const priorities: string[] = [];
  
  // Check if concrete is used in large quantities
  const concreteInputs = materials.filter(m => m.type.toLowerCase().includes('concrete'));
  if (concreteInputs.some(m => {
    const quantity = typeof m.quantity === 'string' ? parseFloat(m.quantity) : m.quantity;
    return !isNaN(Number(quantity)) && Number(quantity) > 100;
  })) {
    priorities.push('Priority: Replace traditional concrete with lower-carbon alternatives such as geopolymer concrete or concrete with recycled aggregates');
  }
  
  // Check if steel is used in large quantities and suggest alternatives
  const steelInputs = materials.filter(m => m.type.toLowerCase().includes('steel'));
  if (steelInputs.some(m => {
    const quantity = typeof m.quantity === 'string' ? parseFloat(m.quantity) : m.quantity;
    return !isNaN(Number(quantity)) && Number(quantity) > 50;
  })) {
    priorities.push('Priority: Consider recycled steel or cross-laminated timber alternatives where structurally appropriate');
  }
  
  // Check if there's long-distance transport
  if (transport.some(t => {
    const distance = typeof t.distance === 'string' ? parseFloat(t.distance) : t.distance;
    return !isNaN(Number(distance)) && Number(distance) > 200;
  })) {
    priorities.push('Priority: Source materials locally to reduce transportation emissions or consider rail instead of road transport for long distances');
  }
  
  // Check if there's high energy use
  if (energy.some(e => {
    const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
    return !isNaN(Number(amount)) && Number(amount) > 1000;
  })) {
    priorities.push('Priority: Implement on-site renewable energy generation and utilize energy-efficient construction equipment');
  }
  
  // Combine all suggestions
  const allSuggestions = [
    ...priorities,
    ...materialSuggestions,
    ...transportSuggestions,
    ...energySuggestions,
    ...generalSuggestions
  ];
  
  return {
    suggestions: allSuggestions,
    prioritySuggestions: priorities,
    metadata: {
      source: 'local',
      count: allSuggestions.length,
      categories: {
        material: materialSuggestions.length,
        transport: transportSuggestions.length,
        energy: energySuggestions.length,
        general: generalSuggestions.length,
        priority: priorities.length
      },
      generatedAt: new Date().toISOString()
    }
  };
};

// Generate material-specific suggestions
const generateMaterialSpecificSuggestions = (materials: ExtendedMaterialInput[]): string[] => {
  const suggestions: string[] = [];
  
  // Count materials by type to identify frequently used materials
  const materialCounts = materials.reduce((counts, material) => {
    const type = material.type.toLowerCase();
    counts[type] = (counts[type] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  
  // Generate suggestions for common materials
  if (materialCounts['concrete'] || materials.some(m => m.type.toLowerCase().includes('concrete'))) {
    suggestions.push('Consider using geopolymer concrete which can reduce carbon emissions by up to 80%');
    suggestions.push('Incorporate recycled aggregate in concrete mixes to reduce virgin material use');
  }
  
  if (materialCounts['steel'] || materials.some(m => m.type.toLowerCase().includes('steel'))) {
    suggestions.push('Use recycled steel which has a significantly lower carbon footprint than virgin steel');
    suggestions.push('Consider electric arc furnace (EAF) steel which has lower emissions than basic oxygen furnace (BOF) steel');
  }
  
  if (materialCounts['timber'] || materials.some(m => m.type.toLowerCase().includes('wood'))) {
    suggestions.push('Ensure all timber is sourced from certified sustainable forests (FSC or PEFC certified)');
    suggestions.push('Consider engineered timber products like CLT as alternatives to traditional structural materials');
  }
  
  if (materialCounts['insulation'] || materials.some(m => m.type.toLowerCase().includes('insulation'))) {
    suggestions.push('Use natural insulation materials such as hemp or sheep wool instead of synthetic alternatives');
  }
  
  if (materialCounts['glass'] || materials.some(m => m.type.toLowerCase().includes('glass'))) {
    suggestions.push('Optimize glazing designs to balance natural lighting and thermal performance');
    suggestions.push('Consider low-carbon glass manufacturing processes for your glazing requirements');
  }
  
  // Check for recyclable materials
  const nonRecyclableCount = materials.filter(m => m.recyclable === false).length;
  if (nonRecyclableCount > 0) {
    suggestions.push(`Replace ${nonRecyclableCount} non-recyclable materials with recyclable alternatives`);
  }
  
  // Check for locally sourced materials
  const nonLocalCount = materials.filter(m => m.locallySourced === false).length;
  if (nonLocalCount > 0) {
    suggestions.push(`Source ${nonLocalCount} materials locally to reduce transportation emissions`);
  }
  
  return suggestions;
};

// Generate transport-specific suggestions
const generateTransportSpecificSuggestions = (transport: ExtendedTransportInput[]): string[] => {
  const suggestions: string[] = [];
  
  // Analyze transport modes
  const transportModes = transport.map(t => t.type.toLowerCase());
  const hasRoadTransport = transportModes.some(m => m.includes('road') || m.includes('truck'));
  const hasAirTransport = transportModes.some(m => m.includes('air'));
  
  if (hasRoadTransport) {
    suggestions.push('Optimize delivery routes to minimize fuel consumption');
    suggestions.push('Consider using electric or hybrid vehicles for material transport');
  }
  
  if (hasAirTransport) {
    suggestions.push('Avoid air freight for construction materials whenever possible - it has significantly higher emissions');
    suggestions.push('Plan procurement well in advance to allow for sea or rail shipping instead of air');
  }
  
  // Long distance transport
  const longDistanceTransports = transport.filter(t => {
    const distance = typeof t.distance === 'string' ? parseFloat(t.distance) : t.distance;
    return !isNaN(Number(distance)) && Number(distance) > 100;
  });
  
  if (longDistanceTransports.length > 0) {
    suggestions.push('Consider rail transport instead of road for long-distance material delivery');
    suggestions.push('Investigate bulk shipping options to reduce the number of transport trips');
  }
  
  // Analyze fuel types
  const dieselTransports = transport.filter(t => t.fuelType?.toLowerCase().includes('diesel'));
  if (dieselTransports.length > 0) {
    suggestions.push('Transition from diesel to biodiesel or renewable electric for transport fleets');
  }
  
  return suggestions;
};

// Generate energy-specific suggestions
const generateEnergySpecificSuggestions = (energy: ExtendedEnergyInput[]): string[] => {
  const suggestions: string[] = [];
  
  // Analyze energy types
  const energyTypes = energy.map(e => e.type.toLowerCase());
  const hasElectricity = energyTypes.some(e => e.includes('electricity'));
  const hasFossilFuel = energyTypes.some(e => 
    e.includes('diesel') || e.includes('petrol') || e.includes('gas') || e.includes('coal')
  );
  
  if (hasElectricity) {
    suggestions.push('Switch to renewable electricity providers or on-site renewable generation');
    suggestions.push('Implement smart metering to monitor and optimize electricity usage');
  }
  
  if (hasFossilFuel) {
    suggestions.push('Transition from fossil fuel-powered equipment to electric alternatives where possible');
    suggestions.push('Implement equipment maintenance programs to ensure optimal efficiency');
  }
  
  // High energy usage
  const highEnergyInputs = energy.filter(e => {
    const amount = typeof e.amount === 'string' ? parseFloat(e.amount) : e.amount;
    return !isNaN(Number(amount)) && Number(amount) > 500;
  });
  
  if (highEnergyInputs.length > 0) {
    suggestions.push('Implement energy efficiency measures such as LED lighting and efficient HVAC systems');
    suggestions.push('Consider energy storage solutions to optimize renewable energy usage');
  }
  
  return suggestions;
};
