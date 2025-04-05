
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
      <RechartsPrimitive.BarChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} />
        <RechartsPrimitive.YAxis className="text-foreground" />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} />}
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
      <RechartsPrimitive.LineChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} />
        <RechartsPrimitive.YAxis className="text-foreground" />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} />}
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
            activeDot={{ r: 8 }}
          />
        ))}
      </RechartsPrimitive.LineChart>
    );
  } else if (type === 'pie') {
    chartElement = (
      <RechartsPrimitive.PieChart>
        <ChartTooltip 
          content={
            <ChartTooltipContent 
              formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
            />
          }
        />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} />}
        <RechartsPrimitive.Pie
          data={data}
          nameKey={index}
          dataKey={categories[0]}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        >
          {data.map((entry, i) => (
            <RechartsPrimitive.Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </RechartsPrimitive.Pie>
      </RechartsPrimitive.PieChart>
    );
  } else { // area chart
    chartElement = (
      <RechartsPrimitive.AreaChart data={data}>
        <RechartsPrimitive.CartesianGrid strokeDasharray="3 3" />
        <RechartsPrimitive.XAxis dataKey={index} />
        <RechartsPrimitive.YAxis className="text-foreground" />
        {showLegend && <RechartsPrimitive.Legend content={<ChartLegendContent />} />}
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
    <ChartContainer className={className} config={chartConfig}>
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
