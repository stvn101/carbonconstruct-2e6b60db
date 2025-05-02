
import React from 'react';
import { useChart } from '../../ChartContainer';

interface LegendItemProps {
  item: {
    value: string;
    dataKey?: string;
    color?: string;
    [key: string]: any;
  };
  nameKey?: string;
  hideIcon?: boolean; 
  className?: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ 
  item, 
  nameKey = 'dataKey',
  hideIcon = false, 
  className = ''
}) => {
  const { config } = useChart();
  
  const key = item[nameKey];
  const itemConfig = key ? config[key] : null;
  
  const IconComponent = itemConfig?.icon;
  const color = item.color || itemConfig?.color || '#3e9847'; // Default to a carbon color

  return (
    <li className={`flex items-center gap-2 text-sm ${className}`}>
      {!hideIcon && IconComponent ? (
        <IconComponent />
      ) : (
        <div 
          className="rounded-[2px] h-[10px] w-[10px]" 
          style={{ backgroundColor: color }}
        />
      )}
      <span className="text-foreground">
        {itemConfig?.label || item.value}
      </span>
    </li>
  );
};
