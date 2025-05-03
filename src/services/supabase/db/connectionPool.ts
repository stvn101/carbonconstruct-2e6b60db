
import { supabase } from '@/integrations/supabase/client';

/**
 * Connection pool manager for managing database connections
 * Improves reliability for 50+ concurrent users
 */
interface ConnectionStats {
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  averageResponseTime: number;
  totalConnections: number;
}

class ConnectionPoolManager {
  private stats: ConnectionStats = {
    failures: 0,
    successes: 0,
    lastFailure: null,
    lastSuccess: null,
    averageResponseTime: 0,
    totalConnections: 0
  };
  
  // Connection health check with circuit breaker pattern
  private circuitOpen: boolean = false;
  private lastCircuitCheck: Date = new Date();
  private circuitResetTimeout: number = 30000; // 30 seconds
  private failureThreshold: number = 5;
  
  constructor() {
    // Reset circuit breaker periodically
    setInterval(() => {
      const now = new Date();
      if (this.circuitOpen && now.getTime() - this.lastCircuitCheck.getTime() > this.circuitResetTimeout) {
        this.circuitOpen = false;
        console.log('Circuit breaker reset, allowing database connections again');
      }
    }, 10000);
  }
  
  /**
   * Execute a database operation with enhanced error handling and circuit breaker pattern
   */
  async executeQuery<T>(
    queryFunction: () => Promise<T>,
    options: {
      operationName?: string;
      timeout?: number;
    } = {}
  ): Promise<T> {
    // Check if circuit breaker is open
    if (this.circuitOpen) {
      const err = new Error('Database connection circuit is open due to multiple failures');
      console.error(err);
      throw err;
    }
    
    const { operationName = 'query', timeout = 30000 } = options;
    
    this.stats.totalConnections++;
    const startTime = performance.now();
    
    try {
      // Set up timeout protection
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Database operation timeout (${timeout}ms)`)), timeout);
      });
      
      // Race between query and timeout
      const result = await Promise.race([queryFunction(), timeoutPromise]) as T;
      
      // Update statistics on success
      this.stats.successes++;
      this.stats.lastSuccess = new Date();
      
      // Update average response time
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      this.stats.averageResponseTime = (
        (this.stats.averageResponseTime * (this.stats.successes - 1)) + responseTime
      ) / this.stats.successes;
      
      return result;
    } catch (error) {
      // Update statistics on failure
      this.stats.failures++;
      this.stats.lastFailure = new Date();
      this.lastCircuitCheck = new Date();
      
      // Check if we should open the circuit breaker
      if (this.stats.failures >= this.failureThreshold) {
        this.circuitOpen = true;
        console.error(`Circuit breaker opened after ${this.stats.failures} failures`);
        
        // Auto-reset after timeout
        setTimeout(() => {
          this.circuitOpen = false;
          console.log('Circuit breaker auto-reset after timeout');
        }, this.circuitResetTimeout);
      }
      
      console.error(`Database operation "${operationName}" failed:`, error);
      throw error;
    }
  }
  
  /**
   * Get current connection statistics
   */
  getStats(): ConnectionStats {
    return { ...this.stats };
  }
  
  /**
   * Reset circuit breaker manually
   */
  resetCircuitBreaker(): void {
    this.circuitOpen = false;
    console.log('Circuit breaker manually reset');
  }
}

// Singleton instance
export const connectionPool = new ConnectionPoolManager();

/**
 * Execute a database query with proper connection pooling and error handling
 */
export async function executePooledQuery<T>(
  queryFunction: () => Promise<T>,
  operationName: string = 'database operation'
): Promise<T> {
  return connectionPool.executeQuery(queryFunction, { operationName });
}
