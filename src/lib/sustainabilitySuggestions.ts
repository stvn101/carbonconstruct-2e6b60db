
import { 
  CalculationResult, 
  CalculationInput,
  Material
} from './carbonExports';
import { MATERIAL_FACTORS } from './carbonData';
import { ALL_MATERIAL_FACTORS } from './carbonFactors';

// Combines standard Material type with Australian specific alternatives
export type ExtendedMaterial = Material | 
  'recycledConcrete' | 'greenConcrete' | 'bluesteelRebar' | 
  'ausTimber' | 'ausBrick' | 'bambooCladding';

// Cache results for performance
const suggestionCache = new Map<string, string[]>();
const alternativesCache = new Map<Material, ExtendedMaterial[]>();

// Generate fallback material names for extended materials
const EXTENDED_MATERIAL_NAMES: Record<string, string> = {
  'recycledConcrete': 'Recycled Concrete',
  'greenConcrete': 'Green Concrete',
  'bluesteelRebar': 'BlueSteel Rebar',
  'ausTimber': 'Australian Timber',
  'ausBrick': 'Australian Brick',
  'bambooCladding': 'Bamboo Cladding'
};

// Safely get material name with fallback
export const getMaterialName = (materialType: ExtendedMaterial): string => {
  // First try to get from MATERIAL_FACTORS
  if (materialType in MATERIAL_FACTORS) {
    return MATERIAL_FACTORS[materialType as Material].name;
  }
  
  // Then try ALL_MATERIAL_FACTORS
  if (ALL_MATERIAL_FACTORS && materialType in ALL_MATERIAL_FACTORS) {
    return ALL_MATERIAL_FACTORS[materialType]?.name || EXTENDED_MATERIAL_NAMES[materialType] || String(materialType);
  }
  
  // Fallback to our own mapping
  return EXTENDED_MATERIAL_NAMES[materialType] || String(materialType);
};

// Generates a suggested improvement based on the calculation results
export const generateSuggestions = (result: CalculationResult): string[] => {
  // Create cache key from result
  const cacheKey = JSON.stringify({
    materials: result.breakdownByMaterial,
    transport: result.transportEmissions,
    energy: result.energyEmissions
  });

  // Check cache first
  if (suggestionCache.has(cacheKey)) {
    return suggestionCache.get(cacheKey) || [];
  }

  const suggestions: string[] = [];

  // Find highest emitting material
  const highestMaterial = Object.entries(result.breakdownByMaterial)
    .sort(([, a], [, b]) => b - a)[0];
  
  if (highestMaterial) {
    const [materialKey, materialValue] = highestMaterial;
    const materialPercent = (materialValue / result.materialEmissions) * 100;
    
    if (materialPercent > 30) {
      if (materialKey === "concrete") {
        suggestions.push(`Consider using Green Concrete (Geopolymer) or Recycled Concrete Aggregate which reduces emissions by up to 60%.`);
      } else if (materialKey === "steel") {
        suggestions.push(`Consider sourcing BlueSteel Rebar which is manufactured in Australia with a lower carbon footprint than traditional steel.`);
      } else if (materialKey === "timber") {
        suggestions.push(`Consider using certified Australian Hardwood from sustainable forests for structural elements.`);
      } else {
        suggestions.push(`Consider reducing the use of ${MATERIAL_FACTORS[materialKey as Material]?.name || materialKey} or finding alternatives with lower carbon footprints.`);
      }
    }
  }

  // Check transport emissions
  if (result.transportEmissions > result.totalEmissions * 0.25) {
    suggestions.push("Look for local suppliers to minimize transport distances and emissions. Australian-made materials typically have a lower transport footprint.");
    
    // Check if truck is the main transport method
    if (result.breakdownByTransport.truck && 
        result.breakdownByTransport.truck > result.transportEmissions * 0.6) {
      suggestions.push("Consider using rail transport instead of trucks for long-distance material shipping, which can reduce transport emissions by up to 70%.");
    }
  }

  // Suggest renewable energy
  if (result.breakdownByEnergy.electricity && 
      result.breakdownByEnergy.electricity > result.energyEmissions * 0.4) {
    suggestions.push("Consider powering your construction site with renewable energy sources. Australian construction sites can benefit from abundant solar resources.");
  }

  // Material alternatives specific to Australia
  if (result.materialEmissions > result.totalEmissions * 0.5) {
    suggestions.push("Australia has excellent access to low-carbon building materials. Consider bamboo cladding or recycled materials in non-structural applications.");
  }

  // Always provide a general tip
  suggestions.push("Regular maintenance of equipment and minimizing idle time can significantly reduce energy consumption and carbon emissions on Australian construction sites.");
  
  // Store in cache before returning
  suggestionCache.set(cacheKey, suggestions);
  return suggestions;
};

// Function to find alternative lower-carbon materials
export const findLowerCarbonAlternatives = (material: Material): ExtendedMaterial[] => {
  // Check cache first
  if (alternativesCache.has(material)) {
    return alternativesCache.get(material) || [];
  }

  let alternatives: ExtendedMaterial[] = [];
  
  switch(material) {
    case "concrete":
      alternatives = ["recycledConcrete", "greenConcrete"] as ExtendedMaterial[];
      break;
    case "steel":
      alternatives = ["bluesteelRebar", "ausTimber"] as ExtendedMaterial[];
      break;
    case "timber":
      alternatives = ["ausTimber", "bambooCladding"] as ExtendedMaterial[];
      break;
    case "brick":
      alternatives = ["ausBrick"] as ExtendedMaterial[];
      break;
  }

  // Store in cache before returning
  alternativesCache.set(material, alternatives);
  return alternatives;
};

// Function to estimate potential emissions savings
export const calculatePotentialSavings = (input: CalculationInput): { 
  material: Material, 
  alternative: ExtendedMaterial, 
  originalEmissions: number,
  potentialEmissions: number,
  savings: number,
  savingsPercentage: number
}[] => {
  const savings: { 
    material: Material, 
    alternative: ExtendedMaterial, 
    originalEmissions: number,
    potentialEmissions: number,
    savings: number,
    savingsPercentage: number
  }[] = [];

  input.materials.forEach(material => {
    const alternatives = findLowerCarbonAlternatives(material.type);
    const originalEmission = MATERIAL_FACTORS[material.type].factor * material.quantity;
    
    alternatives.forEach(alt => {
      // Safely access ALL_MATERIAL_FACTORS with fallback
      const altFactor = (ALL_MATERIAL_FACTORS && ALL_MATERIAL_FACTORS[alt]) 
        ? ALL_MATERIAL_FACTORS[alt].factor 
        : MATERIAL_FACTORS[alt as Material]?.factor || MATERIAL_FACTORS[material.type].factor * 0.7; // Fallback factor
        
      const alternativeEmission = altFactor * material.quantity;
      const saved = originalEmission - alternativeEmission;
      const percentage = (saved / originalEmission) * 100;
      
      if (saved > 0) {
        savings.push({
          material: material.type,
          alternative: alt,
          originalEmissions: originalEmission,
          potentialEmissions: alternativeEmission,
          savings: saved,
          savingsPercentage: percentage
        });
      }
    });
  });

  return savings.sort((a, b) => b.savings - a.savings);
};
