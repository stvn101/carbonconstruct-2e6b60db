
import { MaterialCategoryEnum, SustainableMaterial } from "@/lib/materialCategories";

/**
 * Adapts material data from the Supabase database to our application format
 */
export function adaptMaterialFromSupabase(dbMaterial: any): SustainableMaterial {
  return {
    id: dbMaterial.id || `material-${Math.random().toString(36).substring(2, 9)}`,
    name: dbMaterial.material || dbMaterial.name || '',
    carbonFootprint: dbMaterial.co2e_avg || dbMaterial.carbon_footprint_kgco2e_kg || 0,
    category: getMaterialCategory(dbMaterial.applicable_standards || dbMaterial.category),
    sustainabilityScore: dbMaterial.sustainability_score || dbMaterial.sustainabilityScore || 50,
    alternativeTo: dbMaterial.alternativeTo || '',
    carbonReduction: dbMaterial.carbonReduction || 0,
    costDifference: dbMaterial.costDifference || 0,
    availability: dbMaterial.availability || 'medium',
    recyclable: dbMaterial.recyclable || false,
    recycledContent: dbMaterial.recycledContent || 0,
    locallySourced: dbMaterial.locallySourced || false,
    unit: dbMaterial.unit || 'kg',
    quantity: dbMaterial.quantity || 0
  };
}

/**
 * Maps a string category to our MaterialCategory enum
 */
export function getMaterialCategory(category?: string): string {
  if (!category) return MaterialCategoryEnum.OTHER;
  
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('concrete')) return MaterialCategoryEnum.CONCRETE;
  if (lowerCategory.includes('steel')) return MaterialCategoryEnum.STEEL;
  if (lowerCategory.includes('timber') || lowerCategory.includes('wood')) return MaterialCategoryEnum.TIMBER;
  if (lowerCategory.includes('brick')) return MaterialCategoryEnum.BRICK;
  if (lowerCategory.includes('aluminum') || lowerCategory.includes('aluminium')) return MaterialCategoryEnum.ALUMINUM;
  if (lowerCategory.includes('glass')) return MaterialCategoryEnum.GLASS;
  if (lowerCategory.includes('insulation')) return MaterialCategoryEnum.INSULATION;
  
  return MaterialCategoryEnum.OTHER;
}

/**
 * Creates a unified material service to fetch materials from Supabase
 */
export function createMaterialService() {
  async function fetchMaterialsFromSupabase() {
    try {
      // This would be implemented to fetch from the materials table
      console.log("Fetching materials from Supabase");
      // Implementation would go here
      
      return [];
    } catch (error) {
      console.error("Error fetching materials:", error);
      return [];
    }
  }
  
  return {
    fetchMaterials: fetchMaterialsFromSupabase
  };
}
