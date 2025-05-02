
import { memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized BarChart component for better performance
const BarChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.BarChart>) => (
  <RechartsPrimitive.BarChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.BarChart>
));
BarChart.displayName = 'MemoizedBarChart';

export { BarChart };
