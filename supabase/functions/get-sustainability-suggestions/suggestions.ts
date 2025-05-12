
import { MaterialInput, TransportInput, EnergyInput, SuggestionResult } from "./types.ts";

// Generate sustainability suggestions based on inputs
export function generateSuggestions(
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
): SuggestionResult {
  // Initialize categories counters
  const categories = {
    material: 0,
    transport: 0,
    energy: 0,
    general: 0,
    priority: 0
  };

  // Track all suggestions to avoid duplicates
  const allSuggestions = new Set<string>();
  const prioritySuggestions = new Set<string>();
  
  // Generate material-related suggestions
  const materialSuggestions = generateMaterialSuggestions(materials);
  materialSuggestions.forEach(s => {
    if (s.startsWith('Priority:')) {
      prioritySuggestions.add(s);
      categories.priority++;
    } else {
      allSuggestions.add(s);
      categories.material++;
    }
  });
  
  // Generate transport-related suggestions
  const transportSuggestions = generateTransportSuggestions(transport);
  transportSuggestions.forEach(s => {
    if (s.startsWith('Priority:')) {
      prioritySuggestions.add(s);
      categories.priority++;
    } else {
      allSuggestions.add(s);
      categories.transport++;
    }
  });
  
  // Generate energy-related suggestions
  const energySuggestions = generateEnergySuggestions(energy);
  energySuggestions.forEach(s => {
    if (s.startsWith('Priority:')) {
      prioritySuggestions.add(s);
      categories.priority++;
    } else {
      allSuggestions.add(s);
      categories.energy++;
    }
  });
  
  // Always include some general suggestions
  const generalSuggestions = generateGeneralSuggestions();
  generalSuggestions.forEach(s => {
    allSuggestions.add(s);
    categories.general++;
  });
  
  // Build the final list of suggestions with priorities first
  const prioritySuggestionsList = Array.from(prioritySuggestions);
  const regularSuggestionsList = Array.from(allSuggestions);
  
  // All suggestions combined (including priority ones)
  const combinedSuggestions = [...prioritySuggestionsList, ...regularSuggestionsList];
  
  return {
    suggestions: combinedSuggestions,
    prioritySuggestions: prioritySuggestionsList,
    metadata: {
      source: "api",
      count: combinedSuggestions.length,
      categories,
      generatedAt: new Date().toISOString()
    }
  };
}

// Generate material-specific suggestions
function generateMaterialSuggestions(materials: MaterialInput[]): string[] {
  const suggestions: string[] = [];
  
  if (!materials || materials.length === 0) {
    return suggestions;
  }
  
  // Always include these baseline suggestions
  suggestions.push("Source materials locally to reduce embodied carbon");
  suggestions.push("Consider using certified sustainable materials");
  
  // Track material types for specialized suggestions
  const hasConcrete = materials.some(m => m.type.includes('concrete'));
  const hasSteel = materials.some(m => m.type.includes('steel'));
  const hasWood = materials.some(m => m.type.includes('wood') || m.type.includes('timber'));
  const hasInsulation = materials.some(m => m.type.includes('insulation'));
  
  // Material-specific suggestions
  if (hasConcrete) {
    const concreteAmount = materials
      .filter(m => m.type.includes('concrete'))
      .reduce((sum, m) => sum + m.quantity, 0);
      
    if (concreteAmount > 100) {
      suggestions.push("Priority: Replace traditional concrete with geopolymer or low-carbon alternatives");
    } else {
      suggestions.push("Consider using geopolymer or low-carbon concrete alternatives");
    }
    
    suggestions.push("Optimize concrete mix design to reduce cement content");
  }
  
  if (hasSteel) {
    suggestions.push("Use recycled steel products where structural requirements permit");
    
    const steelAmount = materials
      .filter(m => m.type.includes('steel'))
      .reduce((sum, m) => sum + m.quantity, 0);
      
    if (steelAmount > 50) {
      suggestions.push("Priority: Source steel from electric arc furnace production");
    }
  }
  
  if (hasWood) {
    suggestions.push("Use FSC-certified timber products");
    suggestions.push("Consider engineered wood products like cross-laminated timber (CLT)");
  }
  
  if (hasInsulation) {
    suggestions.push("Select insulation materials with low embodied carbon");
    suggestions.push("Consider natural insulation materials like wool, cellulose, or hemp");
  }
  
  return suggestions;
}

