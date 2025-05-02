
import { useMemo, memo } from "react"
import * as RechartsPrimitive from "recharts"

// Memoized chart components for better performance
const BarChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.BarChart>) => (
  <RechartsPrimitive.BarChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.BarChart>
));
BarChart.displayName = 'MemoizedBarChart';

const LineChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.LineChart>) => (
  <RechartsPrimitive.LineChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.LineChart>
));
LineChart.displayName = 'MemoizedLineChart';

const AreaChart = memo(({ data, margin, children }: React.ComponentProps<typeof RechartsPrimitive.AreaChart>) => (
  <RechartsPrimitive.AreaChart data={data} margin={margin}>
    {children}
  </RechartsPrimitive.AreaChart>
));
AreaChart.displayName = 'MemoizedAreaChart';

const PieChart = memo(({ margin, children }: React.ComponentProps<typeof RechartsPrimitive.PieChart>) => (
  <RechartsPrimitive.PieChart margin={margin}>
    {children}
  </RechartsPrimitive.PieChart>
));
PieChart.displayName = 'MemoizedPieChart';

export const CartesianGrid = memo(RechartsPrimitive.CartesianGrid);
export const XAxis = memo(RechartsPrimitive.XAxis);
export const YAxis = memo(RechartsPrimitive.YAxis);
export const Bar = Object.assign(memo(RechartsPrimitive.Bar), { Chart: BarChart });
export const Line = Object.assign(memo(RechartsPrimitive.Line), { Chart: LineChart });
export const Area = Object.assign(memo(RechartsPrimitive.Area), { Chart: AreaChart });
export const Pie = Object.assign(memo(RechartsPrimitive.Pie), { Chart: PieChart });
export const Cell = memo(RechartsPrimitive.Cell);
