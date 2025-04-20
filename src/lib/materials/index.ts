
import { MATERIAL_FACTORS as BASE_MATERIAL_FACTORS } from '@/lib/carbonFactors';
import { ExtendedMaterialData, MATERIAL_TYPES, REGIONS } from './types';
import { ALTERNATIVE_MATERIALS } from './alternative';
import { PLUMBING_MATERIALS } from './plumbing';
import { INSULATION_MATERIALS } from './insulation';
import { ELECTRICAL_MATERIALS } from './electrical';
import { FINISH_MATERIALS } from './finishes';
import { FUEL_MATERIALS } from './fuel';
import { HANDOVER_MATERIALS } from './handover';
import { ENERGY_SYSTEMS } from './energy';
import { OTHER_MATERIALS } from './other';
import { CIVIL_MATERIALS } from './civil';
import { COMMERCIAL_MATERIALS } from './commercial';
import { RESIDENTIAL_MATERIALS } from './residential';
import { LANDSCAPING_MATERIALS } from './landscaping';

// Re-export types and constants
export { MATERIAL_TYPES, REGIONS, type ExtendedMaterialData };

// Base material factors from carbonCalculations
export const MATERIAL_FACTORS = BASE_MATERIAL_FACTORS;

// Define standard materials
const STANDARD_MATERIALS = {
  ...BASE_MATERIAL_FACTORS as Record<string, ExtendedMaterialData>,
};

// Combine all material categories into one export
export const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = {
  ...STANDARD_MATERIALS,
  ...ALTERNATIVE_MATERIALS,
  ...FUEL_MATERIALS,
  ...PLUMBING_MATERIALS,
  ...INSULATION_MATERIALS,
  ...ELECTRICAL_MATERIALS,
  ...FINISH_MATERIALS,
  ...HANDOVER_MATERIALS,
  ...ENERGY_SYSTEMS,
  ...OTHER_MATERIALS,
  ...CIVIL_MATERIALS,
  ...COMMERCIAL_MATERIALS,
  ...RESIDENTIAL_MATERIALS,
  ...LANDSCAPING_MATERIALS
};
