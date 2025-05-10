// Type declarations for local modules

// Type declarations for utils module
declare module "utils" {
  export interface CorsHeaders {
    "Access-Control-Allow-Origin": string;
    "Access-Control-Allow-Headers": string;
  }
  
  export const corsHeaders: CorsHeaders;
  export function handleCors(req: Request): Response | null;
}

// Type declarations for suggestions module
declare module "suggestions" {
  interface Material {
    name: string;
    quantity?: number;
    type?: string;
    [key: string]: unknown;
  }

  interface TransportItem {
    type: string;
    distance?: number;
    fuel?: string;
    [key: string]: unknown;
  }

  interface EnergyItem {
    source: string;
    consumption?: number;
    [key: string]: unknown;
  }

  export function generateMaterialSuggestions({ materials }: { materials: Material[]; }): string[];
  export function generateTransportSuggestions(transport: TransportItem[]): string[];
  export function generateEnergySuggestions(energy: EnergyItem[]): string[];
  export function generateGeneralSuggestions(): string[];
}
