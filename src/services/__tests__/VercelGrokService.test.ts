import { vercelGrokService } from '../VercelGrokService';
import { handleGrokAPIError } from '../../utils/errorHandling/grokNetworkHandler';

// Mock the xai and streamText functions
jest.mock('@ai-sdk/xai', () => ({
  xai: jest.fn(() => 'grok-2')
}));

jest.mock('ai', () => ({
  streamText: jest.fn()
}));

describe('VercelGrokService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the service
    vercelGrokService.setApiKey('');
  });

  describe('API Configuration', () => {
    it('should not be configured by default', () => {
      expect(vercelGrokService.isApiConfigured()).toBe(false);
    });

    it('should be configured after setting API key', () => {
      vercelGrokService.setApiKey('test-key');
      expect(vercelGrokService.isApiConfigured()).toBe(true);
    });

    it('should store API key in localStorage', () => {
      vercelGrokService.setApiKey('test-key');
      expect(localStorage.getItem('grok_api_key')).toBe('test-key');
    });

    it('should remove API key from localStorage when reset', () => {
      vercelGrokService.setApiKey('test-key');
      vercelGrokService.setApiKey('');
      expect(localStorage.getItem('grok_api_key')).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should reject query when not configured', async () => {
      await expect(vercelGrokService.queryGrok({ prompt: 'test' }))
        .rejects
        .toThrow('Grok API is not configured');
    });

    it('should handle API errors gracefully', async () => {
      vercelGrokService.setApiKey('test-key');
      const mockError = new Error('API Error');
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError);

      await expect(vercelGrokService.queryGrok({ prompt: 'test' }))
        .rejects
        .toThrow();
    });
  });

  describe('Retry Logic', () => {
    it('should retry failed requests', async () => {
      vercelGrokService.setApiKey('test-key');
      const mockError = new Error('Temporary Error');
      let attempts = 0;

      jest.spyOn(global, 'fetch')
        .mockImplementation(() => {
          attempts++;
          if (attempts < 3) {
            throw mockError;
          }
          return Promise.resolve(new Response(JSON.stringify({ text: 'success' })));
        });

      const result = await vercelGrokService.queryGrok({ prompt: 'test' });
      expect(attempts).toBe(3);
      expect(result.text).toBe('success');
    });
  });
}); 