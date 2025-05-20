
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MaterialInput } from "@/lib/carbonExports";
import { MaterialCategory, SustainableMaterial } from "supabase/functions/get-sustainability-suggestions/Material";

/**
 * Service for interacting with sustainability APIs and tracking material performance
 */

export interface MaterialPerformanceData {
  materialId: string;
  materialName: string;
  carbonFootprint: number;
  sustainabilityScore: number;
  timestamp: string;
  projectId?: string;
  alternatives?: SustainableMaterial[];
}

export interface SustainabilityTrendData {
  materialId: string;
  materialName: string;
  dataPoints: {
    timestamp: string;
    carbonFootprint: number;
    sustainabilityScore: number;
  }[];
  improvement: number; // Percentage improvement over time
}

export interface MaterialRecommendation {
  originalMaterial: string;
  recommendedMaterial: string;
  potentialReduction: number; // Percentage reduction in carbon footprint
  costImpact: 'lower' | 'similar' | 'higher';
  availability: 'low' | 'medium' | 'high';
  details: string;
}

/**
 * Fetch sustainable alternatives for a given material
 */
export async function fetchSustainableAlternatives(materialType: string, quantity: number = 1): Promise<SustainableMaterial[]> {
  try {
    console.log(`Fetching sustainable alternatives for ${materialType}...`);
    
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .eq('alternativeto', materialType);
    
    if (error) {
      console.error("Error fetching alternatives:", error);
      return [];
    }
    
    // Map to the SustainableMaterial format with proper MaterialCategory typing
    return (data || []).map(item => {
      // Map string category to MaterialCategory enum
      let category: MaterialCategory;
      switch(item.category?.toLowerCase()) {
        case 'concrete': category = MaterialCategory.CONCRETE; break;
        case 'steel': category = MaterialCategory.STEEL; break;
        case 'timber':
        case 'wood': category = MaterialCategory.TIMBER; break;
        case 'brick': category = MaterialCategory.BRICK; break;
        case 'aluminum': category = MaterialCategory.ALUMINUM; break;
        case 'glass': category = MaterialCategory.GLASS; break;
        case 'insulation': category = MaterialCategory.INSULATION; break;
        default: category = MaterialCategory.OTHER;
      }
      
      return {
        id: item.id || `alt-${Math.random().toString(36).substring(7)}`,
        name: item.name || 'Alternative Material',
        carbonFootprint: item.carbon_footprint_kgco2e_kg || 0,
        category,
        alternativeTo: materialType,
        sustainabilityScore: item.sustainabilityscore || 70,
        carbonReduction: calculateReduction(item.carbon_footprint_kgco2e_kg, getBaseMaterialFootprint(materialType)),
        costDifference: getCostDifference(materialType, item.name),
        availability: item.tags?.includes('high-availability') ? 'high' : 
                   item.tags?.includes('low-availability') ? 'low' : 'medium',
        recyclable: item.recyclability === 'High',
        locallySourced: item.tags?.includes('local')
      };
    });
  } catch (err) {
    console.error(`Error fetching alternatives for ${materialType}:`, err);
    return [];
  }
}

/**
 * Track material performance data
 * Instead of storing in Supabase, we'll use an in-memory approach until the table is created
 */
export async function trackMaterialPerformance(
  materials: MaterialInput[],
  projectId?: string
): Promise<MaterialPerformanceData[]> {
  try {
    // Convert MaterialInput array to MaterialPerformanceData
    const performanceData = materials.map(material => ({
      materialId: `material-${Math.random().toString(36).substring(7)}`,
      materialName: material.type,
      carbonFootprint: calculateCarbonFootprint(material),
      sustainabilityScore: calculateSustainabilityScore(material),
      timestamp: new Date().toISOString(),
      projectId
    }));
    
    /* 
    // We'll comment this out until we create the material_performance table in Supabase
    if (projectId) {
      const { error } = await supabase
        .from('material_performance')
        .insert(performanceData);
        
      if (error) {
        console.error("Failed to store material performance data:", error);
      }
    }
    */
    
    return performanceData;
  } catch (err) {
    console.error("Error tracking material performance:", err);
    toast.error("Failed to track material performance");
    return [];
  }
}

