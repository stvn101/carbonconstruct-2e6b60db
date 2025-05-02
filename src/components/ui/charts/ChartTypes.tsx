
import * as React from "react"
import { 
  BarChart, LineChart, PieChart, AreaChart,
  CartesianGrid, XAxis, YAxis, Bar, Line, Area, Pie, Cell
} from "./ChartComponents"
import { ChartTooltip, ChartTooltipContent } from "./ChartTooltip"
import { ChartLegend, ChartLegendContent } from "./ChartLegend"

type ChartTypeProps = {
  type: string;
  data: any[];
  categories: string[];
  index: string;
  colors: string[];
  valueFormatter?: (value: number) => string;
  showLegend: boolean;
}

// Memoized tooltip and legend contents
const MemoizedTooltipContent = React.memo(ChartTooltipContent);
const MemoizedLegendContent = React.memo(ChartLegendContent);

export const BarChartComponent: React.FC<ChartTypeProps> = ({ 
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
    <BarChart data={data} margin={getChartMargins()}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
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
      <YAxis className="text-foreground" tick={{ fontSize: 10 }} />
      {showLegend && <ChartLegend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
      <ChartTooltip 
        content={
          <MemoizedTooltipContent 
            formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
          />
        } 
      />
      {categories.map((category, i) => (
        <Bar 
          key={category}
          dataKey={category} 
          fill={colors[i % colors.length]} 
          isAnimationActive={false} // Disable animation for better performance
        />
      ))}
    </BarChart>
  );
};

export const LineChartComponent: React.FC<ChartTypeProps> = ({ 
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
    <LineChart data={data} margin={getChartMargins()}>
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
      {showLegend && <ChartLegend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
      <ChartTooltip 
        content={
          <MemoizedTooltipContent 
            formatter={valueFormatter ? (value) => valueFormatter(Number(value)) : undefined}
          />
        } 
      />
      {categories.map((category, i) => (
        <Line
          key={category}
          type="monotone"
          dataKey={category}
          stroke={colors[i % colors.length]}
          activeDot={{ r: 6 }}
          isAnimationActive={false} // Disable animation for better performance
        />
      ))}
    </LineChart>
  );
};

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
    <AreaChart data={data} margin={getChartMargins()}>
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
      {showLegend && <ChartLegend content={<MemoizedLegendContent />} wrapperStyle={{ fontSize: '10px' }} />}
      <ChartTooltip 
        content={
          <MemoizedTooltipContent 
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
    </AreaChart>
  );
};

export const PieChartComponent: React.FC<ChartTypeProps> = ({ 
  data, categories, index, colors, valueFormatter, showLegend 
}) => {
  return (
    <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
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
    </PieChart>
  );
};
