
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MaterialPerformanceEmptyProps {
  className?: string;
}

export const MaterialPerformanceEmpty: React.FC<MaterialPerformanceEmptyProps> = ({ 
  className = "" 
}) => {
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
};