/**
 * Get performance trends for a specific material over time
 * Since we don't have the material_performance table yet, this uses simulated data
 */
export async function getMaterialTrends(materialType: string): Promise<SustainabilityTrendData | null> {
  try {
    // Simulate historical data until we have the table
    const simulatedData = generateSimulatedPerformanceData(materialType);
    
    // Calculate improvement over time
    const firstDataPoint = simulatedData[0].carbonFootprint;
    const lastDataPoint = simulatedData[simulatedData.length - 1].carbonFootprint;
    const improvement = firstDataPoint > 0 ? 
      ((firstDataPoint - lastDataPoint) / firstDataPoint * 100) : 0;
    
    return {
      materialId: `simulated-${Math.random().toString(36).substring(7)}`,
      materialName: materialType,
      dataPoints: simulatedData.map(d => ({
        timestamp: d.timestamp,
        carbonFootprint: d.carbonFootprint,
        sustainabilityScore: d.sustainabilityScore
      })),
      improvement
    };
    
    /* 
    // We'll use this code once we have the material_performance table
    const { data, error } = await supabase
      .from('material_performance')
      .select('*')
      .eq('materialName', materialType)
      .order('timestamp', { ascending: true });
      
    if (error) {
      console.error("Failed to get material trends:", error);
      return null;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    // Calculate improvement over time
    const firstDataPoint = data[0].carbonFootprint;
    const lastDataPoint = data[data.length - 1].carbonFootprint;
    const improvement = firstDataPoint > 0 ? 
      ((firstDataPoint - lastDataPoint) / firstDataPoint * 100) : 0;
    
    return {
      materialId: data[0].materialId,
      materialName: materialType,
      dataPoints: data.map(d => ({
        timestamp: d.timestamp,
        carbonFootprint: d.carbonFootprint,
        sustainabilityScore: d.sustainabilityScore
      })),
      improvement
    };
    */
  } catch (err) {
    console.error("Error getting material trends:", err);
    return null;
  }
}

/**
 * Generate simulated performance data for testing
 */
function generateSimulatedPerformanceData(materialType: string): {
  timestamp: string;
  carbonFootprint: number;
  sustainabilityScore: number;
}[] {
  const today = new Date();
  const data = [];
  
  // Initial values based on material type
  let baseCarbonFootprint = getBaseMaterialFootprint(materialType);
  let baseSustainabilityScore = getBaseMaterialSustainabilityScore(materialType);
  
  // Generate data points for the last 6 months
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    
    // Gradually improve metrics over time (decrease carbon, increase sustainability)
    const improvementFactor = (6 - i) / 20; // 0 to 0.3 improvement factor
    const carbonFootprint = Math.max(0, baseCarbonFootprint * (1 - improvementFactor));
    const sustainabilityScore = Math.min(100, baseSustainabilityScore * (1 + improvementFactor));
    
    data.push({
      timestamp: date.toISOString(),
      carbonFootprint,
      sustainabilityScore
    });
  }
  
  return data;
}

/**
 * Get material recommendations based on performance data
 */
