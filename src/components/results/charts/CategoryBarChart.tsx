
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ChartTooltipCustom from "./ChartTooltipCustom";

interface CategoryBarChartProps {
  chartData: Array<{name: string, value: number}>;
  fillColor: string;
  totalCategoryEmissions: number;
}

const CategoryBarChart = ({ chartData, fillColor, totalCategoryEmissions }: CategoryBarChartProps) => {
  // Animation variants
  const chartVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  useEffect(() => {
    console.log(`CategoryBarChart rendering with ${chartData.length} items`);
  }, [chartData.length]);

  return (
    <motion.div className="h-72" variants={chartVariants}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ right: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
            height={60}
            tickFormatter={(value) => {
              // For small screens, truncate long names
              return window.innerWidth < 640 && value.length > 10
                ? `${value.substring(0, 8)}...`
                : value;
            }}
          />
          <YAxis 
            label={{ 
              value: 'kg CO2e', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12 }
            }}
            tickFormatter={(value) => typeof value === 'number' ? `${value.toFixed(0)}` : value} 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip content={
            <ChartTooltipCustom 
              active={false} 
              payload={[]} 
              label="" 
              totalCategoryEmissions={totalCategoryEmissions} 
            />
          } 
          wrapperStyle={{ zIndex: 1000 }} />
          <Bar 
            dataKey="value" 
            fill={fillColor} 
            radius={[4, 4, 0, 0]}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CategoryBarChart;
