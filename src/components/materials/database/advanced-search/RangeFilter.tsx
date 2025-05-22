
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface RangeFilterProps {
  title: string;
  description?: string;
  min: number;
  max: number;
  step: number;
  value: [number, number];
  onChange: (values: number[]) => void;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  title,
  description,
  min,
  max,
  step,
  value,
  onChange
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="text-xs text-muted-foreground">
          {value[0]} - {value[1]}{description && ` ${description}`}
        </span>
      </div>
      <Slider
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        value={value}
        onValueChange={onChange}
      />
    </div>
  );
};

export default RangeFilter;
