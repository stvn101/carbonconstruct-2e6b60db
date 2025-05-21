
/**
 * Type definitions for sustainability analysis and suggestions
 */

import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

// Extended types with additional sustainability properties
export interface ExtendedMaterialInput extends MaterialInput {
  id?: string; // Added missing property
  factor?: number; // Added missing property
  recyclable?: boolean;
  recycledContent?: number; // percentage
  locallySourced?: boolean;
  embodiedCarbon?: number;
  lifespan?: number;
}

export interface ExtendedTransportInput extends TransportInput {
  id?: string; // Added missing property
  factor?: number; // Added missing property
  fuelType?: string;
  electricVehicle?: boolean;
  averageLoad?: number;
}

export interface ExtendedEnergyInput extends EnergyInput {
  id?: string; // Added missing property
  factor?: number; // Added missing property
  renewablePercentage?: number;
  gridEmissionsIntensity?: number;
}

// Sustainability analysis options
export interface SustainabilityAnalysisOptions {
  format?: 'basic' | 'detailed' | 'comprehensive';
  includeLifecycleAnalysis?: boolean;
  includeComplianceDetails?: boolean;
  targetRating?: number;
  region?: string;
  buildingType?: string;
}

// Response structure for suggestions
export interface SuggestionsResponse {
  suggestions: string[];
  prioritySuggestions?: string[];
  report?: any; // Detailed report data
  metadata: SuggestionMetadata;
}

// Metadata about the suggestions
export interface SuggestionMetadata {
  source: 'api' | 'fallback' | 'cache';
  count: number;
  categories: {
    material: number;
    transport: number;
    energy: number;
    general: number;
    priority: number;
  };
  generatedAt: string; // ISO date string
}
