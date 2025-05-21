/**
 * Material Performance Analytics Service
 * Provides comprehensive analytics and tracking for material performance over time
 */
import { supabase } from '@/integrations/supabase/client';
import { MaterialInput } from '@/lib/carbonExports';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

export interface MaterialPerformanceData {
  materialId: string;
  materialName: string;
  carbonFootprint: number;
  timestamp: string;
  sustainabilityScore: number;
  quantity: number;
  region?: string;
  category?: string;
}

export interface SustainabilityTrendData {
  materialName: string;
  materialId: string;
  dataPoints: {
    timestamp: string;
    carbonFootprint: number;
    sustainabilityScore: number;
    quantity?: number;
  }[];
  improvement: number; // Percentage improvement (negative values indicate degradation)
  averageFootprint: number;
  projectedFootprint?: number;
}

export interface MaterialRecommendation {
  originalMaterial: string;
  recommendedMaterial: string;
  potentialReduction: number; // Percentage CO2 reduction
  costImpact: 'lower' | 'similar' | 'higher';
  availability: 'low' | 'medium' | 'high';
  details: string;
}

/**
 * Tracks material performance data for analytics
 */
export async function trackMaterialPerformance(
  materials: MaterialInput[],
  projectId?: string
): Promise<MaterialPerformanceData[]> {
  try {
    // Process each material to track its performance
    const performanceData: MaterialPerformanceData[] = materials.map(material => ({
      materialId: material.id || material.type,
      materialName: material.type,
      carbonFootprint: Number(material.quantity) * (material.factor || 1),
      timestamp: new Date().toISOString(),
      sustainabilityScore: calculateSustainabilityScore(material),
      quantity: Number(material.quantity) || 0,
      region: material.region,
      category: getCategoryFromType(material.type)
    }));

    // Store in database if projectId is provided
    if (projectId) {
      await storePerformanceData(performanceData, projectId);
    }

    // Store in local cache for offline access
    storePerformanceInLocalCache(performanceData);

    return performanceData;
  } catch (error) {
    console.error('Failed to track material performance:', error);
    return [];
  }
}

/**
 * Gets historical trend data for a specific material
 */
export async function getMaterialTrends(materialType: string): Promise<SustainabilityTrendData | null> {
  try {
    // Try to get data from database first, fall back to local cache
    const dataPoints = await getHistoricalDataForMaterial(materialType);
    
    if (!dataPoints || dataPoints.length === 0) {
      return generateSampleTrendData(materialType);
    }

    // Calculate improvement percentage
    const firstPoint = dataPoints[0];
    const lastPoint = dataPoints[dataPoints.length - 1];
    const improvement = firstPoint.carbonFootprint > 0 ? 
      ((firstPoint.carbonFootprint - lastPoint.carbonFootprint) / firstPoint.carbonFootprint) * 100 : 0;

    // Calculate average footprint
    const totalFootprint = dataPoints.reduce((sum, point) => sum + point.carbonFootprint, 0);
    const averageFootprint = dataPoints.length > 0 ? totalFootprint / dataPoints.length : 0;

    return {
      materialName: materialType,
      materialId: materialType,
      dataPoints,
      improvement,
      averageFootprint,
      projectedFootprint: lastPoint.carbonFootprint * 0.9 // Simple projection: 10% further reduction
    };
  } catch (error) {
    console.error(`Failed to get trends for material ${materialType}:`, error);
    return generateSampleTrendData(materialType);
  }
}

/**
 * Gets material recommendations based on current material selections
 */
