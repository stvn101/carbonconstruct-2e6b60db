
/**
 * Testing utilities for Grok AI integration
 * 
 * This file contains helper functions for testing Grok AI components
 * and integration points.
 */

/**
 * Simulates different network conditions for testing offline mode
 * @param condition - Type of network condition to simulate
 * @param durationMs - Duration of simulation in milliseconds
 * @returns A cleanup function to restore normal operation
 */
export const simulateNetworkCondition = (
  condition: 'offline' | 'slow' | 'intermittent' | 'normal',
  durationMs: number = 5000
): () => void => {
  // Store original navigator.onLine value
  const originalOnlineStatus = navigator.onLine;
  
  // Create a proxy for navigator.onLine
  let isOnlineProxy = originalOnlineStatus;
  
  // Override navigator.onLine getter
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    get: () => isOnlineProxy,
  });
  
  // Variables for intermittent scenario
  let intervalId: number | null = null;
  
  // Store original fetch function
  const originalFetch = window.fetch;
  
  switch (condition) {
    case 'offline':
      // Simply set to offline
      isOnlineProxy = false;
      
      // Dispatch offline event
      window.dispatchEvent(new Event('offline'));
      break;
      
    case 'slow':
      // Remain online but slow down fetch
      window.fetch = async function(...args) {
        // Add artificial delay
        await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
        return originalFetch.apply(this, args);
      };
      break;
      
    case 'intermittent':
      // Toggle between online and offline periodically
      intervalId = window.setInterval(() => {
        isOnlineProxy = !isOnlineProxy;
        window.dispatchEvent(new Event(isOnlineProxy ? 'online' : 'offline'));
      }, 1000 + Math.random() * 2000);
      break;
      
    case 'normal':
    default:
      // No changes needed, just ensure we're online
      isOnlineProxy = true;
      window.dispatchEvent(new Event('online'));
      break;
  }
  
  // Set timeout to restore normal operation
  const timeoutId = setTimeout(() => {
    cleanup();
  }, durationMs);
  
  // Cleanup function to restore original behavior
  const cleanup = () => {
    // Clear any intervals
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Clear the timeout
    clearTimeout(timeoutId);
    
    // Restore original navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => originalOnlineStatus,
    });
    
    // If we modified fetch, restore it
    if (condition === 'slow') {
      window.fetch = originalFetch;
    }
    
    // Dispatch appropriate event
    window.dispatchEvent(new Event(originalOnlineStatus ? 'online' : 'offline'));
    
    console.log('Network condition simulation ended');
  };
  
  console.log(`Network condition "${condition}" simulated for ${durationMs}ms`);
  
  return cleanup;
};

/**
 * Validates Grok API responses for expected structure and content
 * @param response - The response object to validate
 * @returns Object containing validation result and any errors found
 */
export const validateGrokResponse = (response: any): { 
  isValid: boolean; 
  errors: string[]
} => {
  const errors: string[] = [];
  
  // Check if response exists
  if (!response) {
    errors.push('Response is null or undefined');
    return { isValid: false, errors };
  }
  
  // Check text field
  if (!response.text && !response.response) {
    errors.push('Response missing both "text" and "response" fields');
  }
  
  // Check for unexpected error field
  if (response.error) {
    errors.push(`Response contains error: ${response.error}`);
  }
  
  // Successfully validated if no errors
  return { 
    isValid: errors.length === 0,
    errors 
  };
};

/**
 * Creates a mock Grok service for testing
 * @param options - Configuration options for the mock service
 * @returns Mock Grok service object
 */
export const createMockGrokService = (options: {
  simulateErrors?: boolean;
  responseDelay?: number;
  responseText?: string;
}) => {
  const {
    simulateErrors = false,
    responseDelay = 500,
    responseText = "This is a mock response from Grok AI."
  } = options;
  
  return {
    isApiConfigured: () => true,
    setApiKey: () => {},
    queryGrok: async () => {
      await new Promise(resolve => setTimeout(resolve, responseDelay));
      
      if (simulateErrors) {
        throw new Error('Simulated Grok API error');
      }
      
      return {
        text: responseText,
        response: responseText
      };
    },
    streamGrokResponse: async function* () {
      const words = responseText.split(' ');
      
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, responseDelay / words.length));
        
        if (simulateErrors && Math.random() > 0.7) {
          throw new Error('Simulated streaming error');
        }
        
        yield word + ' ';
      }
    }
  };
};
