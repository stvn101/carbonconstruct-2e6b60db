import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { CalculationResult } from "@/lib/carbonExports";

interface AreasOfConcernProps {
  calculationResult: CalculationResult;
}

export const AreasOfConcern: React.FC<AreasOfConcernProps> = ({ calculationResult }) => {
  // For now, we'll keep this simple
  const highCarbonAreas = [];
  
  // Check for high material emissions
  if ((calculationResult.materialEmissions || 0) > 5000) {
    highCarbonAreas.push({
      title: "High Material Emissions",
      description: "Your material emissions are significantly high. Consider alternative materials with lower carbon footprints."
    });
  }
  
  // Check for high transport emissions
  if ((calculationResult.transportEmissions || 0) > 2000) {
    highCarbonAreas.push({
      title: "High Transport Emissions",
      description: "Your transport emissions could be reduced. Source materials locally or use lower-carbon transport methods."
    });
  }
  
  // Check for high energy emissions
  if ((calculationResult.energyEmissions || 0) > 3000) {
    highCarbonAreas.push({
      title: "High Energy Consumption",
      description: "Energy usage on your project is a concern. Consider renewable alternatives and more efficient equipment."
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          Areas of Concern
        </CardTitle>
      </CardHeader>
      <CardContent>
        {highCarbonAreas.length > 0 ? (
          <div className="space-y-4">
            {highCarbonAreas.map((area, index) => (
              <div 
                key={index} 
                className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800"
              >
                <h3 className="font-medium text-amber-800 dark:text-amber-400 mb-1">{area.title}</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">{area.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <p>No significant areas of concern detected in your current data.</p>
            <p className="text-sm mt-2">This is a positive sign, but continue monitoring as your project progresses.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
