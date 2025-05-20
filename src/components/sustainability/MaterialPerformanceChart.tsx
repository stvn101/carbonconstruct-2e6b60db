
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area } from "recharts";
import { SustainabilityTrendData } from "@/services/sustainability/sustainabilityApiService";
import { formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MaterialPerformanceChartProps {
  trendData?: SustainabilityTrendData | null;
  isLoading?: boolean;
  className?: string;
  chartType?: 'line' | 'area';
}

const MaterialPerformanceChart: React.FC<MaterialPerformanceChartProps> = ({
  trendData,
  isLoading = false,
  className = "",
  chartType = "line"
}) => {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Performance Trends</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="animate-pulse w-full h-40 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  if (!trendData || !trendData.dataPoints || trendData.dataPoints.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Material Performance Trends</CardTitle>
          <CardDescription>Track material performance over time</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No performance data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Format date for display
  const chartData = trendData.dataPoints.map(point => ({
    ...point,
    formattedDate: formatDate(new Date(point.timestamp))
  }));

  // Show improvement indicator
  const showImprovement = trendData.improvement !== 0;
  const isImproving = trendData.improvement > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{trendData.materialName} Performance</CardTitle>
          {showImprovement && (
            <Badge 
              variant={isImproving ? "default" : "destructive"}
              className="flex items-center gap-1"
            >
              {isImproving ? 
                <ArrowDownIcon className="h-3 w-3" /> : 
                <ArrowUpIcon className="h-3 w-3" />
              }
              {Math.abs(trendData.improvement).toFixed(1)}% {isImproving ? "Reduction" : "Increase"}
            </Badge>
          )}
        </div>
        <CardDescription>
          Carbon footprint and sustainability score over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
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
              <Tooltip />
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
          ) : (
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="formattedDate" />
              <YAxis />
              <Tooltip />
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
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default MaterialPerformanceChart;
