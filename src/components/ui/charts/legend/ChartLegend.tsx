
import React from 'react';
import { LegendItem } from './components/LegendItem';
import { useChart } from '../ChartContainer';
import { LegendContent } from './components';

export interface ChartLegendProps {
  payload?: Array<{ value: string; dataKey?: string | number; color: string; [key: string]: any }>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  wrapperStyle?: React.CSSProperties;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export const ChartLegend: React.FC<ChartLegendProps> & {
  Content: typeof LegendContent;
} = ({ 
  payload = [], 
  layout = 'horizontal', 
  className = '',
  wrapperStyle,
  verticalAlign 
}) => {
  const { config } = useChart();

  if (!payload || payload.length === 0) {
    return null;
  }

  const isVertical = layout === 'vertical';
  
  return (
    <ul 
      className={`flex gap-4 ${isVertical ? 'flex-col' : 'flex-row'} ${className}`}
      role="list"
      style={wrapperStyle}
    >
      {payload.map((entry, index) => (
        <LegendItem 
          key={`legend-item-${index}`}
          item={entry}
        />
      ))}
    </ul>
  );
};

// Attach the LegendContent as a static property
ChartLegend.Content = LegendContent;
