
export interface ExtendedMaterialData {
  id?: string;
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;  // Corrected property name
  notes?: string;
  tags?: string[];
  sustainabilityScore?: number;  // Corrected property name
  recyclability?: "High" | "Medium" | "Low";
  category?: string;
}

export type MaterialsByRegion = Record<string, number>;

export interface MaterialOption {
  id: string;
  name: string;
}

