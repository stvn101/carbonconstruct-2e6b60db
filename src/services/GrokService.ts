
import { supabase } from "@/integrations/supabase/client";

export type GrokMode = 'material_analysis' | 'compliance_check' | 'sustainability_advisor' | 'creative' | 'general';

export interface GrokRequest {
  prompt: string;
  context?: any;
  mode?: GrokMode;
}

export interface GrokResponse {
  response: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
  error?: string;
}

export interface SustainabilityAnalysisParams {
  materials?: any[];
  transport?: any[];
  energy?: any[];
  options?: {
    format?: 'basic' | 'detailed' | 'comprehensive';
    includeLifecycleAnalysis?: boolean;
    includeComplianceDetails?: boolean;
  };
}

class GrokService {
  private apiKey: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    console.log("GrokService initialized");
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    this.isConfigured = !!key;
    console.log("Grok API key configured:", this.isConfigured);
  }

  public isApiConfigured(): boolean {
    return this.isConfigured;
  }

  public async queryGrok(request: GrokRequest): Promise<GrokResponse> {
    try {
      if (!this.isConfigured) {
        console.warn("Grok API is not configured");
        return {
          response: "Grok AI is not configured. Please configure your API key.",
          error: "API key not configured"
        };
      }

      console.log(`Sending ${request.mode || 'general'} request to Grok API`);
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('grok-ai', {
        body: {
          prompt: request.prompt,
          context: request.context || {},
          mode: request.mode || 'general'
        }
      });

      if (error) {
        console.error("Error calling Grok API:", error);
        return {
          response: "Sorry, there was an error connecting to Grok AI.",
          error: error.message
        };
      }

      console.log("Grok API response received");
      return data as GrokResponse;
    } catch (error) {
      console.error("Unexpected error in GrokService:", error);
      return {
        response: "An unexpected error occurred while connecting to Grok AI.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  public async analyzeConstructionMaterial(materialData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Analyze this construction material for sustainability insights and possible improvements.",
      context: materialData,
      mode: 'material_analysis'
    });
  }

  public async getSustainabilityAdvice(projectData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Provide sustainability improvement recommendations for this construction project.",
      context: projectData,
      mode: 'sustainability_advisor'
    });
  }

  public async checkCompliance(projectData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Check if this project complies with NCC 2025 and NABERS standards.",
      context: projectData,
      mode: 'compliance_check'
    });
  }

  // New method to get sustainability suggestions from the edge function
  public async getSustainabilitySuggestions(params: SustainabilityAnalysisParams): Promise<any> {
    try {
      console.log("Requesting sustainability suggestions");
      
      const { data, error } = await supabase.functions.invoke('get-sustainability-suggestions', {
        body: {
          materials: params.materials || [],
          transport: params.transport || [],
          energy: params.energy || [],
          options: params.options || { format: 'basic' }
        }
      });

      if (error) {
        console.error("Error getting sustainability suggestions:", error);
        throw error;
      }

      console.log("Sustainability suggestions received:", data);
      return data;
    } catch (error) {
      console.error("Failed to get sustainability suggestions:", error);
      throw error;
    }
  }
  
  // New method to analyze the sustainability of materials
  public async analyzeMaterialSustainability(materials: any[]): Promise<GrokResponse> {
    if (!Array.isArray(materials) || materials.length === 0) {
      return {
        response: "Please provide at least one material to analyze.",
        error: "Invalid input"
      };
    }

    return this.queryGrok({
      prompt: "Analyze these construction materials for sustainability. Provide insights on their carbon footprint, recyclability, and suggest sustainable alternatives where applicable.",
      context: { materials },
      mode: 'material_analysis'
    });
  }

  // New method to provide NCC 2025 and NABERS compliance insights
  public async getComplianceInsights(projectData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Provide detailed insights on this project's compliance with NCC 2025 and NABERS standards. Identify any compliance issues and suggest specific improvements to meet or exceed requirements.",
      context: projectData,
      mode: 'compliance_check'
    });
  }
}

// Export a singleton instance
const grokService = new GrokService();
export default grokService;
