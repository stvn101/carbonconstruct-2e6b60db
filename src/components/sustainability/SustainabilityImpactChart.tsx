
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { MaterialAnalysisResult } from "supabase/functions/get-sustainability-suggestions/Material";

interface SustainabilityImpactChartProps {
  data: MaterialAnalysisResult | null;
  chartType?: 'bar' | 'radar';
  className?: string;
}

const SustainabilityImpactChart: React.FC<SustainabilityImpactChartProps> = ({ 
  data, 
  chartType = 'bar',
  className
}) => {
  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Sustainability Impact Analysis</CardTitle>
          <CardDescription>Visualization of material impact and improvement potential</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">No sustainability data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Prepare data for visualization
  const chartData = data.highImpactMaterials.map(material => ({
    name: material.name,
    carbonFootprint: material.carbonFootprint,
    quantity: material.quantity || 0
  }));
  
  // Calculate total impact per material (footprint * quantity)
  const impactData = chartData.map(item => ({
    ...item,
    totalImpact: item.carbonFootprint * item.quantity
  })).sort((a, b) => b.totalImpact - a.totalImpact);
  
  // Format for radar chart - normalize values
  const radarData = [];
  if (data.sustainableMaterialPercentage !== undefined) {
    radarData.push({
      subject: "Sustainable Materials",
      value: data.sustainableMaterialPercentage,
      fullMark: 100
    });
  }
  
  if (data.sustainabilityScore !== undefined) {
    radarData.push({
      subject: "Sustainability Score", 
      value: data.sustainabilityScore, 
      fullMark: 100
    });
  }
  
  // Add more metrics if available from the analysis
  if (impactData.length > 0) {
    radarData.push({
      subject: "High Impact Materials",
      value: Math.min(100, (impactData.length / Math.max(chartData.length, 1)) * 100),
      fullMark: 100
    });
  }
  
  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={impactData.slice(0, 5)} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45} 
          textAnchor="end" 
          height={60} 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          label={{ value: 'CO2e Impact', angle: -90, position: 'insideLeft' }} 
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(2)} kg CO2e`, "Carbon Impact"]}
          labelFormatter={(label) => `Material: ${label}`}
        />
        <Legend />
        <Bar dataKey="totalImpact" name="Carbon Impact" fill="#3e9847" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart outerRadius={90} data={radarData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar 
          name="Sustainability Metrics" 
          dataKey="value" 
          stroke="#3e9847" 
          fill="#3e9847" 
          fillOpacity={0.6} 
        />
        <Legend />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sustainability Impact Analysis</CardTitle>
        <CardDescription>
          {chartType === 'bar' 
            ? 'Carbon impact of your top materials' 
            : 'Overall sustainability metrics'}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        {chartType === 'bar' ? renderBarChart() : renderRadarChart()}
      </CardContent>
    </Card>
  );
};

export default SustainabilityImpactChart;
