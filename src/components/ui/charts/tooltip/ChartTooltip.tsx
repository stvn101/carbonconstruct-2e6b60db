
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { TooltipContent } from "./components/TooltipContent"

// Create a wrapper for Recharts Tooltip that includes the Content component
const ChartTooltip = Object.assign(
  RechartsPrimitive.Tooltip,
  { Content: TooltipContent }
);

export { ChartTooltip };
