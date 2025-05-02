
import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface ProgressBarItemProps {
  name: string;
  value: number;
  totalValue: number;
  index: number;
}

const ProgressBarItem = ({ name, value, totalValue, index }: ProgressBarItemProps) => {
  const percentage = (value / totalValue) * 100;
  
  return (
    <motion.div 
      key={name}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-sm">
        <span className="font-medium truncate max-w-[60%]">{name}</span>
        <span className="shrink-0">{value.toFixed(2)} kg CO2e ({percentage.toFixed(1)}%)</span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2" 
        indicatorClassName="bg-carbon-500"
        style={{backgroundColor: "#e5e7eb"}}
      />
    </motion.div>
  );
};

interface ChartProgressBarsProps {
  chartData: Array<{name: string, value: number}>;
  totalCategoryEmissions: number;
}

const ChartProgressBars = ({ chartData, totalCategoryEmissions }: ChartProgressBarsProps) => {
  return (
    <div className="mt-6 space-y-3">
      {chartData.map((item, index) => (
        <ProgressBarItem 
          key={item.name}
          name={item.name}
          value={item.value}
          totalValue={totalCategoryEmissions}
          index={index}
        />
      ))}
    </div>
  );
};

export default ChartProgressBars;
