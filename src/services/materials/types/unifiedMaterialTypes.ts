
/**
 * Unified Material Types
 * Consistent type definitions for materials across different data sources
 */
import { MaterialInput } from '@/lib/carbonTypes';

// Source of material data
export enum MaterialDataSource {
  DATABASE = 'database',
  STATIC = 'static',
  FALLBACK = 'fallback',
  CUSTOM = 'custom'
}

// Basic material interface
export interface BaseMaterial {
  id: string;
  name: string;
  factor: number;
  unit?: string;
  source?: MaterialDataSource;
}

// Extended material with additional properties
export interface DetailedMaterial extends BaseMaterial {
  description?: string;
  category?: string;
  region?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  carbon_footprint_kgco2e_kg?: number;
  carbon_footprint_kgco2e_tonne?: number;
  alternativeTo?: string;
  notes?: string;
}

// Material with alternative options
export interface MaterialWithAlternatives extends DetailedMaterial {
  alternatives?: DetailedMaterial[];
}

// Material data with metadata
export interface MaterialData {
  id: string;
  data: DetailedMaterial;
  timestamp: number;
  lastUpdated: string;
  source: MaterialDataSource;
}

// Material search criteria
export interface MaterialSearchCriteria {
  searchTerm?: string;
  category?: string;
  region?: string;
  tags?: string[];
  sustainabilityScoreMin?: number;
  sustainabilityScoreMax?: number;
  recyclability?: 'High' | 'Medium' | 'Low';
  sortBy?: 'name' | 'factor' | 'sustainabilityScore';
  sortDirection?: 'asc' | 'desc';
}

// Material selection for the calculator
export interface MaterialSelection {
  materialInput: MaterialInput;
  materialDetails: DetailedMaterial;
}

// Material resource configuration
export interface MaterialResourceConfig {
  enableCache: boolean;
  cacheTTL: number; // in milliseconds
  preferSource?: MaterialDataSource;
  offlineFallback: boolean;
}

// Material service initialization options
export interface MaterialServiceOptions {
  preload?: boolean;
  resources?: MaterialResourceConfig;
}
