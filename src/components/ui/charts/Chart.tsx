
import * as React from "react"
import { useMemo, memo } from "react"
import { 
  ChartContainer, 
  ChartConfig 
} from "./ChartContainer"
import { 
  BarChartComponent, 
  LineChartComponent,
  PieChartComponent,
  AreaChartComponent
} from "./types"
import { ChartTooltip } from "./ChartTooltip"
import { ChartLegend } from "./ChartLegend"

type ChartProps = {
  type: 'bar' | 'line' | 'pie' | 'area';
  data: any[];
  categories: string[];
  index: string;
  colors?: string[];
  valueFormatter?: (value: number) => string;
  showLegend?: boolean;
  className?: string;
}

const Chart = ({
  type,
  data,
  categories,
  index,
  colors = ['#3e9847', '#25612d', '#214d28', '#8acd91', '#b8e2bc'],
  valueFormatter,
  showLegend = true,
  className,
}: ChartProps) => {
  // Memoize chart configuration to prevent unnecessary recalculations
  const chartConfig = useMemo(() => {
    return categories.reduce((acc, category, i) => {
      acc[category] = { 
        color: colors[i % colors.length],
        label: category
      };
      return acc;
    }, {} as ChartConfig);
  }, [categories, colors]);

  // Render the appropriate chart type
  const renderChart = () => {
    const props = {
      type,
      data,
      categories,
      index,
      colors,
      valueFormatter,
      showLegend
    };

    switch (type) {
      case 'bar':
        return <BarChartComponent {...props} />;
      case 'line':
        return <LineChartComponent {...props} />;
      case 'pie':
        return <PieChartComponent {...props} />;
      case 'area':
        return <AreaChartComponent {...props} />;
      default:
        return <BarChartComponent {...props} />;
    }
  };

  return (
    <ChartContainer className={`w-full h-full ${className}`} config={chartConfig}>
      {renderChart()}
    </ChartContainer>
  );
};

// Memoize the Chart component to prevent unnecessary re-renders
const MemoizedChart = memo(Chart);

export { 
  MemoizedChart as Chart,
  ChartContainer,
  ChartTooltip,
  ChartLegend
}
