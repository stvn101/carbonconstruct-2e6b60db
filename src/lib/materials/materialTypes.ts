
export interface ExtendedMaterialData {
  id?: string;
  name: string;
  factor: number;
  unit?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  alternativeTo?: string;
  notes?: string;
  category?: string;
}

export type MaterialsByRegion = Record<string, number>;

export interface MaterialOption {
  id: string;
  name: string;
}
