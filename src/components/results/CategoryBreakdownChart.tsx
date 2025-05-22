
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CalculationResult } from "@/lib/carbonExports";

interface CategoryBreakdownChartProps {
  result: CalculationResult;
  category: "material" | "transport" | "energy";
}

const CategoryBreakdownChart: React.FC<CategoryBreakdownChartProps> = ({ result, category }) => {
  // Select the appropriate data based on the category
  let chartData: { name: string; value: number }[] = [];
  let title = "";
  let totalEmissions = 0;
  let noDataMessage = "";

  switch (category) {
    case "material":
      title = "Materials Breakdown";
      chartData = Object.entries(result.breakdownByMaterial || {})
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);
      totalEmissions = result.materialEmissions || 0;
      noDataMessage = "No material data available";
      break;
    case "transport":
      title = "Transport Breakdown";
      chartData = Object.entries(result.breakdownByTransport || {})
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);
      totalEmissions = result.transportEmissions || 0;
      noDataMessage = "No transport data available";
      break;
    case "energy":
      title = "Energy Breakdown";
      chartData = Object.entries(result.breakdownByEnergy || {})
        .map(([name, value]) => ({ name, value: Number(value) }))
        .sort((a, b) => b.value - a.value);
      totalEmissions = result.energyEmissions || 0;
      noDataMessage = "No energy data available";
      break;
  }
  
  // Define colors for the bars
  const colors = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042", 
    "#8884d8", "#82ca9d", "#ffc658", "#FF6B6B"
  ];
  
  // Format tick values to be more readable
  const formatYAxisTick = (value: any) => {
    if (typeof value !== 'number') return '';
    
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };
  
  // Custom tooltip formatter
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalEmissions) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 shadow-sm rounded">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.value.toFixed(2)} kg CO₂e</p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  width={40} 
                  tickFormatter={formatYAxisTick}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={renderTooltip} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">{noDataMessage}</div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdownChart;
