
import { REGIONS, MaterialType } from './types';

export interface MaterialCategory {
  id: string;
  name: string;
  description?: string;
}

export interface MaterialFactor {
  value: number;
  unit: string;
  source?: string;
  year?: number;
}

export interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
  category?: MaterialCategory;
  factors?: Record<string, MaterialFactor>;
  properties?: {
    density?: number;
    thermalConductivity?: number;
    recyclable?: boolean;
    renewable?: boolean;
  };
}

export const MATERIAL_CATEGORIES: MaterialCategory[] = [
  { id: 'structural', name: 'Structural Materials' },
  { id: 'finishes', name: 'Finishes' },
  { id: 'insulation', name: 'Insulation' },
  { id: 'civil', name: 'Civil Engineering' },
  { id: 'commercial', name: 'Commercial Construction' },
  { id: 'residential', name: 'Residential Construction' },
  { id: 'landscaping', name: 'Landscaping' }
];

