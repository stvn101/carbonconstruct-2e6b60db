
export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: "High" | "Medium" | "Low";
}

export type MaterialsByRegion = Record<string, number>;

export interface MaterialOption {
  id: string;
  name: string;
}
