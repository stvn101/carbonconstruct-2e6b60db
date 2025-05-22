
export interface SupabaseMaterial {
  id: number | string;
  material?: string;
  description?: string;
  co2e_min?: number;
  co2e_max?: number;
  co2e_avg?: number;
  sustainability_score?: number;
  sustainability_notes?: string;
  applicable_standards?: string;
  ncc_requirements?: string;
  created_at?: string;
  updated_at?: string;
  category_id?: number;
  // Adding fields that are being used but weren't defined
  name?: string;
  factor?: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: string;
  alternativeTo?: string;
  notes?: string;
  category?: string;
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
}

export interface MaterialWithSustainabilityData {
  id: string;
  name: string;
  description?: string;
  sustainabilityScore?: number;
  co2e?: number;
  factor?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  category?: string;
  region?: string;
  unit?: string;
  alternativeTo?: string;
  tags?: string[];
  notes?: string;
}
