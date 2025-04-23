// Optimized performance monitoring service with advanced metrics and memory tracking

interface PerformanceMetrics {
  timeToFirstByte?: number;
  timeToFirstPaint?: number;
  timeToFirstContentfulPaint?: number;
  domLoadTime?: number;
  windowLoadTime?: number;
  memoryUsage?: number;
}

type PerformanceDataPoint = {
  metric: string;
  value: number;
  timestamp: number;
};

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private isInitialized = false;
  private environment: string;
  private lastLogTime = 0;
  private logThreshold = 2000; // ms
  private performanceData: PerformanceDataPoint[] = [];
  private maxDataPoints = 100;
  private memoryCheckInterval: number | null = null;

  private constructor() {
    this.environment = import.meta.env.MODE || 'development';
  }

  public static getInstance(): PerformanceMonitoringService {
    if (!PerformanceMonitoringService.instance) {
      PerformanceMonitoringService.instance = new PerformanceMonitoringService();
    }
    return PerformanceMonitoringService.instance;
  }

  public initialize(): void {
    if (this.isInitialized || typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    // Wait until document is fully loaded
    const initializeWhenReady = () => {
      // Only fully initialize in production
      if (this.environment === 'production') {
        // Use passive event listener for better performance
        window.addEventListener('load', () => {
          if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => this.captureNavigationTiming());
          } else {
            setTimeout(() => this.captureNavigationTiming(), 0);
          }
        }, { passive: true });

        // Initialize Performance Observer if available
        if ('PerformanceObserver' in window) {
          this.setupPerformanceObservers();
        }
        
        // Set up memory monitoring
        this.startMemoryMonitoring();
        
        // Listen for visibility changes to optimize performance
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
      }

      this.isInitialized = true;
    };

    // Check if document is already loaded
    if (document.readyState === 'complete') {
      initializeWhenReady();
    } else {
      // Otherwise wait for it to load
      window.addEventListener('load', initializeWhenReady, { once: true, passive: true });
    }
  }
  
  private handleVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      // Page is hidden, pause intensive monitoring
      this.pauseMonitoring();
    } else {
      // Page is visible again, resume monitoring
      this.resumeMonitoring();
    }
  }
  
  private pauseMonitoring(): void {
    // Clear memory monitoring interval
    if (this.memoryCheckInterval !== null) {
      window.clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
  }
  
  private resumeMonitoring(): void {
    // Restart memory monitoring
    this.startMemoryMonitoring();
  }
  
  private startMemoryMonitoring(): void {
    // Only run in browsers that support the memory API
    if ((performance as any).memory) {
      // Check memory usage every 30 seconds
      this.memoryCheckInterval = window.setInterval(() => {
        this.checkMemoryUsage();
      }, 30000);
      
      // Do an initial check
      this.checkMemoryUsage();
    }
  }
  
  private checkMemoryUsage(): void {
    if ((performance as any).memory) {
      const memory = (performance as any).memory;
      const usedHeapSizeMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
      const totalHeapSizeMB = Math.round(memory.totalJSHeapSize / (1024 * 1024));
      const heapLimitMB = Math.round(memory.jsHeapSizeLimit / (1024 * 1024));
      
      // Log if we're using more than 90% of available heap
      if (usedHeapSizeMB > totalHeapSizeMB * 0.9) {
        console.warn(`[Performance] High memory usage: ${usedHeapSizeMB}MB / ${totalHeapSizeMB}MB (${Math.round(usedHeapSizeMB/totalHeapSizeMB*100)}%)`);
      }
      
      this.trackMetric('memoryUsage', usedHeapSizeMB);
    }
  }
  
  private setupPerformanceObservers(): void {
    try {
      // Monitor core web vitals
      this.observePaintTiming();
      this.observeLongTasks();
      this.observeResources();
      this.observeLayoutShifts();
    } catch (e) {
      console.error('Error setting up PerformanceObserver:', e);
    }
  }

  private observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.logMetric('first-contentful-paint', entry);
            this.trackMetric('firstContentfulPaint', entry.startTime);
          } else if (entry.name === 'first-paint') {
            this.trackMetric('firstPaint', entry.startTime);
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      // Silently fail if observer throws
    }
  }

  private observeLongTasks(): void {
    if (!('PerformanceObserver' in window) || 
        !(PerformanceObserver.supportedEntryTypes || []).includes('longtask')) return;
    
    try {
      const observer = new PerformanceObserver((entryList) => {
        const now = Date.now();
        if (now - this.lastLogTime > this.logThreshold) {
          this.lastLogTime = now;
          const entries = entryList.getEntries();
          if (entries && entries.length > 0) {
            const longestTask = entries
              .reduce((longest, current) => current.duration > longest.duration ? current : longest);
            
            if (longestTask.duration > 100) {
              console.warn('[Performance] Long task detected:', Math.round(longestTask.duration), 'ms');
              this.trackMetric('longTask', longestTask.duration);
            }
          }
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      // Silently fail if observer throws
    }
  }
  
  private observeLayoutShifts(): void {
    if (!('PerformanceObserver' in window) || 
        !(PerformanceObserver.supportedEntryTypes || []).includes('layout-shift')) return;
    
    try {
      let cumulativeLayoutShift = 0;
      
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as PerformanceEntryWithTiming[]) {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value || 0;
            
            if (cumulativeLayoutShift > 0.25) {
              console.warn('[Performance] High Cumulative Layout Shift:', cumulativeLayoutShift.toFixed(2));
              this.trackMetric('cumulativeLayoutShift', cumulativeLayoutShift);
            }
          }
        }
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Silently fail if observer throws
    }
  }

  private observeResources(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((entryList) => {
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            const entries = entryList.getEntries();
            const slowResources = entries
              .filter((entry) => {
                const resource = entry as PerformanceResourceTiming;
                return resource && 
                  resource.duration > 1000 && 
                  resource.name && 
                  !resource.name.includes('chrome-extension');
              })
              .slice(0, 3) // Only track the 3 slowest
              .map(entry => ({
                name: (entry as PerformanceResourceTiming).name,
                duration: entry.duration
              }));
              
            if (slowResources.length > 0) {
              console.info('[Performance] Slow resources:', slowResources);
              for (const resource of slowResources) {
                this.trackMetric('slowResource', resource.duration, { url: resource.name });
              }
            }
          });
        }
      });
      observer.observe({ type: 'resource', buffered: true });
    } catch (e) {
      // Silently fail if observer throws
    }
  }

  private captureNavigationTiming(): void {
    if (!performance || !performance.timing) return;

    try {
      const timing = performance.timing;
      const metrics: PerformanceMetrics = {
        timeToFirstByte: timing.responseStart - timing.navigationStart,
        domLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart,
        windowLoadTime: timing.loadEventEnd - timing.navigationStart
      };

      if (this.environment === 'production') {
        console.info('[Performance] Page load metrics:', metrics);
        
        // Track each metric
        Object.entries(metrics).forEach(([key, value]) => {
          this.trackMetric(key, value);
        });
      }
    } catch (e) {
      console.warn('Error capturing navigation timing:', e);
    }
  }

  private logMetric(name: string, entry: PerformanceEntry): void {
    if (this.environment === 'production') {
      console.info(`[Performance] ${name}: ${Math.round(entry.startTime)}ms`);
    }
  }
  
  private trackMetric(metricName: string, value: number, additionalData: Record<string, any> = {}): void {
    const dataPoint = {
      metric: metricName,
      value: value,
      timestamp: Date.now(),
      ...additionalData
    };
    
    this.performanceData.push(dataPoint);
    
    // Keep the array at a reasonable size
    if (this.performanceData.length > this.maxDataPoints) {
      this.performanceData = this.performanceData.slice(-this.maxDataPoints);
    }
  }

  public trackRouteChange(route: string): void {
    if (!performance || !performance.mark) return;
    
    try {
      if (this.environment === 'production') {
        const markName = `route-change-start:${route}`;
        performance.mark(markName);
        
        requestAnimationFrame(() => {
          setTimeout(() => {
            if (performance && performance.mark && performance.measure) {
              const completeMarkName = `route-change-complete:${route}`;
              performance.mark(completeMarkName);
              try {
                performance.measure(`route-change:${route}`, markName, completeMarkName);
                const measures = performance.getEntriesByName(`route-change:${route}`);
                if (measures.length > 0) {
                  const duration = Math.round(measures[0].duration);
                  console.info(`[Performance] Route change to ${route}: ${duration}ms`);
                  this.trackMetric('routeChange', duration, { route });
                }
              } catch (e) {
                // Silent error in performance monitoring
              }
            }
          }, 100);
        });
      }
    } catch (e) {
      // Silent fail for performance tracking
    }
  }
  
  // Get performance metrics summary for analysis
  public getMetrics(): PerformanceDataPoint[] {
    return [...this.performanceData];
  }
  
  // Clean up on service shutdown
  public cleanup(): void {
    if (this.memoryCheckInterval !== null) {
      window.clearInterval(this.memoryCheckInterval);
      this.memoryCheckInterval = null;
    }
    
    this.isInitialized = false;
  }
}

export default PerformanceMonitoringService.getInstance();
