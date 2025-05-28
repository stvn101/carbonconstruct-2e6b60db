
import { supabase } from "@/integrations/supabase/client";
import { handleGrokAPIError } from "@/utils/errorHandling/grokNetworkHandler";

export type GrokMode = 'material_analysis' | 'compliance_check' | 'sustainability_advisor' | 'creative' | 'general';

export interface GrokRequest {
  prompt: string;
  context?: Record<string, any>;
  mode?: GrokMode;
  options?: {
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  };
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
  metadata?: {
    processingTime?: number;
    modelVersion?: string;
    confidence?: number;
  };
}

export interface SustainabilityAnalysisParams {
  materials?: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
    properties?: Record<string, any>;
  }>;
  transport?: Array<{
    type: string;
    distance: number;
    fuelType?: string;
    loadFactor?: number;
  }>;
  energy?: Array<{
    type: string;
    consumption: number;
    unit: string;
    source?: string;
  }>;
  options?: {
    format?: 'basic' | 'detailed' | 'comprehensive';
    includeLifecycleAnalysis?: boolean;
    includeComplianceDetails?: boolean;
  };
}

class GrokService {
  private apiKey: string | null = null;
  private isConfigured: boolean = false;
  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_RETRIES = 2;

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

  private validateResponse(response: any): GrokResponse {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid response format from Grok API');
    }

    if (!response.response && !response.error) {
      throw new Error('Response missing required fields');
    }

    return {
      response: response.response || '',
      usage: response.usage,
      model: response.model,
      error: response.error,
      metadata: response.metadata
    };
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
      
      const startTime = Date.now();
      
      // Call the Supabase Edge Function with timeout
      const result = await Promise.race([
        supabase.functions.invoke('grok-ai', {
          body: {
            prompt: request.prompt,
            context: request.context || {},
            mode: request.mode || 'general',
            options: request.options
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), this.DEFAULT_TIMEOUT)
        )
      ]) as { data: any; error: any };

      if (result.error) {
        throw handleGrokAPIError(result.error, { context: 'queryGrok' });
      }

      const response = this.validateResponse(result.data);
      
      // Add processing time to metadata
      response.metadata = {
        ...response.metadata,
        processingTime: Date.now() - startTime
      };

      console.log("Grok API response received");
      return response;
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
      mode: 'material_analysis',
      options: {
        temperature: 0.7,
        maxTokens: 1000
      }
    });
  }

  public async getSustainabilityAdvice(projectData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Provide sustainability improvement recommendations for this construction project.",
      context: projectData,
      mode: 'sustainability_advisor',
      options: {
        temperature: 0.8,
        maxTokens: 1500
      }
    });
  }

  public async checkCompliance(projectData: any): Promise<GrokResponse> {
    return this.queryGrok({
      prompt: "Check if this project complies with NCC 2025 and NABERS standards.",
      context: projectData,
      mode: 'compliance_check',
      options: {
        temperature: 0.3,
        maxTokens: 2000
      }
    });
  }

  public async getSustainabilitySuggestions(params: SustainabilityAnalysisParams): Promise<GrokResponse> {
    try {
      console.log("Requesting sustainability suggestions");
      
      const result = await supabase.functions.invoke('get-sustainability-suggestions', {
        body: {
          materials: params.materials || [],
          transport: params.transport || [],
          energy: params.energy || [],
          options: params.options || { format: 'basic' }
        }
      });

      if (result.error) {
        throw handleGrokAPIError(result.error, { context: 'getSustainabilitySuggestions' });
      }

      console.log("Sustainability suggestions received:", result.data);
      return this.validateResponse(result.data);
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