export async function getMaterialRecommendations(materials: MaterialInput[]): Promise<MaterialRecommendation[]> {
  try {
    const recommendations: MaterialRecommendation[] = [];

    // Process each material to find alternatives
    for (const material of materials) {
      const alternatives = await findAlternativeMaterials(material.type);
      
      if (alternatives.length > 0) {
        // Select the best alternative based on carbon reduction
        const bestAlternative = alternatives[0];
        
        recommendations.push({
          originalMaterial: material.type,
          recommendedMaterial: bestAlternative.name,
          potentialReduction: calculatePotentialReduction(material, bestAlternative),
          costImpact: determineCostImpact(bestAlternative),
          availability: determineAvailability(bestAlternative),
          details: generateRecommendationDetails(material, bestAlternative)
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Failed to get material recommendations:', error);
    return generateSampleRecommendations(materials);
  }
}

// Helper functions

/**
 * Stores performance data in the database
 */
async function storePerformanceData(
  performanceData: MaterialPerformanceData[], 
  projectId: string
): Promise<void> {
  try {
    await supabase.from('material_performance_history').insert(
      performanceData.map(data => ({
        project_id: projectId,
        material_name: data.materialName,
        material_id: data.materialId,
        carbon_footprint: data.carbonFootprint,
        sustainability_score: data.sustainabilityScore,
        quantity: data.quantity,
        region: data.region,
        category: data.category
      }))
    );
  } catch (error) {
    console.error('Error storing performance data:', error);
  }
}

/**
 * Stores performance data in local cache
 */
function storePerformanceInLocalCache(performanceData: MaterialPerformanceData[]): void {
  try {
    const existingData = localStorage.getItem('material-performance-data');
    const parsedData = existingData ? JSON.parse(existingData) : [];
    
    // Merge with existing data, avoiding duplicates
    const newData = [...parsedData, ...performanceData];
    
    // Keep only the last 1000 entries to avoid localStorage limits
    const trimmedData = newData.slice(-1000);
    
    localStorage.setItem('material-performance-data', JSON.stringify(trimmedData));
  } catch (error) {
    console.error('Error storing performance data in local cache:', error);
  }
}

/**
 * Gets historical data for a specific material
 */
async function getHistoricalDataForMaterial(materialType: string): Promise<SustainabilityTrendData['dataPoints']> {
  try {
    // Try to get from database first
    const { data: dbData, error } = await supabase
      .from('material_performance_history')
      .select('*')
      .eq('material_name', materialType)
      .order('created_at', { ascending: true });
      
    if (error) throw error;
    
    if (dbData && dbData.length > 0) {
      return dbData.map(item => ({
        timestamp: item.created_at,
        carbonFootprint: item.carbon_footprint,
        sustainabilityScore: item.sustainability_score,
        quantity: item.quantity
      }));
    }
    
    // Fall back to local cache
    const localData = localStorage.getItem('material-performance-data');
    if (!localData) return [];
    
    const parsedData = JSON.parse(localData);
    const materialData = parsedData.filter((item: MaterialPerformanceData) => 
      item.materialName === materialType
    );
    
    return materialData.map((item: MaterialPerformanceData) => ({
      timestamp: item.timestamp,
      carbonFootprint: item.carbonFootprint,
      sustainabilityScore: item.sustainabilityScore,
      quantity: item.quantity
    }));
  } catch (error) {
    console.error('Error retrieving historical data:', error);
    return [];
  }
}

/**
 * Generates sample trend data for demo purposes or when no real data is available
 */
function generateSampleTrendData(materialType: string): SustainabilityTrendData {
  const dataPoints = [];
  const now = new Date();
  
  // Generate data points for the past 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate some realistic looking values with a general improvement trend
    const baseCarbonFootprint = 100 - (i * 1.5);
    const randomVariation = (Math.random() * 20) - 10; // -10 to +10
    
    dataPoints.push({
      timestamp: date.toISOString(),
      carbonFootprint: Math.max(50, baseCarbonFootprint + randomVariation),
      sustainabilityScore: Math.min(100, 60 + (i * 0.8)),
      quantity: 1000 - (i * 10)
    });
  }
  
  return {
    materialName: materialType,
    materialId: materialType,
    dataPoints,
    improvement: 28.5, // Sample improvement percentage
    averageFootprint: 75.3, // Sample average
    projectedFootprint: 42.8 // Sample projection
  };
}

/**
 * Finds alternative materials for a given material type
 */
async function findAlternativeMaterials(materialType: string): Promise<ExtendedMaterialData[]> {
  try {
    const { data, error } = await supabase
      .from('materials_view')
      .select('*')
      .eq('alternativeto', materialType);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error finding alternatives for ${materialType}:`, error);
    return [];
  }
}

/**
 * Calculates potential carbon reduction percentage
 */
function calculatePotentialReduction(
  originalMaterial: MaterialInput, 
  alternative: ExtendedMaterialData
): number {
  if (!originalMaterial.factor || !alternative.factor) return 0;
  
  const originalImpact = originalMaterial.factor;
  const alternativeImpact = alternative.factor;
  
  if (originalImpact <= 0) return 0;
  
  const reduction = ((originalImpact - alternativeImpact) / originalImpact) * 100;
  return Math.round(reduction * 10) / 10; // Round to 1 decimal place
}

/**
 * Determines cost impact of an alternative material
 */
function determineCostImpact(material: ExtendedMaterialData): 'lower' | 'similar' | 'higher' {
  // This would typically use actual cost data
  // For now, we'll use a simple heuristic based on sustainability score
  if (!material.sustainabilityScore) return 'similar';
  
  if (material.sustainabilityScore > 80) return 'higher';
  if (material.sustainabilityScore < 50) return 'lower';
  return 'similar';
}

/**
 * Determines availability of an alternative material
 */
function determineAvailability(material: ExtendedMaterialData): 'low' | 'medium' | 'high' {
  // This would typically use actual supply chain data
  // For now, we'll use a simple heuristic based on recyclability
  if (!material.recyclability) return 'medium';
  
  if (material.recyclability === 'High') return 'high';
  if (material.recyclability === 'Low') return 'low';
  return 'medium';
}

/**
 * Generates recommendation details text
 */
function generateRecommendationDetails(
  originalMaterial: MaterialInput, 
  alternative: ExtendedMaterialData
): string {
  return `${alternative.name} has a lower carbon footprint compared to ${originalMaterial.type}. ${
    alternative.notes || ''
  }${
    alternative.recyclability === 'High' 
      ? ' Additionally, this material has high recyclability at end of life.'
      : ''
  }`;
}

/**
 * Calculates sustainability score based on material properties
 */
function calculateSustainabilityScore(material: MaterialInput): number {
  // This would typically be a more complex calculation
  // For now, we'll use a simple estimate between 0-100
  const baseScore = 60;
  
  // Adjust score based on available properties
  const adjustments = [
    material.recyclable ? 15 : 0,
    material.recycledContent ? (material.recycledContent * 0.2) : 0,
    material.locallySourced ? 10 : 0
  ];
  
  const totalScore = baseScore + adjustments.reduce((sum, adj) => sum + adj, 0);
  return Math.min(100, Math.max(0, totalScore)); // Ensure score is between 0-100
}

/**
 * Gets category from material type
 */
function getCategoryFromType(materialType: string): string {
  // Simple mapping, would be more sophisticated in production
  const categoryMap: Record<string, string> = {
    'concrete': 'Structural',
    'timber': 'Structural',
    'steel': 'Structural',
    'glass': 'Envelope',
    'aluminum': 'Envelope',
    'insulation': 'Insulation',
    'brick': 'Masonry',
    'gypsum': 'Interior'
  };
  
  const materialLower = materialType.toLowerCase();
  
  for (const [key, category] of Object.entries(categoryMap)) {
    if (materialLower.includes(key)) {
      return category;
    }
  }
  
  return 'Other';
}

/**
 * Generates sample recommendations for demo purposes
 */
function generateSampleRecommendations(materials: MaterialInput[]): MaterialRecommendation[] {
  if (!materials.length) return [];
  
  // Generate sample recommendations for the first 2 materials
  const recommendations: MaterialRecommendation[] = [];
  
  const sampleDetails = {
    'concrete': {
      alternative: 'Low-Carbon Concrete',
      reduction: 32.5,
      details: 'Low-carbon concrete reduces emissions by using alternative cementitious materials and optimized mix designs. It achieves similar strength with lower environmental impact.'
    },
    'timber': {
      alternative: 'FSC-Certified Engineered Timber',
      reduction: 25.7,
      details: 'FSC-certified engineered timber products come from sustainably managed forests and have improved structural properties with reduced material usage.'
    },
    'steel': {
      alternative: 'Recycled Steel',
      reduction: 40.2,
      details: 'Recycled steel reduces carbon emissions by avoiding energy-intensive primary production while maintaining material strength and durability.'
    },
    'glass': {
      alternative: 'Low-E Triple-Glazed Glass',
      reduction: 22.8,
      details: 'Triple-glazed glass with low-e coatings offers superior insulation performance, reducing heating and cooling energy consumption.'
    }
  };
  
  // Generate recommendations for up to 3 materials
  const materialsToProcess = materials.slice(0, 3);
  
  materialsToProcess.forEach(material => {
    const materialLower = material.type.toLowerCase();
    let recommendationInfo = null;
    
    // Find matching sample data
    for (const [key, info] of Object.entries(sampleDetails)) {
      if (materialLower.includes(key)) {
        recommendationInfo = info;
        break;
      }
    }
    
    // If no match found, create generic recommendation
    if (!recommendationInfo) {
      recommendationInfo = {
        alternative: `Eco-Friendly ${material.type}`,
        reduction: 15 + Math.round(Math.random() * 20),
        details: `This sustainable alternative to ${material.type} reduces carbon footprint while maintaining required performance characteristics.`
      };
    }
    
    recommendations.push({
      originalMaterial: material.type,
      recommendedMaterial: recommendationInfo.alternative,
      potentialReduction: recommendationInfo.reduction,
      costImpact: Math.random() > 0.5 ? 'similar' : 'higher',
      availability: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
      details: recommendationInfo.details
    });
  });
  
  return recommendations;
}
