
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/browser";

// Initialize Sentry for performance monitoring and error tracking
const initialize = () => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: 0.1,
      
      // Capture Replay for 10% of all sessions,
      replaysSessionSampleRate: 0.1,
      
      // If you're not already sampling the entire session, adjust the sample rate accordingly 
      replaysOnErrorSampleRate: 1.0,
      
      // Set environment
      environment: import.meta.env.MODE,
      
      // Enable debugging mode
      debug: import.meta.env.DEV,
      
      // Ensure error tracking is enabled
      enableErrorHandling: true,
      
      // Release version
      release: import.meta.env.VITE_VERSION,
      
      beforeSend(event) {
        // Check if the event is an exception, and whether it
        // has already been reported.  If so, don't report it again.
        if (event.exception) {
          Sentry.showReportDialog();
        }
        return event;
      }
    });
    
    monitorFirstInputDelay();
    monitorLargestContentfulPaint();
    monitorCumulativeLayoutShift();
    monitorPaintTiming();
  } else {
    console.log('Performance monitoring not initialized in development mode.');
  }
};

// Custom metric tracking function
const trackMetric = ({ metric, value, tags }: { metric: string; value: number; tags?: { [key: string]: string } }) => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
    Sentry.metrics.add(metric, value, tags);
  } else {
    console.debug(`[Performance] Metric: ${metric} = ${value}`, tags);
  }
};

// Track route changes
const trackRouteChange = (path: string) => {
  console.debug(`[Performance] Route change to: ${path}`);
  trackMetric({
    metric: 'route_change',
    value: performance.now(),
    tags: { path }
  });
};

// Cleanup resources
const cleanup = () => {
  // Any cleanup logic needed when the app unmounts
  console.debug('[Performance] Cleaning up performance monitors');
};

// Monitor First Input Delay (FID)
const monitorFirstInputDelay = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Ensure entry is a PerformanceEventTiming
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as PerformanceEventTiming;
        
        // Log FID metric
        console.debug(`[Performance] First Input Delay: ${fidEntry.processingStart - fidEntry.startTime}ms`);
        
        // Track in monitoring service
        trackMetric({
          metric: 'fid',
          value: fidEntry.processingStart - fidEntry.startTime,
          tags: {
            type: 'timing',
            entryType: fidEntry.entryType,
          }
        });
      }
    }
  });
  
  // Observe first-input timing events
  observer.observe({ type: 'first-input', buffered: true });
  return observer;
};

// Monitor Largest Contentful Paint (LCP)
const monitorLargestContentfulPaint = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Ensure entry is a LargestContentfulPaint
      if (entry.entryType === 'largest-contentful-paint') {
        const lcpEntry = entry as PerformanceEntry & {
          startTime: number;
          element?: Element;
        };
        
        // Log LCP metric
        console.debug(`[Performance] Largest Contentful Paint: ${lcpEntry.startTime}ms`);
        
        // Track in monitoring service
        trackMetric({
          metric: 'lcp',
          value: lcpEntry.startTime,
          tags: {
            type: 'paint',
            entryType: lcpEntry.entryType,
          }
        });
      }
    }
  });
  
  // Observe largest-contentful-paint events
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  return observer;
};

// Monitor Cumulative Layout Shift (CLS)
const monitorCumulativeLayoutShift = () => {
  if (!('performance' in window)) return;
  
  let clsValue = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Ensure entry is a LayoutShift
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as PerformanceEntry & { 
          value: number;
          hadRecentInput: boolean;
        };
        
        // Only count layout shifts that are not expected
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          
          // Log CLS metric
          console.debug(`[Performance] Cumulative Layout Shift: ${clsValue.toFixed(3)}`);
          
          // Track in monitoring service
          trackMetric({
            metric: 'cls',
            value: clsValue,
            tags: {
              type: 'layout',
              entryType: layoutShiftEntry.entryType,
            }
          });
        }
      }
    }
  });
  
  // Observe layout-shift events
  observer.observe({ type: 'layout-shift', buffered: true });
  return observer;
};

// Monitor Paint Timing
const monitorPaintTiming = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Fix the type reference - using the standard interface instead
      const paintEntry = entry as PerformanceEntry & { 
        startTime: number;
        duration: number;
      };
      
      // Log paint metrics
      console.debug(`[Performance] Paint timing: ${entry.name} = ${paintEntry.startTime.toFixed(2)}ms`);
      
      // Track in monitoring service
      trackMetric({
        metric: `paint_${entry.name.toLowerCase().replace('-', '_')}`,
        value: paintEntry.startTime,
        tags: {
          type: 'paint',
          entryType: entry.entryType,
        }
      });
    }
  });
  
  // Observe paint timing events
  observer.observe({ entryTypes: ['paint'] });
  return observer;
};

const performanceMonitoringService = {
  initialize,
  trackMetric,
  trackRouteChange,
  cleanup
};

export default performanceMonitoringService;
