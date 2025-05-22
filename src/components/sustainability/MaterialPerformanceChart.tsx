
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SustainabilityTrendData } from "@/services/sustainability/sustainabilityApiService";
import { MaterialPerformanceLoading } from "./performance/MaterialPerformanceLoading";
import { MaterialPerformanceEmpty } from "./performance/MaterialPerformanceEmpty";
import { MaterialPerformanceChartContent } from "./performance/MaterialPerformanceChartContent";
import { ImprovementBadge } from "./performance/ImprovementBadge";
import { prepareChartData, getImprovementDetails } from "./performance/chartConfig";

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
  // Show loading state
  if (isLoading) {
    return <MaterialPerformanceLoading className={className} />;
  }

  // Show empty state if no data
  if (!trendData || !trendData.dataPoints || trendData.dataPoints.length === 0) {
    return <MaterialPerformanceEmpty className={className} />;
  }

  // Prepare chart data
  const chartData = prepareChartData(trendData);
  
  // Calculate improvement metrics for display
  const { showImprovement, isImproving, value } = getImprovementDetails(trendData.improvement);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{trendData.materialName} Performance</CardTitle>
          {showImprovement && (
            <ImprovementBadge isImproving={isImproving} value={value} />
          )}
        </div>
        <CardDescription>
          Carbon footprint and sustainability score over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <MaterialPerformanceChartContent 
          chartType={chartType} 
          chartData={chartData} 
        />
      </CardContent>
    </Card>
  );
};

export default MaterialPerformanceChart;
