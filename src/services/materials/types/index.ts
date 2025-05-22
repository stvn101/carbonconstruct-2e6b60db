
/**
 * Material types export file
 * Exports all material-related types from a central location
 */
export * from './unifiedMaterialTypes';

// Import types from materialTypes
import { MaterialsByRegion, MaterialOption } from '@/lib/materials/materialTypes';

// Re-export needed types
export type { MaterialsByRegion, MaterialOption };

export * from '../materialAdapter';
export * from '../materialTypes';

// Re-export common constants
export const MATERIAL_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
export const DEFAULT_MATERIAL_FACTOR = 1.0;
export const DEFAULT_MATERIAL_UNIT = 'kg';
export const CONNECTION_TIMEOUT = 15000; // 15 seconds timeout for connections
