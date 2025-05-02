
import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { LegendContent } from "./LegendContent"

// Create a wrapper for Recharts Legend that includes the Content component
const ChartLegend = Object.assign(
  RechartsPrimitive.Legend,
  { Content: LegendContent }
);

export { ChartLegend };