// Generate transport-specific suggestions
function generateTransportSuggestions(transport: TransportInput[]): string[] {
  const suggestions: string[] = [];
  
  if (!transport || transport.length === 0) {
    return suggestions;
  }
  
  // Always include these baseline suggestions
  suggestions.push("Optimize delivery schedules to reduce empty return trips");
  
  // Calculate total transport distance
  const totalDistance = transport.reduce((sum, t) => sum + t.distance, 0);
  
  // High-distance transport gets priority suggestion
  if (totalDistance > 500) {
    suggestions.push("Priority: Source materials locally to reduce transportation emissions");
  }
  
  // Transport mode specific suggestions
  const hasTruck = transport.some(t => t.type.includes('truck'));
  const hasTrain = transport.some(t => t.type.includes('train'));
  const hasShip = transport.some(t => t.type.includes('ship'));
  
  if (hasTruck) {
    suggestions.push("Consider using biodiesel or electric trucks for material delivery");
    suggestions.push("Ensure trucks are fully loaded to maximize transport efficiency");
  }
  
  if (hasTrain) {
    suggestions.push("Increase the proportion of materials transported by rail");
  }
  
  if (hasShip) {
    suggestions.push("Select shipping companies with newer, more efficient vessels");
  }
  
  // If only truck transport is used, suggest rail alternatives
  if (hasTruck && !hasTrain && !hasShip) {
    suggestions.push("Consider rail transport as an alternative to trucks for long distances");
  }
  
  return suggestions;
}

// Generate energy-specific suggestions
function generateEnergySuggestions(energy: EnergyInput[]): string[] {
  const suggestions: string[] = [];
  
  if (!energy || energy.length === 0) {
    return suggestions;
  }
  
  // Always include these baseline suggestions
  suggestions.push("Implement energy monitoring systems on construction sites");
  suggestions.push("Turn off equipment when not in use to reduce energy consumption");
  
  // Energy type specific suggestions
  const hasElectricity = energy.some(e => e.type.includes('electricity'));
  const hasDiesel = energy.some(e => e.type.includes('diesel'));
  const hasNaturalGas = energy.some(e => e.type.includes('gas'));
  
  if (hasElectricity) {
    const electricityAmount = energy
      .filter(e => e.type.includes('electricity'))
      .reduce((sum, e) => sum + e.amount, 0);
      
    if (electricityAmount > 1000) {
      suggestions.push("Priority: Switch to certified GreenPower or renewable energy");
    } else {
      suggestions.push("Consider switching to certified GreenPower or renewable energy");
    }
  }
  
  if (hasDiesel) {
    suggestions.push("Use biodiesel blends in construction equipment");
    suggestions.push("Consider hybrid or electric alternatives for diesel equipment");
  }
  
  if (hasNaturalGas) {
    suggestions.push("Evaluate electric alternatives to natural gas heating");
    suggestions.push("Install high-efficiency gas heaters if electric alternatives are not feasible");
  }
  
  return suggestions;
}

// Generate general sustainability suggestions
function generateGeneralSuggestions(): string[] {
  return [
    "Plan for material reuse and recycling at the end of the building lifecycle",
    "Consider lifecycle assessment in material selection",
    "Implement a waste management plan to minimize landfill waste",
    "Design for disassembly to enable future material recovery",
    "Consider using Building Information Modeling (BIM) for optimizing material use",
    "Engage with suppliers on their sustainability commitments"
  ];
}
