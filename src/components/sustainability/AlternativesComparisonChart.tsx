
import React from "react";
import { SustainableMaterial } from "@/lib/materialCategories";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface AlternativesComparisonChartProps {
  originalMaterial: {
    id: string;
    name: string;
    carbonFootprint: number;
    quantity?: number;
  };
  alternatives: SustainableMaterial[];
}

const AlternativesComparisonChart: React.FC<AlternativesComparisonChartProps> = ({
  originalMaterial,
  alternatives
}) => {
  // Prepare chart data
  const chartData = [
    {
      name: originalMaterial.name,
      value: originalMaterial.carbonFootprint,
      isOriginal: true,
    },
    ...alternatives.map(alt => ({
      name: alt.name,
      value: alt.carbonFootprint,
      isOriginal: false,
      reduction: alt.carbonReduction
    }))
  ].sort((a, b) => b.value - a.value);

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <h3 className="font-medium mb-3">Carbon Footprint Comparison</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                label={{ 
                  value: 'kg CO₂e', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} kg CO₂e`, 'Carbon Footprint']}
                labelFormatter={(name) => `Material: ${name}`}
                contentStyle={{ fontSize: '12px' }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="value" name="Carbon Footprint">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isOriginal ? '#f59e0b' : '#22c55e'} 
                    strokeWidth={entry.isOriginal ? 2 : 0}
                    stroke={entry.isOriginal ? '#d97706' : 'none'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-[#f59e0b] mr-2"></span>
          Original material
          <span className="inline-block w-3 h-3 bg-[#22c55e] ml-6 mr-2"></span>
          Alternative materials
        </div>
      </CardContent>
    </Card>
  );
};

export default AlternativesComparisonChart;
