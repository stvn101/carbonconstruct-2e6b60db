
import * as React from "react"
import { useMemo, memo } from "react"
import * as RechartsPrimitive from "recharts"
import { 
  ChartContainer, 
  ChartConfig 
} from "./ChartContainer"
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip"
import { ChartLegend, ChartLegendContent } from "./ChartLegend"

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

// Memoized custom tooltip component
const MemoizedTooltipContent = memo(ChartTooltipContent);
const MemoizedLegendContent = memo(ChartLegendContent);

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

  // Determine chart margins based on screen size
  const getChartMargins = () => {
    // Use smaller margins on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return { top: 5, right: 5, left: 5, bottom: 20 };
    }
    return { top: 5, right: 5, left: 0, bottom: 5 };
  };

  let chartElement: React.ReactElement;
  
  if (type === 'bar') {
    chartElement = (
      <RechartsPrimitive.BarChart data={data} margin={getChartMargins()}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis 
          dataKey={index} 
          tick={{ fontSize: 10 }} 
          height={35}
          tickFormatter={(value) => {
            // For small screens, truncate long texts
            if (typeof window !== 'undefined' && window.innerWidth < 640 && value.length > 8) {
              return `${value.substring(0, 6)}...`;
            }
            return value;
          }}
        />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <MemoizedTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          } 
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Bar 
            key={category}
            dataKey={category} 
            fill={colors[i % colors.length]} 
            isAnimationActive={false} // Disable animation for better performance
          />
        ))}
      </RechartsPrimitive.BarChart>
    );
  } else if (type === 'line') {
    chartElement = (
      <RechartsPrimitive.LineChart data={data} margin={getChartMargins()}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis 
          dataKey={index} 
          tick={{ fontSize: 10 }}
          tickFormatter={(value) => {
            // For small screens, truncate long texts
            if (typeof window !== 'undefined' && window.innerWidth < 640 && value.length > 8) {
              return `${value.substring(0, 6)}...`;
            }
            return value;
          }}
        />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <MemoizedTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          } 
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={colors[i % colors.length]}
            activeDot={{ r: 6 }}
            isAnimationActive={false} // Disable animation for better performance
          />
        ))}
      </RechartsPrimitive.LineChart>
    );
  } else if (type === 'pie') {
    chartElement = (
      <RechartsPrimitive.PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip 
          content={
            <MemoizedTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          }
          wrapperStyle={{ zIndex: 1000 }}
        />
        {showLegend && <RechartsPrimitive.Legend 
          content={<MemoizedLegendContent />} 
          wrapperStyle={{ fontSize: '10px' }} 
          verticalAlign="bottom" 
        />}
        <RechartsPrimitive.Pie
          data={data}
          nameKey={index}
          dataKey={categories[0]}
          cx="50%"
          cy="45%"
          outerRadius={70}
          fill="#8884d8"
          label={(entry) => {
            // Only show labels on larger screens
            if (typeof window !== 'undefined' && window.innerWidth < 640) return null;
            return `${entry.name}: ${entry[categories[0]]}`;
          }}
          labelLine={typeof window !== 'undefined' && window.innerWidth >= 640}
          isAnimationActive={false} // Disable animation for better performance
        >
          {data.map((entry, i) => (
            <RechartsPrimitive.Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    );
  } else { // area chart
    chartElement = (
      <RechartsPrimitive.AreaChart data={data} margin={getChartMargins()}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis 
          dataKey={index} 
          tick={{ fontSize: 10 }} 
          tickFormatter={(value) => {
            // For small screens, truncate long texts
            if (typeof window !== 'undefined' && window.innerWidth < 640 && value.length > 8) {
              return `${value.substring(0, 6)}...`;
            }
            return value;
          }}
        />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <MemoizedTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          }
          wrapperStyle={{ zIndex: 1000 }}
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={colors[i % colors.length]}
            stroke={colors[i % colors.length]}
            isAnimationActive={false} // Disable animation for better performance
          />
        ))}
      </RechartsPrimitive.AreaChart>
    );
  }

  return (
    <ChartContainer className={`w-full h-full ${className}`} config={chartConfig}>
      {chartElement}
    </ChartContainer>
  );
};

// Memoize the Chart component to prevent unnecessary re-renders
const MemoizedChart = memo(Chart);

export { 
  MemoizedChart as Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
}
