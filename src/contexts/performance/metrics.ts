
export interface MetricsOptions {
  metric: string;
  value: number;
  tags?: { [key: string]: string };
}

/**
 * Track performance metrics
 */
export const trackMetric = ({ metric, value, tags }: MetricsOptions) => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
    // Use the correct Sentry metrics method - distribution is appropriate for performance metrics
    import('@sentry/browser').then(Sentry => {
      Sentry.metrics.distribution(metric, value, { tags });
    });
  } else {
    console.debug(`[Performance] Metric: ${metric} = ${value}`, tags);
  }
};

/**
 * Track route change performance
 */
export const trackRouteChange = (path: string) => {
  const loadTime = performance.now();
  console.debug(`[Performance] Route change to: ${path}`);
  trackMetric({
    metric: 'route_change',
    value: loadTime,
    tags: { path }
  });
};

/**
 * Track render performance
 */
export const trackRender = (componentName: string) => {
  trackMetric({
    metric: 'component_render',
    value: performance.now(),
    tags: { component: componentName }
  });
};
