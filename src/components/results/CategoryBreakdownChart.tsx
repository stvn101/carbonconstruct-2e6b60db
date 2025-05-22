
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { CalculationResult } from "@/lib/carbonExports";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: "material" | "transport" | "energy";
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ result, category }) => {
  // Determine which data to use based on the category
  const getChartData = () => {
    const breakdownObj = 
      category === "material" ? result.breakdownByMaterial : 
      category === "transport" ? result.breakdownByTransport : 
      result.breakdownByEnergy;
    
    // Create array for recharts from the breakdown object
    const chartData = Object.entries(breakdownObj || {}).map(([name, value]) => ({
      name,
      value: typeof value === 'number' ? Number(value.toFixed(2)) : 0
    }));
    
    return chartData.sort((a, b) => b.value - a.value);
  };

  const chartData = getChartData();
  
  // Check if we have valid data
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="capitalize text-lg">{category} Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No {category} data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Get total emissions for the category
  const totalCategoryEmissions = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate percentage function
  const calculatePercentage = (value: number) => {
    return totalCategoryEmissions > 0 
      ? `${((value / totalCategoryEmissions) * 100).toFixed(1)}%` 
      : "0%";
  };
  
  // Create custom colors for the charts
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", 
    "#82CA9D", "#A4DE6C", "#D0ED57", "#FAD07A", "#F76D5E"
  ];
  
  // Format the Y-axis values to show a fixed number of decimal places
  const formatYAxis = (value: number): string => {
    return value.toFixed(1);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize text-lg">{category} Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie chart for visual distribution */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => value.toFixed(2)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Bar chart for numerical comparison */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
                />
                <Tooltip 
                  formatter={(value: number) => [
                    `${value.toFixed(2)} kg CO₂e (${calculatePercentage(value)})`, 
                    "Emissions"
                  ]} 
                />
                <Bar dataKey="value" fill="#8884d8">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm font-medium">
            Total {category} emissions: {totalCategoryEmissions.toFixed(2)} kg CO₂e
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;
