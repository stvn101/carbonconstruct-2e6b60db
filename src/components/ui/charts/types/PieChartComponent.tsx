
import * as React from "react"
import { Cell } from "../ChartComponents"
import { Pie } from "../ChartComponents"
import { ChartTooltip } from "../ChartTooltip"
import { ChartLegend } from "../ChartLegend"
import { ChartTypeProps } from "./ChartTypeProps"

// Memoized tooltip and legend contents
const MemoizedTooltipContent = React.memo(ChartTooltip.Content);
const MemoizedLegendContent = React.memo(ChartLegend.Content);

export const PieChartComponent: React.FC<ChartTypeProps> = ({ 
  data, categories, index, colors, valueFormatter, showLegend 
}) => {
  return (
    <Pie.Chart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
      <ChartTooltip 
        content={
          <MemoizedTooltipContent 
            formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
          />
        }
        wrapperStyle={{ zIndex: 1000 }}
      />
      {showLegend && <ChartLegend 
        content={<MemoizedLegendContent />} 
        wrapperStyle={{ fontSize: '10px' }} 
        verticalAlign="bottom" 
      />}
      <Pie
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
          <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
        ))}
      </Pie>
    </Pie.Chart>
  );
};
