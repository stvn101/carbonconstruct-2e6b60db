
// Optimized performance monitoring service focused on essential metrics

interface PerformanceMetrics {
  timeToFirstByte?: number;
  timeToFirstPaint?: number;
  timeToFirstContentfulPaint?: number;
  domLoadTime?: number;
  windowLoadTime?: number;
}

class PerformanceMonitoringService {
  private static instance: PerformanceMonitoringService;
  private isInitialized = false;
  private environment: string;
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
      // Monitor core web vitals
      this.observePaintTiming();
      this.observeLongTasks();
      this.observeResources();
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
            this.logMetric(entry.name, entry);
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
        !PerformanceObserver.supportedEntryTypes.includes('longtask')) return;
    
    try {
      const observer = new PerformanceObserver((entryList) => {
        const now = Date.now();
        if (now - this.lastLogTime > this.logThreshold) {
          this.lastLogTime = now;
          const longestTask = entryList.getEntries()
            .reduce((longest, current) => current.duration > longest.duration ? current : longest);
          console.warn('[Performance] Long task detected:', Math.round(longestTask.duration), 'ms');
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
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
            const slowResources = entryList.getEntries()
              .filter((entry) => {
                const resource = entry as PerformanceResourceTiming;
                return resource.duration > 1000 && !resource.name.includes('chrome-extension');
              })
              .slice(0, 3) // Only track the 3 slowest
              .map(entry => ({
                name: (entry as PerformanceResourceTiming).name,
                duration: entry.duration
              }));
              
            if (slowResources.length > 0) {
              console.info('[Performance] Slow resources:', slowResources);
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

    const timing = performance.timing;
    const metrics: PerformanceMetrics = {
      timeToFirstByte: timing.responseStart - timing.navigationStart,
      domLoadTime: timing.domContentLoadedEventEnd - timing.navigationStart,
      windowLoadTime: timing.loadEventEnd - timing.navigationStart
    };

    if (this.environment === 'production') {
      console.info('[Performance] Page load metrics:', metrics);
    }
  }

  private logMetric(name: string, entry: PerformanceEntry): void {
    if (this.environment === 'production') {
      console.info(`[Performance] ${name}: ${Math.round(entry.startTime)}ms`);
    }
  }

  public trackRouteChange(route: string): void {
    if (performance && performance.mark && this.environment === 'production') {
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
                console.info(`[Performance] Route change to ${route}: ${Math.round(measures[0].duration)}ms`);
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
