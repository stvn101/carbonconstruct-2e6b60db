import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, ResponsiveContainer, Cell, RadialBarChart, RadialBar, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { MaterialAnalysisResult } from "@/lib/materialCategories";
import { Loader } from "lucide-react";

interface SustainabilityImpactChartProps {
  data: MaterialAnalysisResult | null;
  chartType?: 'pie' | 'bar' | 'radar';
  className?: string;
}

const SustainabilityImpactChart: React.FC<SustainabilityImpactChartProps> = ({
  data,
  chartType = 'pie',
  className
}) => {
  const COLORS = ['#3e9847', '#5eb761', '#84c98c', '#aadcb0', '#d0eed3'];
  const RADIAN = Math.PI / 180;
  
  const isLoading = !data;
  
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Loading Sustainability Impact...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          <Loader className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }
  
  const pieData = [
    { name: 'Sustainable', value: data.sustainabilityPercentage },
    { name: 'Conventional', value: 100 - (data.sustainabilityPercentage || 0) }
  ];
  
  const radarData = [
    { name: 'Sustainability', value: data.sustainabilityScore || 0, fullMark: 100 },
    { name: 'Recyclability', value: (data.sustainabilityPercentage || 0) * 0.8, fullMark: 100 },
    { name: 'Efficiency', value: data.sustainabilityScore ? data.sustainabilityScore * 0.9 : 0, fullMark: 100 },
    { name: 'Compliance', value: data.sustainabilityScore ? data.sustainabilityScore * 1.1 : 0, fullMark: 100 }
  ];
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const renderBarChart = () => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sustainability Impact</CardTitle>
        <CardDescription>Comparison of sustainability metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.highImpactMaterials}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="carbonFootprint" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
  
  const renderPieChart = () => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sustainability Score</CardTitle>
        <CardDescription>Percentage of sustainable vs conventional materials</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
  
  const renderRadarChart = () => (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sustainability Radar</CardTitle>
        <CardDescription>Overview of sustainability metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={radarData} startAngle={90} endAngle={-270}>
            <RadialBar 
              label={{ position: 'right', fill: '#666' }}
              background
              dataKey="value" 
              fill="#8884d8" 
            />
            <Tooltip />
          </RadialBarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
  
  if (!data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No sustainability data available to display.</p>
        </CardContent>
      </Card>
    );
  }
  
  switch (chartType) {
    case 'bar':
      return renderBarChart();
    case 'radar':
      return renderRadarChart();
    case 'pie':
    default:
      return renderPieChart();
  }
};

export default SustainabilityImpactChart;
