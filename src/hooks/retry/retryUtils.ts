
export const calculateBackoffDelay = (retryCount: number): number => {
  return Math.min(2000 * Math.pow(2, retryCount), 10000);
};

export type RetryOptions = {
  callback: () => Promise<void>;
  maxRetries: number;
  onMaxRetriesReached?: () => void;
  retryCount: number;
  setRetryCount: (count: number) => void;
};

export type RetryResult = {
  isRetrying: boolean;
  retryCount: number;
};
