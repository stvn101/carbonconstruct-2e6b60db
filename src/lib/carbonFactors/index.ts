
export * from './materials';
export * from './transport';
export * from './energy';
export * from './ausSpecific';

// Re-export everything as a combined object
import { MATERIAL_FACTORS } from './materials';
import { TRANSPORT_FACTORS } from './transport';
import { ENERGY_FACTORS } from './energy';
import { AUS_SPECIFIC_MATERIAL_FACTORS } from './ausSpecific';

export const ALL_MATERIAL_FACTORS = {
  ...MATERIAL_FACTORS,
  ...AUS_SPECIFIC_MATERIAL_FACTORS
};

export {
  MATERIAL_FACTORS,
  TRANSPORT_FACTORS,
  ENERGY_FACTORS,
  AUS_SPECIFIC_MATERIAL_FACTORS
};
