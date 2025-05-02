
import { memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized PieChart component for better performance
const PieChart = memo(({ margin, children }: React.ComponentProps<typeof RechartsPrimitive.PieChart>) => (
  <RechartsPrimitive.PieChart margin={margin}>
    {children}
  </RechartsPrimitive.PieChart>
));
PieChart.displayName = 'MemoizedPieChart';

export { PieChart };
