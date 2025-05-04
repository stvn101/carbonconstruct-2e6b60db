
/**
 * Material data mapping utilities
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

/**
 * Helper function to ensure recyclability is a valid value
 * @param value The input recyclability value
 * @returns A valid recyclability value
 */
export function validateRecyclability(value: string | null | undefined): "High" | "Medium" | "Low" {
  if (value === "High" || value === "Medium" || value === "Low") {
    return value;
  }
  // Default to Medium if the value is not one of the expected values
  return "Medium";
}

/**
 * Maps database material records to ExtendedMaterialData objects
 * @param data Raw database records
 * @returns Properly typed ExtendedMaterialData array
 */
export function mapDatabaseMaterials(data: any[]): ExtendedMaterialData[] {
  // Map the data to ensure types match our ExtendedMaterialData interface
  return data.map(item => ({
    name: item.name || '',
    factor: item.factor || 0,
    unit: item.unit || 'kg',
    region: item.region || '',
    tags: item.tags || [],
    sustainabilityScore: item.sustainabilityscore,
    recyclability: validateRecyclability(item.recyclability),
    alternativeTo: item.alternativeto,
    notes: item.notes,
    category: item.category
  }));
}
