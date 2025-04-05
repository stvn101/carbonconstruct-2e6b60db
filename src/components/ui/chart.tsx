
// Re-export all chart components from their individual files
export {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from './charts/Chart';

// Export the ChartStyle for backward compatibility
export { ChartStyle } from './charts/ChartContainer';

// Export the chart config type for backward compatibility
export type { ChartConfig } from './charts/ChartContainer';
