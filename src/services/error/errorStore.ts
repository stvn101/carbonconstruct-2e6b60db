
import { ErrorCallback, ErrorMetadata } from './types';

export class ErrorStore {
  private errorCount: Record<string, number> = {};
  private errorCallbacks: ErrorCallback[] = [];
  private offlineErrors: {error: Error, metadata: ErrorMetadata}[] = [];
  private lastErrorSent: number = 0;
  private readonly MAX_ERRORS_PER_TYPE = 10;
  private readonly ERROR_THROTTLE_MS = 2000;

  shouldThrottleError(errorKey: string): boolean {
    const now = Date.now();
    return errorKey === Object.keys(this.errorCount).slice(-1)[0] && 
           now - this.lastErrorSent < this.ERROR_THROTTLE_MS;
  }

  incrementErrorCount(errorKey: string): number {
    this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;
    this.lastErrorSent = Date.now();
    return this.errorCount[errorKey];
  }

  hasReachedLimit(errorKey: string): boolean {
    return this.errorCount[errorKey] > this.MAX_ERRORS_PER_TYPE;
  }

  getMaxErrorsLimit(): number {
    return this.MAX_ERRORS_PER_TYPE;
  }

  addCallback(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }

  storeOfflineError(error: Error, metadata: ErrorMetadata): void {
    this.offlineErrors.push({ error, metadata });
  }

  getOfflineErrors(): {error: Error, metadata: ErrorMetadata}[] {
    const errors = [...this.offlineErrors];
    this.offlineErrors = [];
    return errors;
  }

  executeCallbacks(error: Error): void {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error in error callback:', callbackError);
      }
    });
  }
}
