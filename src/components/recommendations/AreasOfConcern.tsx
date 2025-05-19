
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CalculationResult } from "@/lib/carbonExports";

interface AreasOfConcernProps {
  calculationResult: CalculationResult;
}

export const AreasOfConcern: React.FC<AreasOfConcernProps> = ({ calculationResult }) => {
  // Determine major areas of concern from the calculation result
  const concerns = React.useMemo(() => {
    const concerns = [];
    
    // Check if materials contribute significantly to emissions
    if (calculationResult.materialEmissions >= calculationResult.totalEmissions * 0.4) {
      concerns.push({
        area: "Materials",
        percentage: Math.round((calculationResult.materialEmissions / calculationResult.totalEmissions) * 100),
        description: "Material selection has a major impact on your carbon footprint",
        severity: "high"
      });
    } 
    else if (calculationResult.materialEmissions >= calculationResult.totalEmissions * 0.3) {
      concerns.push({
        area: "Materials",
        percentage: Math.round((calculationResult.materialEmissions / calculationResult.totalEmissions) * 100),
        description: "Consider lower-carbon alternatives for your materials",
        severity: "medium"
      });
    }

    // Check if transport contributes significantly to emissions
    if (calculationResult.transportEmissions >= calculationResult.totalEmissions * 0.3) {
      concerns.push({
        area: "Transport",
        percentage: Math.round((calculationResult.transportEmissions / calculationResult.totalEmissions) * 100),
        description: "Transportation significantly impacts your carbon footprint",
        severity: "high"
      });
    }
    else if (calculationResult.transportEmissions >= calculationResult.totalEmissions * 0.2) {
      concerns.push({
        area: "Transport",
        percentage: Math.round((calculationResult.transportEmissions / calculationResult.totalEmissions) * 100),
        description: "Consider optimizing transportation methods and distances",
        severity: "medium"
      });
    }
    
    // Check if energy contributes significantly to emissions
    if (calculationResult.energyEmissions >= calculationResult.totalEmissions * 0.3) {
      concerns.push({
        area: "Energy",
        percentage: Math.round((calculationResult.energyEmissions / calculationResult.totalEmissions) * 100),
        description: "Energy usage is a major contributor to your emissions",
        severity: "high" 
      });
    }
    else if (calculationResult.energyEmissions >= calculationResult.totalEmissions * 0.2) {
      concerns.push({
        area: "Energy",
        percentage: Math.round((calculationResult.energyEmissions / calculationResult.totalEmissions) * 100),
        description: "Consider using renewable energy sources",
        severity: "medium"
      });
    }
    
    // Sort by severity and then by percentage
    return concerns.sort((a, b) => {
      if (a.severity === b.severity) {
        return b.percentage - a.percentage;
      }
      return a.severity === "high" ? -1 : 1;
    });
    
  }, [calculationResult]);
  
  if (!concerns.length) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl text-carbon-800 dark:text-carbon-100">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
          Areas of Concern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {concerns.map((concern, index) => (
            <div 
              key={index}
              className={`p-3 border rounded-lg 
                ${concern.severity === 'high' 
                  ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800/50' 
                  : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50'
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium flex items-center">
                  {concern.area}
                  <Badge 
                    className={`ml-2 ${
                      concern.severity === 'high' 
                        ? 'bg-red-500' 
                        : 'bg-amber-500'
                    }`}
                  >
                    {concern.percentage}%
                  </Badge>
                </h3>
                <Badge variant="outline" className={`
                  ${concern.severity === 'high' 
                    ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-400' 
                    : 'border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400'
                  }
                `}>
                  {concern.severity === 'high' ? 'High Impact' : 'Medium Impact'}
                </Badge>
              </div>
              <p className={`text-sm ${
                concern.severity === 'high' 
                  ? 'text-red-700 dark:text-red-400' 
                  : 'text-amber-700 dark:text-amber-400'
                }`}>
                {concern.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
