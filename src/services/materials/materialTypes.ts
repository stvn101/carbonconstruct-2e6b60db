
export interface SupabaseMaterial {
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
  created_at?: string;
  updated_at?: string;
  category_id?: number;
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
