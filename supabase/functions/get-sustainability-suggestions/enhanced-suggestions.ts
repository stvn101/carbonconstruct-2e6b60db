
import { Material, SustainableMaterial } from './Material.ts';
import { TransportItem, SustainableTransport } from './Transport.ts';
import { EnergyItem, SustainableEnergy } from './Energy.ts';
import { 
  Suggestion, 
  SuggestionCategory, 
  ImpactLevel, 
  Timeframe, 
  ComplexityLevel,
  SustainabilityMetrics,
  SustainabilityReport,
  ComplianceStatus} from './Report.ts';

/**
 * Generate material suggestions as simple text
 */
export function generateMaterialSuggestionsText(materials: Material[]): string[] {
  const suggestions: string[] = [];

  if (!materials || materials.length === 0) {
    return ["Consider using low-carbon materials to reduce embodied carbon."];
  }

  // Identify high-impact materials and generate suggestions
  const materialImpact = new Map<string, number>();
  materials.forEach(m => {
    const impact = m.carbonFootprint * (m.quantity || 1);
    materialImpact.set(m.name, impact);
  });

  // Sort materials by impact
  const sortedMaterials = Array.from(materialImpact.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3); // Take top 3 high-impact materials

  sortedMaterials.forEach(([name, impact]) => {
    suggestions.push(`Consider lower-carbon alternatives for ${name}.`);
  });

  // Add general suggestions
  suggestions.push("Source materials locally to reduce transport emissions.");
  suggestions.push("Prioritize materials with high recycled content.");
  suggestions.push("Select materials that can be easily disassembled and reused.");

  return suggestions;
}

/**
 * Generate transport suggestions as simple text
 */
export function generateTransportSuggestionsText(transport: TransportItem[]): string[] {
  const suggestions: string[] = [];

  if (!transport || transport.length === 0) {
    return ["Plan efficient transport routes to minimize emissions."];
  }

  // Calculate total transport emissions
  let totalEmissions = 0;
  let airTransport = false;
  let roadTransport = false;

  transport.forEach(t => {
    const itemEmissions = t.emissionsFactor * t.distance * t.weight;
    totalEmissions += itemEmissions;
    
    if (t.type === 'air') airTransport = true;
    if (t.type === 'road') roadTransport = true;
  });

  // Generate specific suggestions based on transport types
  if (airTransport) {
    suggestions.push("Replace air transport with sea or rail where possible.");
  }

  if (roadTransport) {
    suggestions.push("Optimize road transport routes to minimize distance.");
    suggestions.push("Consider using electric or hybrid vehicles for short-distance transport.");
  }

  // Add general suggestions
  suggestions.push("Consolidate shipments to reduce the number of trips.");
  suggestions.push("Implement a local procurement strategy to minimize transport distances.");

  return suggestions;
}

/**
 * Generate energy suggestions as simple text
 */
export function generateEnergySuggestionsText(energy: EnergyItem[]): string[] {
  const suggestions: string[] = [];

  if (!energy || energy.length === 0) {
    return ["Implement renewable energy sources for construction operations."];
  }

  // Check if there are any renewable sources already
  const hasRenewables = energy.some(e => 
    e.source === 'solar' || e.source === 'wind' || e.source === 'battery'
  );

  if (!hasRenewables) {
    suggestions.push("Implement solar power for site operations.");
    suggestions.push("Consider battery storage to optimize energy use.");
  } else {
    suggestions.push("Expand renewable energy capacity to cover more site operations.");
  }

  // Add general suggestions
  suggestions.push("Use energy-efficient equipment and machinery.");
  suggestions.push("Implement an energy management system to track and optimize usage.");
  suggestions.push("Train site personnel on energy-efficient practices.");

  return suggestions;
}

/**
 * Generate comprehensive suggestions text combining all categories
 */
export function generateComprehensiveSuggestionsText(
  materials: Material[],
  transport: TransportItem[],
  energy: EnergyItem[]
): string[] {
  let suggestions: string[] = [];

  // Combine suggestions from all categories
  suggestions = [
    ...generateMaterialSuggestionsText(materials),
    ...generateTransportSuggestionsText(transport),
    ...generateEnergySuggestionsText(energy)
  ];

  // Add design and process suggestions
  suggestions.push("Design buildings for optimal energy performance.");
  suggestions.push("Implement a construction waste management plan.");
  suggestions.push("Consider circular economy principles in project planning.");

  // Return unique suggestions (remove duplicates)
  return Array.from(new Set(suggestions));
}
