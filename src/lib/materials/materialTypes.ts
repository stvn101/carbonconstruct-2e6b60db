
export interface ExtendedMaterialData {
  id?: string;
  name?: string;
  factor?: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  alternativeTo?: string;
  notes?: string;
  category?: string;
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  description?: string; // Added description field
}

export enum MATERIAL_TYPES {
  CONCRETE = 'concrete',
  STEEL = 'steel',
  TIMBER = 'timber',
  GLASS = 'glass',
  BRICK = 'brick',
  INSULATION = 'insulation',
  ALUMINUM = 'aluminum',
  PLASTIC = 'plastic',
  COPPER = 'copper',
  GYPSUM = 'gypsum'
}

export enum REGIONS {
  AUSTRALIA = 'Australia',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  ASIA = 'Asia',
  GLOBAL = 'Global'
}

// Adding these types to fix missing exports in types/index.ts
export type MaterialsByRegion = Record<string, number>;
export type MaterialOption = {
  id: string;
  name: string;
};
