
import React from "react";

interface ChartTooltipCustomProps {
  active: boolean;
  payload: any[];
  label: string;
  totalCategoryEmissions: number;
}

const ChartTooltipCustom = ({ active, payload, totalCategoryEmissions }: ChartTooltipCustomProps) => {
  if (active && payload && payload.length) {
    const percentage = ((payload[0].value / totalCategoryEmissions) * 100).toFixed(1);
    return (
      <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm max-w-[90vw]">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-carbon-600 dark:text-carbon-300">
          {payload[0].value.toFixed(2)} kg CO2e ({percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

export default ChartTooltipCustom;
