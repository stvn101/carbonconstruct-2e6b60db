
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MaterialPerformanceLoadingProps {
  className?: string;
}

export const MaterialPerformanceLoading: React.FC<MaterialPerformanceLoadingProps> = ({ 
  className = "" 
}) => {
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
};
