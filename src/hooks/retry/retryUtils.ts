
/**
 * Improved backoff delay calculation with configurable factor and jitter
 * 
 * @param attempt Current retry attempt (starting from 1)
 * @param factor Exponential factor (default: 1.8 - more conservative than 2)
 * @param baseDelay Base delay in ms (default: 2000ms)
 * @param maxDelay Maximum delay in ms (default: 30000ms)
 * @returns The backoff delay in milliseconds
 */
export const calculateBackoffDelay = (
  attempt: number, 
  factor: number = 1.8,
  baseDelay: number = 2000, 
  maxDelay: number = 30000
): number => {
  // Calculate exponential delay: baseDelay * factor^(attempt-1)
  // This gives a more gradual curve than using factor=2
  const calculatedDelay = baseDelay * Math.pow(factor, attempt - 1);
  
  // Cap at maximum delay
  const cappedDelay = Math.min(calculatedDelay, maxDelay);
  
  // Add jitter (±15%) to prevent thundering herd problem
  const jitter = cappedDelay * 0.15 * (Math.random() * 2 - 1);
  
  return Math.floor(cappedDelay + jitter);
};

export interface RetryOptions<T = unknown> {
  callback: () => Promise<void>;
  maxRetries: number;
  onMaxRetriesReached?: () => void;
  retryCount: number;
  setRetryCount: (count: number) => void;
}

export interface RetryResult {
  isRetrying: boolean;
  retryCount: number;
}
