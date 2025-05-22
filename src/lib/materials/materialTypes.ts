
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
