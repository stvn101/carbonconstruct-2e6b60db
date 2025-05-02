
import { useMemo, memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized chart components for better performance
export const BarChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.BarChart>) => (
  <RechartsPrimitive.BarChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.BarChart>
));
BarChart.displayName = 'MemoizedBarChart';

export const LineChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.LineChart>) => (
  <RechartsPrimitive.LineChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.LineChart>
));
LineChart.displayName = 'MemoizedLineChart';

export const AreaChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.AreaChart>) => (
  <RechartsPrimitive.AreaChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.AreaChart>
));
AreaChart.displayName = 'MemoizedAreaChart';

export const PieChart = memo(({ margin, children }: React.ComponentProps<typeof RechartsPrimitive.PieChart>) => (
  <RechartsPrimitive.PieChart margin={margin}>
    {children}
  </RechartsPrimitive.PieChart>
));
PieChart.displayName = 'MemoizedPieChart';

export const CartesianGrid = memo(RechartsPrimitive.CartesianGrid);
export const XAxis = memo(RechartsPrimitive.XAxis);
export const YAxis = memo(RechartsPrimitive.YAxis);
export const Bar = memo(RechartsPrimitive.Bar);
export const Line = memo(RechartsPrimitive.Line);
export const Area = memo(RechartsPrimitive.Area);
export const Pie = memo(RechartsPrimitive.Pie);
export const Cell = memo(RechartsPrimitive.Cell);
