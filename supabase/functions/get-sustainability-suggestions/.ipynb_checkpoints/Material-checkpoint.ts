// Material interface definition
export interface Material {
  name: string;
  quantity?: number;
  type?: string;
  unit?: string;
  embodiedCarbon?: number;
  recycledContent?: number;
  locallySourced?: boolean;
  certifications?: string[];
  alternatives?: string[];
  manufacturer?: string;
  description?: string;
  cost?: number;
  [key: string]: unknown;
}

// Material category enum
export enum MaterialCategory {
  STRUCTURAL = "structural",
  FINISHING = "finishing",
  INSULATION = "insulation",
  ROOFING = "roofing",
  FLOORING = "flooring",
  OTHER = "other"
}

// Material with sustainability metrics
export interface SustainableMaterial extends Material {
  sustainabilityScore: number;
  carbonFootprint: number;
  recyclability: number;
  renewableContent?: number;
  biodegradable?: boolean;
  lifespan?: number;
  maintenanceRequirements?: string[];
  waterFootprint?: number;
}
