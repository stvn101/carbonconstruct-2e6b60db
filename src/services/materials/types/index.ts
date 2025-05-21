
/**
 * Material types export file
 * Exports all material-related types from a central location
 */
export * from './unifiedMaterialTypes';
// Export specific types from materialTypes to avoid duplicate exports
export {
  MaterialsByRegion,
  MaterialOption
} from '@/lib/materials/materialTypes';
export * from '../materialAdapter';
export * from '../materialTypes';

// Re-export common constants
export const MATERIAL_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
export const DEFAULT_MATERIAL_FACTOR = 1.0;
export const DEFAULT_MATERIAL_UNIT = 'kg';
