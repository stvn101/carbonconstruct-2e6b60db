
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/browser";
import { 
  monitorFirstInputDelay,
  monitorLargestContentfulPaint,
  monitorCumulativeLayoutShift,
  monitorPaintTiming
} from './performance/observers';
import { trackMetric, trackRouteChange } from './performance/metrics';

const initialize = () => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE,
      debug: import.meta.env.DEV,
      release: import.meta.env.VITE_VERSION,
      beforeSend(event) {
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

const cleanup = () => {
  console.debug('[Performance] Cleaning up performance monitors');
};

const performanceMonitoringService = {
  initialize,
  trackMetric,
  trackRouteChange,
  cleanup
};

export default performanceMonitoringService;
