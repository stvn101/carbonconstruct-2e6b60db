
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
    // Check if MATERIAL_FACTORS is available
    if (!MATERIAL_FACTORS || Object.keys(MATERIAL_FACTORS).length === 0) {
      console.warn('MATERIAL_FACTORS is empty, using hard-coded defaults');
      return getHardCodedMaterials();
    }
    
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
      notes: '',
      category: key.includes('concrete') ? 'Concrete' : 
               key.includes('steel') ? 'Metals' :
               key.includes('timber') || key.includes('wood') ? 'Wood' :
               key.includes('glass') ? 'Glass' : 'Other'
    }));
  } catch (error) {
    console.error('Error creating fallback materials:', error);
    return getHardCodedMaterials();
  }
}

/**
 * Last resort hard-coded materials if everything else fails
 */
function getHardCodedMaterials(): ExtendedMaterialData[] {
  console.log('Using hard-coded materials fallback');
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
      notes: "",
      category: "Concrete"
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
      notes: "",
      category: "Metals"
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
      notes: "",
      category: "Wood"
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
      notes: "",
      category: "Glass"
    },
    {
      name: "Aluminum",
      factor: 8.24,
      unit: "kg",
      region: "Australia",
      tags: ["construction"],
      sustainabilityScore: 60,
      recyclability: "High" as "High" | "Medium" | "Low",
      alternativeTo: undefined,
      notes: "",
      category: "Metals"
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
      notes: "",
      category: "Ceramics"
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
      notes: "",
      category: "Insulation"
    },
    {
      name: "Low-Carbon Concrete",
      factor: 0.110,
      unit: "kg",
      region: "Australia",
      tags: ["sustainable", "construction"],
      sustainabilityScore: 85,
      recyclability: "Medium" as "High" | "Medium" | "Low",
      alternativeTo: "Concrete",
      notes: "30% lower carbon footprint than standard concrete",
      category: "Concrete"
    },
    {
      name: "Recycled Steel",
      factor: 0.98,
      unit: "kg",
      region: "Australia",
      tags: ["recycled", "construction"],
      sustainabilityScore: 82,
      recyclability: "High" as "High" | "Medium" | "Low",
      alternativeTo: "Steel",
      notes: "Made from recycled materials",
      category: "Metals"
    },
    {
      name: "Sustainable Timber",
      factor: 0.31,
      unit: "kg",
      region: "Australia",
      tags: ["sustainable", "construction"],
      sustainabilityScore: 90,
      recyclability: "High" as "High" | "Medium" | "Low",
      alternativeTo: "Timber",
      notes: "Sourced from certified sustainable forests",
      category: "Wood"
    }
  ];
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
