
import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';

// Define response types
export interface VercelGrokResponse {
  text: string;
  error?: string;
}

export type GrokMode = 'creative' | 'balanced' | 'precise';

export interface GrokQueryOptions {
  prompt: string;
  context?: any;
  mode?: GrokMode;
  systemPrompt?: string;
}

// Map Grok modes to temperature values for the AI model
const modeToTemperature = {
  creative: 1.0,
  balanced: 0.7,
  precise: 0.2
};

class VercelGrokService {
  private apiKey: string = '';
  private isConfigured: boolean = false;

  constructor() {
    // Check if an API key is stored in localStorage
    this.apiKey = localStorage.getItem('grok_api_key') || '';
    this.isConfigured = !!this.apiKey;
  }

  /**
   * Check if the Grok service is configured with an API key
   */
  isApiConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Set the API key for the Grok service
   */
  setApiKey(key: string): void {
    this.apiKey = key;
    
    if (key) {
      localStorage.setItem('grok_api_key', key);
      this.isConfigured = true;
    } else {
      localStorage.removeItem('grok_api_key');
      this.isConfigured = false;
    }
  }

  /**
   * Query the Grok API with a prompt
   */
  async queryGrok(options: GrokQueryOptions): Promise<VercelGrokResponse> {
    if (!this.isApiConfigured()) {
      return Promise.reject(new Error('Grok API is not configured. Please add your API key.'));
    }

    try {
      const { prompt, context, mode = 'balanced', systemPrompt } = options;
      
      // Prepare the full prompt with context if provided
      let fullPrompt = prompt;
      if (context) {
        fullPrompt = `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`;
      }
      
      // Prepare system prompt
      const system = systemPrompt || 'You are a helpful sustainable construction assistant. Focus on providing information about materials, building standards, compliance, and sustainability best practices.';
      
      // Set up model parameters based on mode
      const temperature = modeToTemperature[mode];

      // Stream the response from the AI model
      const result = await streamText({
        model: xai('grok-2'),
        prompt: fullPrompt,
        system,
        temperature,
      });

      // Collect the full text response
      let completeText = '';
      for await (const textPart of result.textStream) {
        completeText += textPart;
      }

      return {
        text: completeText
      };
    } catch (error) {
      console.error('Error querying Grok API:', error);
      return {
        text: "Sorry, there was an error processing your request.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Stream response from Grok for real-time updates
   * This method returns an async iterator that can be used in a for-await loop
   */
  async *streamGrokResponse(options: GrokQueryOptions): AsyncIterable<string> {
    if (!this.isApiConfigured()) {
      throw new Error('Grok API is not configured. Please add your API key.');
    }

    try {
      const { prompt, context, mode = 'balanced', systemPrompt } = options;
      
      // Prepare the full prompt with context if provided
      let fullPrompt = prompt;
      if (context) {
        fullPrompt = `Context: ${JSON.stringify(context)}\n\nPrompt: ${prompt}`;
      }
      
      // Prepare system prompt
      const system = systemPrompt || 'You are a helpful sustainable construction assistant. Focus on providing information about materials, building standards, compliance, and sustainability best practices.';
      
      // Set up model parameters based on mode
      const temperature = modeToTemperature[mode];

      // Stream the response from the AI model
      const result = await streamText({
        model: xai('grok-2'),
        prompt: fullPrompt,
        system,
        temperature,
      });

      // Yield each text part as it comes in
      for await (const textPart of result.textStream) {
        yield textPart;
      }
    } catch (error) {
      console.error('Error streaming from Grok API:', error);
      yield `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}

const vercelGrokService = new VercelGrokService();
export default vercelGrokService;
