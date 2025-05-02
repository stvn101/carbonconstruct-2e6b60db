
// Re-export Chart Tooltip components from their individual files
export { 
  ChartTooltip,
  TooltipContent,
  getPayloadConfigFromPayload
} from './tooltip';

// For backward compatibility
export const ChartTooltipContent = TooltipContent;
