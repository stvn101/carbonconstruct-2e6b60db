
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
}

// Export a singleton instance
const grokService = new GrokService();
export default grokService;
