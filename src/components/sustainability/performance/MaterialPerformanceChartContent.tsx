
import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { PerformanceChartData } from "./chartConfig";

interface MaterialPerformanceChartContentProps {
  chartType: 'line' | 'area';
  chartData: PerformanceChartData[];
  valueFormatter?: (value: number) => string;
}

export const MaterialPerformanceChartContent: React.FC<MaterialPerformanceChartContentProps> = ({
  chartType,
  chartData,
  valueFormatter,
}) => {
  if (chartType === 'line') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="formattedDate" 
            label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            yAxisId="left"
            label={{ value: 'Carbon Footprint (kg CO2e)', angle: -90, position: 'insideLeft' }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            domain={[0, 100]}
            label={{ value: 'Sustainability Score', angle: -90, position: 'insideRight' }}
          />
          <Tooltip formatter={valueFormatter} />
          <Legend />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="carbonFootprint" 
            name="Carbon Footprint" 
            stroke="#f59e0b" 
            activeDot={{ r: 8 }} 
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="sustainabilityScore" 
            name="Sustainability Score" 
            stroke="#3e9847" 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  } 
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="formattedDate" />
        <YAxis />
        <Tooltip formatter={valueFormatter} />
        <Legend />
        <Area 
          type="monotone" 
          dataKey="carbonFootprint" 
          name="Carbon Footprint" 
          stroke="#f59e0b" 
          fill="#f59e0b" 
          fillOpacity={0.3} 
        />
        <Area 
          type="monotone" 
          dataKey="sustainabilityScore" 
          name="Sustainability Score" 
          stroke="#3e9847" 
          fill="#3e9847" 
          fillOpacity={0.3} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
