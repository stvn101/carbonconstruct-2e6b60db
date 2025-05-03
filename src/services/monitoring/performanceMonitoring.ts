
import logger from '../logging/loggingService';

// Define performance metric types
type MetricName = 
  | 'page_load'
  | 'component_render'
  | 'api_call'
  | 'calculation'
  | 'user_interaction';

interface PerformanceMetric {
  name: MetricName;
  value: number;
  timestamp: number;
  tags?: Record<string, string>;
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private metrics: PerformanceMetric[] = [];
  private isEnabled: boolean = true;
  private maxMetrics: number = 1000;
  private markMap = new Map<string, number>();

  private constructor() {
    // Hook into browser performance API when available
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.setupPerformanceObservers();
    }
  }

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public setMaxMetrics(max: number): void {
    this.maxMetrics = max;
    this.pruneMetricsIfNeeded();
  }

  private pruneMetricsIfNeeded(): void {
    if (this.metrics.length > this.maxMetrics) {
      // Remove oldest metrics to stay under limit
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }

  private setupPerformanceObservers(): void {
    // Observe paint timing (FP, FCP)
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.recordMetric({
              name: 'page_load',
              value: entry.startTime,
              timestamp: Date.now(),
              tags: {
                metric_type: entry.name,
                entryType: entry.entryType
              }
            });
          }
        });
        
        paintObserver.observe({ entryTypes: ['paint'] });
        
        // Observe largest contentful paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.recordMetric({
            name: 'page_load',
            value: lastEntry.startTime,
            timestamp: Date.now(),
            tags: {
              metric_type: 'LCP',
              entryType: lastEntry.entryType
            }
          });
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            const fidEntry = entry as PerformanceEventTiming;
            this.recordMetric({
              name: 'user_interaction',
              value: fidEntry.processingStart - fidEntry.startTime,
              timestamp: Date.now(),
              tags: {
                metric_type: 'FID',
                entryType: fidEntry.entryType
              }
            });
          }
        });
        
        fidObserver.observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // Check if the entry has the required properties
            if (!('value' in entry) || !('hadRecentInput' in entry)) continue;
            
            const clsEntry = entry as any;
            
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
              this.recordMetric({
                name: 'page_load',
                value: clsValue,
                timestamp: Date.now(),
                tags: {
                  metric_type: 'CLS',
                  entryType: clsEntry.entryType
                }
              });
            }
          }
        });
        
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        
        logger.info('Performance observers initialized', 'monitoring');
      } catch (error) {
        logger.error('Failed to set up performance observers', 'monitoring', error as Error);
      }
    }
  }

  public mark(name: string): void {
    if (!this.isEnabled) return;
    
    this.markMap.set(name, performance.now());
    
    if (typeof window !== 'undefined' && 'performance' in window && 'mark' in performance) {
      try {
        performance.mark(name);
      } catch (error) {
        logger.error(`Failed to create performance mark: ${name}`, 'monitoring', error as Error);
      }
    }
  }

  public measure(name: string, startMark: string): number {
    if (!this.isEnabled) return 0;
    
    const start = this.markMap.get(startMark);
    if (!start) {
      logger.warn(`Start mark not found: ${startMark}`, 'monitoring');
      return 0;
    }
    
    const end = performance.now();
    const duration = end - start;
    
    this.recordMetric({
      name: 'component_render',
      value: duration,
      timestamp: Date.now(),
      tags: {
        metric_type: name,
        start_mark: startMark
      }
    });
    
    if (typeof window !== 'undefined' && 'performance' in window && 'measure' in performance) {
      try {
        performance.measure(name, startMark);
      } catch (error) {
        // This may fail if marks don't exist, which is fine
      }
    }
    
    return duration;
  }

  public recordMetric(metric: PerformanceMetric): void {
    if (!this.isEnabled) return;
    
    this.metrics.push(metric);
    this.pruneMetricsIfNeeded();
    
    // Log significant performance issues
    if (this.shouldLogMetric(metric)) {
      this.logPerformanceIssue(metric);
    }
  }

  public trackRender(componentName: string, duration: number): void {
    if (!this.isEnabled) return;
    
    this.recordMetric({
      name: 'component_render',
      value: duration,
      timestamp: Date.now(),
      tags: {
        component: componentName
      }
    });
    
    // Log slow renders
    if (duration > 100) {
      logger.warn(`Slow render of component ${componentName}: ${duration.toFixed(2)}ms`, 'performance');
    }
  }

  public trackApiCall(endpoint: string, duration: number, success: boolean): void {
    if (!this.isEnabled) return;
    
    this.recordMetric({
      name: 'api_call',
      value: duration,
      timestamp: Date.now(),
      tags: {
        endpoint,
        success: success.toString()
      }
    });
    
    // Log slow API calls
    if (duration > 1000) {
      logger.warn(`Slow API call to ${endpoint}: ${duration.toFixed(2)}ms`, 'performance');
    }
  }

  public trackCalculation(calculationType: string, duration: number): void {
    if (!this.isEnabled) return;
    
    this.recordMetric({
      name: 'calculation',
      value: duration,
      timestamp: Date.now(),
      tags: {
        type: calculationType
      }
    });
    
    // Log slow calculations
    if (duration > 200) {
      logger.warn(`Slow calculation (${calculationType}): ${duration.toFixed(2)}ms`, 'performance');
    }
  }

  public getMetricsByName(name: MetricName): PerformanceMetric[] {
    return this.metrics.filter(metric => metric.name === name);
  }

  public getAverageByName(name: MetricName): number {
    const metrics = this.getMetricsByName(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  public getLatestMetrics(count: number = 10): PerformanceMetric[] {
    return this.metrics.slice(-count);
  }

  private shouldLogMetric(metric: PerformanceMetric): boolean {
    // Check if the metric indicates a performance issue
    switch (metric.name) {
      case 'page_load':
        // LCP > 2.5s is poor
        return metric.tags?.metric_type === 'LCP' && metric.value > 2500;
      case 'component_render':
        // Component renders > 100ms are concerning
        return metric.value > 100;
      case 'api_call':
        // API calls > 1000ms are slow
        return metric.value > 1000;
      case 'user_interaction':
        // FID > 100ms is poor
        return metric.tags?.metric_type === 'FID' && metric.value > 100;
      default:
        return false;
    }
  }

  private logPerformanceIssue(metric: PerformanceMetric): void {
    let message = '';
    switch (metric.name) {
      case 'page_load':
        if (metric.tags?.metric_type === 'LCP') {
          message = `Slow Largest Contentful Paint: ${metric.value.toFixed(2)}ms`;
        }
        break;
      case 'component_render':
        message = `Slow component render: ${metric.value.toFixed(2)}ms`;
        if (metric.tags?.component) {
          message += ` (${metric.tags.component})`;
        }
        break;
      case 'api_call':
        message = `Slow API call: ${metric.value.toFixed(2)}ms`;
        if (metric.tags?.endpoint) {
          message += ` to ${metric.tags.endpoint}`;
        }
        break;
      case 'user_interaction':
        if (metric.tags?.metric_type === 'FID') {
          message = `Poor First Input Delay: ${metric.value.toFixed(2)}ms`;
        }
        break;
    }
    
    if (message) {
      logger.warn(message, 'performance', { metricValue: metric.value, tags: metric.tags });
    }
  }
}

// Export singleton instance
export const performanceMonitoring = PerformanceMonitoringService.getInstance();

// Hook for React components
export function usePerformanceMonitoring() {
  return {
    mark: performanceMonitoring.mark.bind(performanceMonitoring),
    measure: performanceMonitoring.measure.bind(performanceMonitoring),
    trackRender: performanceMonitoring.trackRender.bind(performanceMonitoring),
    trackApiCall: performanceMonitoring.trackApiCall.bind(performanceMonitoring),
    trackCalculation: performanceMonitoring.trackCalculation.bind(performanceMonitoring)
  };
}
