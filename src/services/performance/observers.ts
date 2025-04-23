
import { trackMetric } from './metrics';

export const monitorFirstInputDelay = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as PerformanceEventTiming;
        console.debug(`[Performance] First Input Delay: ${fidEntry.processingStart - fidEntry.startTime}ms`);
        
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
  
  observer.observe({ type: 'first-input', buffered: true });
  return observer;
};

export const monitorLargestContentfulPaint = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        const lcpEntry = entry as PerformanceEntry & {
          startTime: number;
          element?: Element;
        };
        
        console.debug(`[Performance] Largest Contentful Paint: ${lcpEntry.startTime}ms`);
        
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
  
  observer.observe({ type: 'largest-contentful-paint', buffered: true });
  return observer;
};

export const monitorCumulativeLayoutShift = () => {
  if (!('performance' in window)) return;
  
  let clsValue = 0;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as PerformanceEntry & { 
          value: number;
          hadRecentInput: boolean;
        };
        
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          
          console.debug(`[Performance] Cumulative Layout Shift: ${clsValue.toFixed(3)}`);
          
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
  
  observer.observe({ type: 'layout-shift', buffered: true });
  return observer;
};

export const monitorPaintTiming = () => {
  if (!('performance' in window)) return;
  
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const paintEntry = entry as PerformanceEntry & { 
        startTime: number;
        duration: number;
      };
      
      console.debug(`[Performance] Paint timing: ${entry.name} = ${paintEntry.startTime.toFixed(2)}ms`);
      
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
  
  observer.observe({ entryTypes: ['paint'] });
  return observer;
};
