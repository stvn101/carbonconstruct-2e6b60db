
/**
 * Utility functions for mapping material data between formats
 */
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { createDatabaseMaterialId } from '../materialAdapter';

/**
 * Maps raw database materials to the expected format
 * @param materials Raw materials from database
 * @returns Properly formatted materials
 */
export function mapDatabaseMaterials(materials: any[]): ExtendedMaterialData[] {
  if (!materials || !Array.isArray(materials)) {
    console.warn('Invalid materials data provided for mapping');
    return [];
  }
  
  return materials.map(material => {
    // Skip invalid materials
    if (!material) return null;
    
    // Create a proper material ID with database prefix if needed
    const id = material.id ? 
      (material.id.toString().startsWith('db-') ? material.id : createDatabaseMaterialId(material.id)) : 
      null;
    
    return {
      id: material.id?.toString() || null,
      name: material.name || material.material_name || 'Unknown Material',
      factor: Number(material.carbon_footprint_kgco2e_kg) || Number(material.factor) || 1.0,
      unit: material.unit || 'kg',
      region: material.region || 'Global',
      tags: Array.isArray(material.tags) ? material.tags : 
            (material.tags ? [material.tags] : 
            (material.category ? [material.category] : [])),
      category: material.category || 'Other',
      sustainabilityScore: Number(material.sustainability_score) || 50,
      recyclability: material.recyclability || 'Medium',
      alternativeTo: material.alternativeTo || null,
      notes: material.notes || '',
      description: material.description || ''
    };
  }).filter(Boolean); // Remove any null entries
}

/**
 * Prepares materials for storage in the cache
 * @param materials Materials to prepare
 * @returns Prepared materials
 */
export function prepareMaterialsForCache(materials: ExtendedMaterialData[]): ExtendedMaterialData[] {
  return materials.map(material => {
    // Ensure all required fields have values
    return {
      ...material,
      id: material.id || `material-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: material.name || 'Unknown Material',
      factor: typeof material.factor === 'number' ? material.factor : 1.0,
      unit: material.unit || 'kg',
      region: material.region || 'Global',
      tags: Array.isArray(material.tags) ? material.tags : [],
      category: material.category || 'Other',
      sustainabilityScore: typeof material.sustainabilityScore === 'number' ? material.sustainabilityScore : 50,
      recyclability: material.recyclability || 'Medium'
    };
  });
}
