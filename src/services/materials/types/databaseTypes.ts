
/**
 * Database types for material data from different sources
 */

// Type for materials from the main materials table
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
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  sustainability_score_is_manual?: boolean;
}

// Type for materials from views (materials_view, etc.)
export interface MaterialView {
  id: string;
  name: string;
  factor: number;
  unit: string;
  region: string;
  category: string;
  recyclability: string;
  tags: string[];
  sustainabilityscore: number;
  carbon_footprint_kgco2e_kg: number;
  carbon_footprint_kgco2e_tonne: number;
  alternativeto?: string;
  notes?: string;
}

// Type for materials from backup table
export interface BackupMaterial {
  id: string;
  name: string;
  factor: number;
  unit: string;
  region: string;
  category: string;
  recyclability: string;
  tags: string[];
  sustainabilityscore: number;
  carbon_footprint_kgco2e_kg: number;
  carbon_footprint_kgco2e_tonne: number;
  alternativeto?: string;
  notes?: string;
}

// Type for material categories
export interface MaterialCategory {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}
