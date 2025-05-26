/**
 * Types for database entities
 */

export interface DatabaseMaterial {
  id: number;
  material: string;
  description?: string;
  co2e_min?: number;
  co2e_max?: number;
  co2e_avg?: number;
  sustainability_score?: number;
  sustainability_notes?: string;
  applicable_standards?: string;
  ncc_requirements?: string;
  category_id?: string;
}

export interface MaterialView {
  id: string;
  name: string;
  material?: string;
  factor?: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainability_score?: number;
  recyclability?: string;
  notes?: string;
  category?: string;
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  description?: string;
  applicable_standards?: string;
  ncc_requirements?: string;
  category_id?: string;
} 