export async function getMaterialRecommendations(materials: MaterialInput[]): Promise<MaterialRecommendation[]> {
  try {
    const recommendations: MaterialRecommendation[] = [];
    
    // Process each material and find alternatives
    for (const material of materials) {
      const alternatives = await fetchSustainableAlternatives(material.type, Number(material.quantity));
      
      // Find the best alternative based on carbon reduction
      const bestAlternative = alternatives.reduce((best, current) => {
        return (current.carbonReduction > (best?.carbonReduction || 0)) ? current : best;
      }, null as SustainableMaterial | null);
      
      if (bestAlternative) {
        recommendations.push({
          originalMaterial: material.type,
          recommendedMaterial: bestAlternative.name,
          potentialReduction: bestAlternative.carbonReduction,
          costImpact: bestAlternative.costDifference && bestAlternative.costDifference > 5 ? 
                     'higher' : bestAlternative.costDifference && bestAlternative.costDifference < -5 ? 
                     'lower' : 'similar',
          availability: bestAlternative.availability || 'medium',
          details: `Replacing ${material.type} with ${bestAlternative.name} can reduce carbon footprint by approximately ${bestAlternative.carbonReduction}% while maintaining similar performance characteristics.`
        });
      }
    }
    
    return recommendations;
  } catch (err) {
    console.error("Error getting material recommendations:", err);
    return [];
  }
}

// Helper functions

function calculateCarbonFootprint(material: MaterialInput): number {
  // Basic calculation based on quantity and material type
  const quantity = Number(material.quantity) || 1;
  const baseFootprint = getBaseMaterialFootprint(material.type);
  return baseFootprint * quantity;
}

function calculateSustainabilityScore(material: MaterialInput): number {
  // Base sustainability score for the material type
  const baseScore = getBaseMaterialSustainabilityScore(material.type);
  
  // Additional factors - safely access optional properties
  const recycledContentFactor = material.recycledContent ? material.recycledContent / 100 * 20 : 0;
  const locallySourcedFactor = material.locallySourced ? 10 : 0;
  
  // Calculate final score (capped at 100)
  return Math.min(100, baseScore + recycledContentFactor + locallySourcedFactor);
}

function getBaseMaterialFootprint(materialType: string): number {
  // Default footprints for common materials
  const footprints: Record<string, number> = {
    concrete: 0.107,
    steel: 1.46,
    timber: 0.42,
    brick: 0.24,
    glass: 0.85,
    aluminum: 8.24,
    insulation: 1.86,
    wood: 0.42 // Alias for timber
  };
  
  return footprints[materialType.toLowerCase()] || 1.0;
}

function getBaseMaterialSustainabilityScore(materialType: string): number {
  // Default sustainability scores (higher is better)
  const scores: Record<string, number> = {
    timber: 80,
    wood: 80, // Alias for timber
    recycledSteel: 75,
    lowCarbonConcrete: 70,
    brick: 65,
    insulation: 60,
    glass: 55,
    concrete: 50,
    steel: 45,
    aluminum: 40
  };
  
  return scores[materialType] || 50;
}

function calculateReduction(alternativeFootprint: number, originalFootprint: number): number {
  if (!originalFootprint || originalFootprint <= 0) return 0;
  if (!alternativeFootprint) return 0;
  
  const reduction = ((originalFootprint - alternativeFootprint) / originalFootprint) * 100;
  return Math.round(Math.max(0, reduction));
}

function getCostDifference(originalMaterial: string, alternativeMaterial: string): number {
  // Simulated cost differences between materials
  const costDifferences: Record<string, Record<string, number>> = {
    concrete: {
      'Low-Carbon Concrete': 5,
      'Geopolymer Concrete': 8,
      'Concrete with Recycled Aggregate': -2
    },
    steel: {
      'Recycled Steel': -3,
      'High-Strength Steel': 7
    },
    timber: {
      'FSC Certified Timber': 4,
      'Cross-Laminated Timber': 6,
      'Reclaimed Timber': -2
    },
    wood: {
      'FSC Certified Timber': 4,
      'Cross-Laminated Timber': 6,
      'Reclaimed Timber': -2
    }
  };
  
  if (costDifferences[originalMaterial] && costDifferences[originalMaterial][alternativeMaterial]) {
    return costDifferences[originalMaterial][alternativeMaterial];
  }
  
  // Default to a slight premium for sustainable alternatives
  return 3;
}
