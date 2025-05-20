
// Type definitions for sustainability suggestions
export interface SuggestionMetadata {
  source: 'api' | 'local';
  count: number;
  categories: {
    material: number;
    transport: number;
    energy: number;
    general: number;
    priority: number;
  };
  generatedAt: string;
}

export interface SuggestionsResponse {
  suggestions: string[];
  prioritySuggestions?: string[];
  metadata?: SuggestionMetadata;
  report?: any; // Full report object
}

// Extended interfaces for the API request
export interface ExtendedMaterialInput {
  id?: string;
  type: string;
  quantity: number | string;
  unit?: string;
  factor?: number;
  recyclable?: boolean;
  recycledContent?: number;
  locallySourced?: boolean;
}

export interface ExtendedTransportInput {
  id?: string;
  type: string;
  distance: number | string;
  weight?: number | string;
  factor?: number;
  fuelType?: string;
}

export interface ExtendedEnergyInput {
  id?: string;
  type: string;
  amount: number | string;
  unit?: string;
  factor?: number;
}

export interface SustainabilityAnalysisOptions {
  format?: 'basic' | 'detailed' | 'comprehensive';
  includeLifecycleAnalysis?: boolean;
  includeComplianceDetails?: boolean;
}
