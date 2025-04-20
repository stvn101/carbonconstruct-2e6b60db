
// Simple performance monitoring service that can be expanded or integrated with third-party services

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

    if (this.environment === 'production') {
      // Add load event listener to capture page load metrics
      window.addEventListener('load', () => {
        // Give browser time to calculate performance metrics
        setTimeout(() => this.captureNavigationTiming(), 0);
      });

      // Initialize Performance Observer if available
      if ('PerformanceObserver' in window) {
        try {
          // Observe paint timing events
          this.observer.paint = new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
              if (entry.name === 'first-paint') {
                this.logMetric('first-paint', entry);
              } else if (entry.name === 'first-contentful-paint') {
                this.logMetric('first-contentful-paint', entry);
              }
            }
          });
          this.observer.paint.observe({ type: 'paint', buffered: true });

          // Observe resource timing
          this.observer.resource = new PerformanceObserver((entryList) => {
            const resources = entryList.getEntries().map(entry => {
              const resource = entry as PerformanceResourceTiming;
              return {
                name: resource.name,
                duration: resource.duration,
                size: resource.transferSize || undefined,
                type: resource.initiatorType
              };
            });
            this.logResourceMetrics(resources);
          });
          this.observer.resource.observe({ type: 'resource', buffered: true });
          
          // Observe long tasks
          if ('longtask' in PerformanceObserver.supportedEntryTypes) {
            this.observer.longtask = new PerformanceObserver((entryList) => {
              entryList.getEntries().forEach(entry => {
                console.warn('[Performance] Long task detected:', 
                  Math.round(entry.duration), 'ms', 
                  entry.name || 'Unknown task'
                );
              });
            });
            this.observer.longtask.observe({ type: 'longtask', buffered: true });
          }
        } catch (e) {
          console.error('Error setting up PerformanceObserver:', e);
        }
      }
    }

    this.isInitialized = true;
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
      const slowResources = resources
        .filter(r => r.duration > 1000 && !r.name.includes('chrome-extension'))
        .sort((a, b) => b.duration - a.duration);

      if (slowResources.length > 0) {
        console.info('[Performance] Slow resources:', slowResources.slice(0, 5));
      }
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
      
      // Measure after page content is likely rendered
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
            console.error('Error measuring route change:', e);
          }
        }
      }, 100);
    }
  }
}

export default PerformanceMonitoringService.getInstance();
