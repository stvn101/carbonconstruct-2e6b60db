
import { ExtendedMaterialData } from './materials/materialTypes';

export type MaterialsByRegion = Record<string, number>;

export interface MaterialOption {
  id: string;
  name: string;
}

// Re-export for backward compatibility
export type { ExtendedMaterialData };
