
import React from "react";
import { Bug } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartEmptyStateProps {
  categoryTitle: string;
  categoryDescription: string;
  category: string;
}

const ChartEmptyState = ({ categoryTitle, categoryDescription, category }: ChartEmptyStateProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{categoryTitle}</CardTitle>
        <CardDescription>{categoryDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex flex-col items-center justify-center text-muted-foreground">
          <Bug className="h-8 w-8 mb-4 text-muted" />
          <p>No {category} emission data available</p>
          <p className="text-sm mt-1">Check your inputs and try recalculating</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartEmptyState;
