
import React from 'react';
import { LegendItem } from './components/LegendItem';
import { useChart } from '../ChartContainer';

export interface ChartLegendProps {
  payload?: Array<{ value: string; dataKey?: string; color: string; [key: string]: any }>;
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

export const ChartLegend = ({ 
  payload = [], 
  layout = 'horizontal', 
  className = '' 
}: ChartLegendProps) => {
  const { config } = useChart();

  if (!payload || payload.length === 0) {
    return null;
  }

  const isVertical = layout === 'vertical';
  
  return (
    <ul 
      className={`flex gap-4 ${isVertical ? 'flex-col' : 'flex-row'} ${className}`}
      role="list"
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
