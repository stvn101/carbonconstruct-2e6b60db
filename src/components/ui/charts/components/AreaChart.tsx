
import { memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized AreaChart component for better performance
const AreaChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.AreaChart>) => (
  <RechartsPrimitive.AreaChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.AreaChart>
));
AreaChart.displayName = 'MemoizedAreaChart';

export { AreaChart };
