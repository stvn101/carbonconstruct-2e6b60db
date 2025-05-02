
// Define an extended Performance interface that includes memory
interface ExtendedPerformance extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

export const monitorMemoryUsage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    // Cast performance to our extended type
    const performance = window.performance as ExtendedPerformance;
    
    if (performance && performance.memory) {
      const { jsHeapSizeLimit, totalJSHeapSize, usedJSHeapSize } = performance.memory;
      
      console.debug('[Performance] Memory:', {
        used: Math.round(usedJSHeapSize / 1048576), // Convert to MB
        total: Math.round(totalJSHeapSize / 1048576),
        limit: Math.round(jsHeapSizeLimit / 1048576),
        percentUsed: Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100)
      });
    }
  } catch (error) {
    console.debug('[Performance] Memory monitoring not available:', error);
  }
};

/**
 * Enhanced performance monitoring for application scaling
 */
import { trackMetric } from '@/contexts/performance/metrics';

// Constants for performance thresholds
const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER: 200, // ms
  SLOW_API_CALL: 2000, // ms
  MEMORY_WARNING: 700000000, // ~700MB
};

/**
 * Tracks component render performance with warnings for slow renders
 */
export const trackComponentRender = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    
    // Log render time
    trackMetric({
      metric: 'component_render_time',
      value: duration,
      tags: { component: componentName }
    });
    
    // Warn if render is slow
    if (duration > PERFORMANCE_THRESHOLDS.SLOW_RENDER) {
      console.warn(`Slow render detected in ${componentName}: ${duration.toFixed(2)}ms`);
      
      // Track slow render as separate metric
      trackMetric({
        metric: 'slow_render',
        value: duration,
        tags: { component: componentName }
      });
    }
  };
};

/**
 * Monitors API call performance
 */
export const trackApiCall = (endpoint: string) => {
  const startTime = performance.now();
  
  return {
    success: (dataSize?: number) => {
      const duration = performance.now() - startTime;
      
      trackMetric({
        metric: 'api_call_success',
        value: duration,
        tags: { endpoint, dataSize: dataSize?.toString() || 'unknown' }
      });
      
      if (duration > PERFORMANCE_THRESHOLDS.SLOW_API_CALL) {
        console.warn(`Slow API call detected to ${endpoint}: ${duration.toFixed(2)}ms`);
        
        trackMetric({
          metric: 'slow_api_call',
          value: duration,
          tags: { endpoint }
        });
      }
    },
    
    error: (errorType: string) => {
      const duration = performance.now() - startTime;
      
      trackMetric({
        metric: 'api_call_error',
        value: duration,
        tags: { endpoint, errorType }
      });
    }
  };
};

/**
 * Check memory usage and warn if approaching limits
 */
export const checkMemoryUsage = () => {
  const extendedPerformance = performance as ExtendedPerformance;
  
  if (extendedPerformance.memory) {
    const memory = extendedPerformance.memory;
    
    if (memory && memory.usedJSHeapSize > PERFORMANCE_THRESHOLDS.MEMORY_WARNING) {
      console.warn(`High memory usage detected: ${(memory.usedJSHeapSize / 1000000).toFixed(2)}MB`);
      
      trackMetric({
        metric: 'high_memory_usage',
        value: memory.usedJSHeapSize,
        tags: { totalHeapSize: memory.totalJSHeapSize.toString() }
      });
    }
    
    return memory.usedJSHeapSize;
  }
  
  return null;
};

/**
 * Initialize performance monitoring
 */
export const initializePerformanceMonitoring = () => {
  // Set up periodic memory checks
  const memoryCheckInterval = setInterval(checkMemoryUsage, 60000);
  
  // Report standard web vitals - properly check if module is available
  try {
    import('web-vitals').then(({ getCLS, getFID, getLCP }) => {
      getCLS(metric => {
        trackMetric({
          metric: 'cls',
          value: metric.value
        });
      });
      
      getFID(metric => {
        trackMetric({
          metric: 'fid',
          value: metric.value
        });
      });
      
      getLCP(metric => {
        trackMetric({
          metric: 'lcp',
          value: metric.value
        });
      });
    }).catch(err => {
      console.log('Web vitals not available:', err.message);
    });
  } catch (e) {
    console.log('Web vitals import error:', e);
  }
  
  // Monitor long tasks
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach((entry) => {
      if (entry.duration > 50) {  // 50ms+ indicates potential jank
        trackMetric({
          metric: 'long_task',
          value: entry.duration,
          tags: { name: entry.name }
        });
      }
    });
  });
  
  try {
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    console.log('LongTask monitoring not supported in this browser');
  }
  
  // Return cleanup function
  return () => {
    clearInterval(memoryCheckInterval);
    observer.disconnect();
  };
};

// Optimized debounce function for performance-sensitive code
export const optimizedDebounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  let timeout: number | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = window.setTimeout(later, wait);
  };
};
