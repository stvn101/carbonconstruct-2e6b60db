
// Optimized performance monitoring service that uses more efficient techniques

interface PerformanceMetrics {
  timeToFirstByte?: number;
  timeToFirstPaint?: number;
  timeToFirstContentfulPaint?: number;
  timeToInteractive?: number;
  domLoadTime?: number;
  windowLoadTime?: number;
  resourceLoadTimes?: {
    name: string;
    duration: number;
    size?: number;
    type?: string;
  }[];
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private isInitialized = false;
  private environment: string;
  private observer: Record<string, PerformanceObserver | null> = {
    paint: null,
    resource: null,
    longtask: null
  };
  // Add a throttle mechanism to avoid excessive logging
  private lastLogTime = 0;
  private logThreshold = 2000; // ms

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
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Only fully initialize in production
    if (this.environment === 'production') {
      // Use passive event listener for better performance
      window.addEventListener('load', () => {
        // Use requestIdleCallback to avoid affecting paint performance
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
    }

    this.isInitialized = true;
  }
  
  private setupPerformanceObservers(): void {
    try {
      // Observe paint timing events
      this.observer.paint = new PerformanceObserver((entryList) => {
        // Process in next idle period
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            for (const entry of entryList.getEntries()) {
              if (entry.name === 'first-paint' || entry.name === 'first-contentful-paint') {
                this.logMetric(entry.name, entry);
              }
            }
          });
        } else {
          // Process immediately but only critical entries
          for (const entry of entryList.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              this.logMetric(entry.name, entry);
            }
          }
        }
      });
      this.observer.paint.observe({ type: 'paint', buffered: true });

      // Observe resource timing but only for slow resources
      this.observer.resource = new PerformanceObserver((entryList) => {
        // Process in next idle period
        if ('requestIdleCallback' in window) {
          (window as any).requestIdleCallback(() => {
            const resources = entryList.getEntries()
              .filter((entry) => {
                const resource = entry as PerformanceResourceTiming;
                // Only track resources that are slow (>1000ms) and not chrome extensions
                return resource.duration > 1000 && !resource.name.includes('chrome-extension');
              })
              .map(entry => {
                const resource = entry as PerformanceResourceTiming;
                return {
                  name: resource.name,
                  duration: resource.duration,
                  size: resource.transferSize || undefined,
                  type: resource.initiatorType
                };
              });
              
            if (resources.length > 0) {
              this.logResourceMetrics(resources);
            }
          });
        }
      });
      this.observer.resource.observe({ type: 'resource', buffered: true });
      
      // Observe long tasks
      if ('longtask' in PerformanceObserver.supportedEntryTypes) {
        this.observer.longtask = new PerformanceObserver((entryList) => {
          const now = Date.now();
          // Throttle logging to avoid spam
          if (now - this.lastLogTime > this.logThreshold) {
            this.lastLogTime = now;
            const longestTask = entryList.getEntries()
              .reduce((longest, current) => current.duration > longest.duration ? current : longest);
              
            console.warn('[Performance] Long task detected:', 
              Math.round(longestTask.duration), 'ms', 
              longestTask.name || 'Unknown task'
            );
          }
        });
        this.observer.longtask.observe({ type: 'longtask', buffered: true });
      }
    } catch (e) {
      console.error('Error setting up PerformanceObserver:', e);
    }
  }
  
  public disconnect(): void {
    // Cleanup observers when no longer needed
    Object.values(this.observer).forEach(observer => {
      if (observer) {
        try {
          observer.disconnect();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
    });
  }

  private captureNavigationTiming(): void {
    if (!performance || !performance.timing) return;

    const timing = performance.timing;
    const metrics: PerformanceMetrics = {
      timeToFirstByte: timing.responseStart - timing.navigationStart,
      domLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart,
      windowLoadTime: timing.loadEventEnd - timing.navigationStart
    };

    this.logPerformanceMetrics(metrics);
  }

  private logMetric(name: string, entry: PerformanceEntry): void {
    if (this.environment === 'production') {
      console.info(`[Performance] ${name}: ${Math.round(entry.startTime)}ms`);
    }
  }

  private logResourceMetrics(resources: any[]): void {
    // In production, you would send these to your analytics service
    if (this.environment === 'production' && resources.length > 0) {
      const slowestResources = resources
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 3); // Only log the 3 slowest
      
      console.info('[Performance] Slow resources:', slowestResources);
    }
  }

  public logPerformanceMetrics(metrics: PerformanceMetrics): void {
    if (this.environment === 'production') {
      console.info('[Performance] Page load metrics:', metrics);
      // Here you would typically send the metrics to your analytics service
    }
  }

  public trackRouteChange(route: string): void {
    // Reset measurements for SPA navigation
    if (performance && performance.mark && this.environment === 'production') {
      const markName = `route-change-start:${route}`;
      performance.mark(markName);
      
      // Using requestAnimationFrame for smoother measurements
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (performance && performance.mark && performance.measure) {
            const completeMarkName = `route-change-complete:${route}`;
            performance.mark(completeMarkName);
            try {
              performance.measure(
                `route-change:${route}`,
                markName,
                completeMarkName
              );
              const measures = performance.getEntriesByName(`route-change:${route}`);
              if (measures.length > 0) {
                const navigationTime = measures[0].duration;
                console.info(`[Performance] Route change to ${route}: ${Math.round(navigationTime)}ms`);
              }
            } catch (e) {
              // Silent error in performance monitoring
            }
          }
        }, 100);
      });
    }
  }
}

export default PerformanceMonitoringService.getInstance();
