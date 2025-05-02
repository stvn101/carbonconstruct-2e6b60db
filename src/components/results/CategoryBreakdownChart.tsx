
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult, Material, Transport, Energy, MATERIAL_FACTORS, TRANSPORT_FACTORS, ENERGY_FACTORS } from "@/lib/carbonCalculations";
import { Progress } from "@/components/ui/progress";
import { useCallback, useEffect, useMemo } from "react";
import { Bug } from "lucide-react";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: 'material' | 'transport' | 'energy';
}

const CategoryBreakdownChart = ({ result, category }: CategoryBreakdownChartProps) => {
  // Use useMemo to prepare chart data only when inputs change
  const { chartData, categoryTitle, categoryDescription, fillColor, totalCategoryEmissions } = useMemo(() => {
    console.log(`Preparing chart data for ${category} category`);
    console.log(`Result for ${category}:`, category === 'material' ? result.breakdownByMaterial : 
                                          category === 'transport' ? result.breakdownByTransport : 
                                          result.breakdownByEnergy);
    
    let chartData: Array<{name: string, value: number}> = [];
    let categoryTitle = "";
    let categoryDescription = "";
    let fillColor = "";
    let totalCategoryEmissions = 0;

    try {
      switch (category) {
        case 'material':
          if (!result.breakdownByMaterial || Object.keys(result.breakdownByMaterial).length === 0) {
            console.warn("Empty or invalid breakdownByMaterial data:", result.breakdownByMaterial);
          } else {
            console.log("Material factors available:", Object.keys(MATERIAL_FACTORS).length);
            
            chartData = Object.entries(result.breakdownByMaterial)
              .map(([key, value]) => {
                const materialName = MATERIAL_FACTORS[key as Material]?.name || key;
                console.log(`Material ${key} -> ${materialName}: ${value}`);
                return {
                  name: materialName,
                  value: Number(value.toFixed(2))
                };
              })
              .filter(item => item.value > 0)
              .sort((a, b) => b.value - a.value);
          }
          categoryTitle = "Material Emissions";
          categoryDescription = "Carbon footprint by material type";
          fillColor = "#3e9847";
          totalCategoryEmissions = result.materialEmissions;
          break;
          
        case 'transport':
          chartData = Object.entries(result.breakdownByTransport)
            .map(([key, value]) => ({
              name: TRANSPORT_FACTORS[key as Transport]?.name || key,
              value: Number(value.toFixed(2))
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
          categoryTitle = "Transport Emissions";
          categoryDescription = "Carbon footprint by transport method";
          fillColor = "#25612d";
          totalCategoryEmissions = result.transportEmissions;
          break;
          
        case 'energy':
          chartData = Object.entries(result.breakdownByEnergy)
            .map(([key, value]) => ({
              name: ENERGY_FACTORS[key as Energy]?.name || key,
              value: Number(value.toFixed(2))
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
          categoryTitle = "Energy Emissions";
          categoryDescription = "Carbon footprint by energy source";
          fillColor = "#214d28";
          totalCategoryEmissions = result.energyEmissions;
          break;
      }
      
      console.log(`Generated ${chartData.length} chart items for ${category}`);
    } catch (error) {
      console.error(`Error generating chart data for ${category}:`, error);
      chartData = [];
    }

    // Filter out any items with zero or extremely small values
    const filteredChartData = chartData.filter(item => item.value > 0.01);
    
    return { 
      chartData: filteredChartData, 
      categoryTitle, 
      categoryDescription, 
      fillColor, 
      totalCategoryEmissions 
    };
  }, [result, category]);

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

  const CustomTooltip = useCallback(({active, payload, label}: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / totalCategoryEmissions) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border rounded-md shadow-md p-3 text-sm max-w-[90vw]">
          <p className="font-medium">{label}</p>
          <p className="text-carbon-600 dark:text-carbon-300">
            {payload[0].value.toFixed(2)} kg CO2e ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  }, [totalCategoryEmissions]);

  // If no data, show empty state
  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{categoryTitle}</CardTitle>
          <CardDescription>{categoryDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72 flex flex-col items-center justify-center text-muted-foreground">
            <Bug className="h-8 w-8 mb-4 text-muted" />
            <p>No {category} emission data available</p>
            <p className="text-sm mt-1">Check your inputs and try recalculating</p>
          </div>
        </CardContent>
      </Card>
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
                    <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 1000 }} />
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

              {/* Add progress bars for each item */}
              <div className="mt-6 space-y-3">
                {chartData.map((item, index) => {
                  const percentage = (item.value / totalCategoryEmissions) * 100;
                  return (
                    <motion.div 
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate max-w-[60%]">{item.name}</span>
                        <span className="shrink-0">{item.value.toFixed(2)} kg CO2e ({percentage.toFixed(1)}%)</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2" 
                        indicatorClassName="bg-carbon-500"
                        style={{backgroundColor: "#e5e7eb"}}
                      />
                    </motion.div>
                  );
                })}
              </div>
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
