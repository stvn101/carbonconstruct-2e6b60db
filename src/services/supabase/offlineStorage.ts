
interface ErrorEntry {
  error: Error;
  metadata: Record<string, any>;
}

class OfflineStorage {
  private static errorMap: Map<string, ErrorEntry[]> = new Map();
  private static errorCounts: Map<string, number> = new Map();
  private static lastErrorTime: Map<string, number> = new Map();
  private static MAX_ERRORS = 50;
  private static THROTTLE_WINDOW = 5000;

  static storeOfflineError(error: Error, metadata: Record<string, any> = {}): void {
    const errorKey = `${error.name}:${error.message}`;
    const errors = this.errorMap.get(errorKey) || [];
    
    if (errors.length < this.MAX_ERRORS) {
      errors.push({ error, metadata });
      this.errorMap.set(errorKey, errors);
    }
  }

  static getOfflineErrors(): { error: Error; metadata: Record<string, any> }[] {
    const allErrors: { error: Error; metadata: Record<string, any> }[] = [];
    this.errorMap.forEach(errors => allErrors.push(...errors));
    this.errorMap.clear();
    return allErrors;
  }

  static hasReachedLimit(errorKey: string): boolean {
    return (this.errorCounts.get(errorKey) || 0) >= this.MAX_ERRORS;
  }

  static incrementErrorCount(errorKey: string): number {
    const count = (this.errorCounts.get(errorKey) || 0) + 1;
    this.errorCounts.set(errorKey, count);
    return count;
  }

  static shouldThrottleError(errorKey: string): boolean {
    const now = Date.now();
    const lastTime = this.lastErrorTime.get(errorKey) || 0;
    
    if (now - lastTime < this.THROTTLE_WINDOW) {
      return true;
    }
    
    this.lastErrorTime.set(errorKey, now);
    return false;
  }

  static clearStorage(): void {
    this.errorMap.clear();
    this.errorCounts.clear();
    this.lastErrorTime.clear();
  }
}

export default OfflineStorage;
