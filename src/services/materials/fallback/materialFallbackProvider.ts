
/**
 * Provides fallback materials when API or cache fails
 */
import { MATERIAL_FACTORS } from '@/lib/materials';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Get default fallback materials from local material factors
 */
export function getFallbackMaterials(): ExtendedMaterialData[] {
  console.log('Using fallback materials');
  
  try {
    // Create material data from our static definitions
    return Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
      name: value.name || key,
      factor: value.factor || 0,
      unit: value.unit || 'kg',
      region: 'Australia', // Default region 
      tags: ['construction'], // Default tags
      sustainabilityScore: 70, // Default score
      recyclability: 'Medium' as 'High' | 'Medium' | 'Low',
      alternativeTo: undefined,
      notes: ''
    }));
  } catch (error) {
    console.error('Error creating fallback materials:', error);
    
    // Last resort - return minimal dataset if everything else fails
    return [
      {
        name: "Concrete",
        factor: 0.159,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 70,
        recyclability: "Medium" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      {
        name: "Steel",
        factor: 1.77,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 65,
        recyclability: "High" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      {
        name: "Timber",
        factor: 0.42,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 85,
        recyclability: "High" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      {
        name: "Glass",
        factor: 0.85,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 75,
        recyclability: "High" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      // Additional fallback materials to ensure more than 4
      {
        name: "Aluminum",
        factor: 8.24,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 60,
        recyclability: "High" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      {
        name: "Brick",
        factor: 0.24,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 80,
        recyclability: "Medium" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      },
      {
        name: "Insulation",
        factor: 1.86,
        unit: "kg",
        region: "Australia",
        tags: ["construction"],
        sustainabilityScore: 75,
        recyclability: "Low" as "High" | "Medium" | "Low",
        alternativeTo: undefined,
        notes: ""
      }
    ];
  }
}

/**
 * Get default material categories when API or cache fails
 */
export function getDefaultCategories(): string[] {
  return [
    'Concrete',
    'Metals',
    'Wood',
    'Glass',
    'Insulation',
    'Ceramics',
    'Plastics',
    'Composites',
    'Finishes',
    'Other'
  ];
}
