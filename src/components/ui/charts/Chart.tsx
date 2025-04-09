
import * as React from "react"
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
  const chartConfig = categories.reduce((acc, category, i) => {
    acc[category] = { 
      color: colors[i % colors.length],
      label: category
    };
    return acc;
  }, {} as ChartConfig);

  let chartElement: React.ReactElement;
  
  if (type === 'bar') {
    chartElement = (
      <RechartsPrimitive.BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} tick={{ fontSize: 10 }} />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          } 
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Bar 
            key={category}
            dataKey={category} 
            fill={colors[i % colors.length]} 
          />
        ))}
      </RechartsPrimitive.BarChart>
    );
  } else if (type === 'line') {
    chartElement = (
      <RechartsPrimitive.LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} tick={{ fontSize: 10 }} />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <ChartTooltipContent 
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
          />
        ))}
      </RechartsPrimitive.LineChart>
    );
  } else if (type === 'pie') {
    chartElement = (
      <RechartsPrimitive.PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          }
        />
        {showLegend && <RechartsPrimitive.Legend 
          content={<ChartLegendContent />} 
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
          label={(entry) => `${entry.name}: ${entry[categories[0]]}`}
          labelLine={false}
        >
          {data.map((entry, i) => (
            <RechartsPrimitive.Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    );
  } else { // area chart
    chartElement = (
      <RechartsPrimitive.AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} tick={{ fontSize: 10 }} />
        <RechartsPrimitive.YAxis className="text-foreground" tick={{ fontSize: 10 }} />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          }
        />
        {categories.map((category, i) => (
          <RechartsPrimitive.Area
            key={category}
            type="monotone"
            dataKey={category}
            fill={colors[i % colors.length]}
            stroke={colors[i % colors.length]}
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

export { 
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
}
