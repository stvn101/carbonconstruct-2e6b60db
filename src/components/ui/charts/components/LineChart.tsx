
import { memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized LineChart component for better performance
const LineChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.LineChart>) => (
  <RechartsPrimitive.LineChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.LineChart>
));
LineChart.displayName = 'MemoizedLineChart';

export { LineChart };
