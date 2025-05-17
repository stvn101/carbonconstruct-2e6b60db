
/**
 * Types for materials from different data sources
 */

// Common core material data structure
export interface BaseMaterialData {
  id: string;
  name: string;
  factor?: number;
  region?: string;
  category?: string;
  unit?: string;
}

// Extended material data with additional fields
export interface ExtendedMaterialData extends BaseMaterialData {
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  tags?: string[];
  alternativeTo?: string;
  notes?: string;
}

// Material as stored in Supabase
export interface SupabaseMaterial extends ExtendedMaterialData {
  id: string;
  name: string; // Maps to 'material' in the new DB schema
  carbon_footprint_kgco2e_kg?: number; // Maps to 'co2e_avg' in the new DB schema
  carbon_footprint_kgco2e_tonne?: number;
  sustainabilityScore?: number; // Maps to 'sustainability_score' in the new DB schema
  recyclability?: 'High' | 'Medium' | 'Low';
  factor?: number; // For backward compatibility
  category?: string; // Maps to 'applicable_standards' in the new DB schema
  region?: string;
  unit?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

// Database material as returned from the public.materials table
export interface DbMaterial {
  id: number;
  material: string;
  description?: string;
  co2e_avg?: number;
  co2e_min?: number;
  co2e_max?: number;
  sustainability_score?: number;
  applicable_standards?: string;
  ncc_requirements?: string;
  sustainability_notes?: string;
  category_id?: number;
}

// Constant for connection timeout
export const CONNECTION_TIMEOUT = 15000; // 15 seconds
