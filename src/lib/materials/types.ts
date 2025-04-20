
export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

// Material types for organization
export const MATERIAL_TYPES = {
  STRUCTURAL: "structural",
  RECYCLED: "recycled",
  SUSTAINABLE: "sustainable",
  CONCRETE: "concrete",
  METAL: "metal",
  WOOD: "wood",
  INSULATION: "insulation",
  PLUMBING: "plumbing",
  ELECTRICAL: "electrical",
  FINISHES: "finishes",
  HANDOVER: "handover",
  ENERGY: "energy",
  FUEL: "fuel",
  CLADDING: "cladding",
  ROOFING: "roofing",
  NATURAL: "natural",
  STEEL: "steel",
  THERMAL: "thermal",
  DURABLE: "durable",
  RENEWABLE: "renewable",
  ACOUSTIC: "acoustic",
  WATERPROOF: "waterproof",
  FIRE_RESISTANT: "fire-resistant",
  DECORATIVE: "decorative",
  FOUNDATION: "foundation",
  FLOORING: "flooring",
  CEILING: "ceiling",
  MEMBRANE: "membrane",
  FINISHING: "finishing",
  ADHESIVE: "adhesive",
  CIVIL: "civil",
  COMMERCIAL: "commercial",
  RESIDENTIAL: "residential",
  LANDSCAPING: "landscaping",
  SPECIALTY: "specialty",
  PAVEMENT: "pavement",
  WATERPROOFING: "waterproofing",
  AGGREGATE: "aggregate",
  PRECAST: "precast",
  INFRASTRUCTURE: "infrastructure",
  EXTERIOR: "exterior",
  INTERIOR: "interior"
} as const;

export type MaterialType = keyof typeof MATERIAL_TYPES;

// Define regions used in materials
export const REGIONS = [
  "Global",
  "Australia",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa"
] as const;

export type Region = typeof REGIONS[number];
