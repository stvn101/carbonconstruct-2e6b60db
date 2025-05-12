
// Type definitions for sustainability suggestions API

export interface MaterialInput {
  type: string;
  quantity: number;
  unit?: string;
}

export interface TransportInput {
  type: string;
  distance: number;
  weight?: number;
}

export interface EnergyInput {
  type: string;
  amount: number;
  unit?: string;
  quantity?: number;
}

export interface SuggestionResult {
  suggestions: string[];
  prioritySuggestions: string[];
  metadata: {
    source: string;
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
}
