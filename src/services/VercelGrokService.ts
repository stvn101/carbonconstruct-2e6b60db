import grokService, { GrokMode, GrokRequest, GrokResponse } from './GrokService';

export type VercelGrokResponse = {
  text: string;
  response: string;
  error?: string;
};

class VercelGrokService {
  private apiKey: string | null = null;
  private isConfigured: boolean = false;

  constructor() {
    console.log("VercelGrokService initialized");
  }

  public setApiKey(key: string): void {
    this.apiKey = key;
    this.isConfigured = !!key;
    grokService.setApiKey(key);
    console.log("Vercel Grok API key configured:", this.isConfigured);
  }

  public isApiConfigured(): boolean {
    return this.isConfigured;
  }

  public async queryGrok(request: GrokRequest): Promise<VercelGrokResponse> {
    try {
      const response = await grokService.queryGrok(request);
      return {
        text: response.response,
        response: response.response,
        error: response.error
      };
    } catch (error) {
      console.error("Error in VercelGrokService:", error);
      return {
        text: "An error occurred while processing your request.",
        response: "An error occurred while processing your request.",
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  public async *streamGrokResponse(request: GrokRequest): AsyncIterable<string> {
    try {
      const response = await this.queryGrok(request);
      // Simulate streaming by yielding words
      const words = response.text.split(' ');
      for (const word of words) {
        yield word + ' ';
        // Add a small delay between words to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error("Error in streamGrokResponse:", error);
      yield "Error: " + (error instanceof Error ? error.message : String(error));
    }
  }
}

// Export a singleton instance
const vercelGrokService = new VercelGrokService();
export default vercelGrokService;
