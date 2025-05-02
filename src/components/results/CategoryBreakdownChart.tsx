
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/carbonCalculations";
import ChartEmptyState from "./charts/ChartEmptyState";
import CategoryBarChart from "./charts/CategoryBarChart";
import ChartProgressBars from "./charts/ChartProgressBars";
import { useChartData } from "./charts/ChartDataHandler";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: 'material' | 'transport' | 'energy';
}

const CategoryBreakdownChart = ({ result, category }: CategoryBreakdownChartProps) => {
  // Use hook to get chart data
  const { chartData, categoryTitle, categoryDescription, fillColor, totalCategoryEmissions } = 
    useChartData({ result, category });

  // Log when the component renders
  useEffect(() => {
    console.log(`CategoryBreakdownChart for ${category} rendering with ${chartData.length} items`);
  }, [category, chartData.length]);

  // Animation variants with staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  // If no data, show empty state
  if (!chartData || chartData.length === 0) {
    return (
      <ChartEmptyState 
        categoryTitle={categoryTitle}
        categoryDescription={categoryDescription}
        category={category}
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Card>
        <CardHeader>
          <CardTitle>{categoryTitle}</CardTitle>
          <CardDescription>
            {categoryDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <>
              <CategoryBarChart 
                chartData={chartData} 
                fillColor={fillColor} 
                totalCategoryEmissions={totalCategoryEmissions} 
              />
              <ChartProgressBars 
                chartData={chartData}
                totalCategoryEmissions={totalCategoryEmissions}
              />
            </>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <p className="text-muted-foreground">No {category} emission data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryBreakdownChart;
