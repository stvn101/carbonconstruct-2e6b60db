
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from "recharts";
import { SustainableMaterial } from "supabase/functions/get-sustainability-suggestions/Material";
import { Badge } from "@/components/ui/badge";

interface AlternativesComparisonChartProps {
  originalMaterial: { name: string; carbonFootprint: number; quantity?: number };
  alternatives: SustainableMaterial[];
  className?: string;
}

const AlternativesComparisonChart: React.FC<AlternativesComparisonChartProps> = ({ 
  originalMaterial, 
  alternatives,
  className
}) => {
  if (!originalMaterial || alternatives.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Alternatives</CardTitle>
          <CardDescription>Compare conventional materials with sustainable alternatives</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No alternatives data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare data for comparison chart
  const chartData = [
    {
      name: originalMaterial.name,
      carbon: originalMaterial.carbonFootprint,
      type: "Conventional",
      reduction: 0,
      score: 0
    },
    ...alternatives.map(alt => ({
      name: alt.name,
      carbon: alt.carbonFootprint,
      type: "Sustainable Alternative",
      reduction: alt.carbonReduction,
      score: alt.sustainabilityScore
    }))
  ].sort((a, b) => a.carbon - b.carbon); // Sort by carbon footprint (lowest first)
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-carbon-600 dark:text-carbon-400">
            Carbon: {payload[0].value.toFixed(2)} kg CO2e
          </p>
          {payload[0].payload.reduction > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Reduction: {payload[0].payload.reduction}%
            </p>
          )}
          {payload[0].payload.score > 0 && (
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Sustainability Score: {payload[0].payload.score}/100
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Define colors for material types
  const CONVENTIONAL_COLOR = "#f59e0b";
  const SUSTAINABLE_COLOR = "#3e9847";

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Material Alternatives
          <Badge variant="outline" className="ml-2 bg-carbon-50 text-carbon-700 dark:bg-carbon-900 dark:text-carbon-300">
            Up to {Math.max(...alternatives.map(alt => alt.carbonReduction), 0)}% Reduction
          </Badge>
        </CardTitle>
        <CardDescription>
          Comparing {originalMaterial.name} with sustainable alternatives
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            layout="vertical" 
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} />
            <XAxis 
              type="number" 
              label={{ value: 'Carbon Footprint (kg CO2e)', position: 'insideBottom', offset: -5 }}
            />
            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
            <Tooltip content={customTooltip} />
            <Legend />
            <Bar 
              dataKey="carbon" 
              name="Carbon Footprint" 
              fill={SUSTAINABLE_COLOR}
              strokeWidth={2}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === "Conventional" ? CONVENTIONAL_COLOR : SUSTAINABLE_COLOR}
                  stroke={entry.type === "Conventional" ? CONVENTIONAL_COLOR : SUSTAINABLE_COLOR}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AlternativesComparisonChart;
