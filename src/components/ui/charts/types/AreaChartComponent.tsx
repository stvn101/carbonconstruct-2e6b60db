
import * as React from "react"
import { CartesianGrid, XAxis, YAxis } from "../ChartComponents"
import { Area } from "../ChartComponents"
import { ChartTooltip } from "../tooltip/ChartTooltip"
import { ChartLegend } from "../legend/ChartLegend"
import { ChartTypeProps } from "./ChartTypeProps"

export const AreaChartComponent: React.FC<ChartTypeProps> = ({ 
  data, categories, index, colors, valueFormatter, showLegend 
}) => {
  const getChartMargins = () => {
    // Use smaller margins on mobile
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return { top: 5, right: 5, left: 5, bottom: 20 };
    }
    return { top: 5, right: 5, left: 0, bottom: 5 };
  };

  return (
    <Area.Chart data={data} margin={getChartMargins()}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
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
      <YAxis className="text-foreground" tick={{ fontSize: 10 }} />
      {showLegend && <ChartLegend content={<ChartLegend.Content />} wrapperStyle={{ fontSize: '10px' }} />}
      <ChartTooltip 
        content={
          <ChartTooltip.Content 
            formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
          />
        }
        wrapperStyle={{ zIndex: 1000 }}
      />
      {categories.map((category, i) => (
        <Area
          key={category}
          type="monotone"
          dataKey={category}
          fill={colors[i % colors.length]}
          stroke={colors[i % colors.length]}
          isAnimationActive={false} // Disable animation for better performance
        />
      ))}
    </Area.Chart>
  );
};
