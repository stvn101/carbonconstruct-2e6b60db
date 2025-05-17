
/**
 * Utility functions to help migrate between old and new material schemas
 */
import { Material } from "@/lib/carbonTypes";
import { MATERIAL_FACTORS } from "@/lib/carbonData";
import { fetchMaterials } from "@/services/materialService";

/**
 * Map an old material ID to the new format
 * @param materialId The old material ID
 * @returns The material information in the new format, or null if not found
 */
export async function mapLegacyMaterialId(materialId: string): Promise<any | null> {
  // First try to map using the MATERIAL_FACTORS (built-in constants)
  if (materialId in MATERIAL_FACTORS) {
    return {
      id: materialId,
      name: MATERIAL_FACTORS[materialId as Material]?.name || String(materialId),
      factor: MATERIAL_FACTORS[materialId as Material]?.factor || 0,
      unit: MATERIAL_FACTORS[materialId as Material]?.unit || 'kg'
    };
  }
  
  // If not found, try to fetch from the database
  try {
    const materials = await fetchMaterials();
    
    // Check for name matches (case insensitive)
    const materialByName = materials.find(
      m => m.name.toLowerCase() === materialId.toLowerCase()
    );
    
    if (materialByName) {
      return materialByName;
    }
    
    // Handle prefixed DB materials (format: db-123)
    if (materialId.startsWith('db-')) {
      const dbId = materialId.substring(3);
      const dbMaterial = materials.find(m => m.id === dbId);
      if (dbMaterial) {
        return dbMaterial;
      }
    }
    
    // Not found in either place
    console.warn(`Could not map legacy material ID: ${materialId}`);
    return null;
  } catch (error) {
    console.error("Error mapping legacy material:", error);
    return null;
  }
}

/**
 * Get the emission factor for a material
 * @param materialId The material ID or name
 * @returns The emission factor, or 0 if not found
 */
export async function getMaterialEmissionFactor(materialId: string): Promise<number> {
  if (!materialId) return 0;
  
  const material = await mapLegacyMaterialId(materialId);
  if (material) {
    return material.factor || material.carbon_footprint_kgco2e_kg || 0;
  }
  
  // Fallback to the default MATERIAL_FACTORS
  if (materialId in MATERIAL_FACTORS) {
    return MATERIAL_FACTORS[materialId as Material]?.factor || 0;
  }
  
  return 0;
}
