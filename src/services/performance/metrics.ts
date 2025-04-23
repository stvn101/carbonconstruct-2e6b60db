
export const trackMetric = ({ 
  metric, 
  value, 
  tags 
}: { 
  metric: string; 
  value: number; 
  tags?: { [key: string]: string } 
}) => {
  if (process.env.NODE_ENV === 'production' && process.env.VITE_SENTRY_DSN) {
    // Use the correct Sentry metrics method - distribution is appropriate for performance metrics
    import('@sentry/browser').then(Sentry => {
      Sentry.metrics.distribution(metric, value, { tags });
    });
  } else {
    console.debug(`[Performance] Metric: ${metric} = ${value}`, tags);
  }
};

export const trackRouteChange = (path: string) => {
  console.debug(`[Performance] Route change to: ${path}`);
  trackMetric({
    metric: 'route_change',
    value: performance.now(),
    tags: { path }
  });
};
