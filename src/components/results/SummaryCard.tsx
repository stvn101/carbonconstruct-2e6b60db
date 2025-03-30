
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Leaf, AlertTriangle } from "lucide-react";
import { CalculationResult } from "@/lib/carbonCalculations";

interface SummaryCardProps {
  result: CalculationResult;
}

const SummaryCard = ({ result }: SummaryCardProps) => {
  // Calculate emission intensity category
  let intensityCategory = 'moderate';
  const emissionsPerUnit = result.totalEmissions;
  
  if (emissionsPerUnit < 100) {
    intensityCategory = 'low';
  } else if (emissionsPerUnit > 500) {
    intensityCategory = 'high';
  }

  return (
    <Card className="border-carbon-200">
      <CardHeader>
        <CardTitle>Total Carbon Footprint</CardTitle>
        <CardDescription>
          The overall environmental impact of your project
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-5xl font-bold text-carbon-600">
            {result.totalEmissions.toFixed(2)}
          </span>
          <span className="text-lg ml-2">kg CO2e</span>
        </div>
        
        <Alert className={
          intensityCategory === 'low' 
            ? "border-carbon-500 bg-carbon-50 text-carbon-800" 
            : intensityCategory === 'high'
              ? "border-red-500 bg-red-50 text-red-800"
              : "border-yellow-500 bg-yellow-50 text-yellow-800"
        }>
          <div className="flex items-center gap-2">
            {intensityCategory === 'low' ? (
              <Leaf className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertTitle className="font-medium">
              {intensityCategory === 'low' 
                ? 'Low Carbon Intensity' 
                : intensityCategory === 'high'
                  ? 'High Carbon Intensity'
                  : 'Moderate Carbon Intensity'
              }
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm">
            {intensityCategory === 'low' 
              ? 'Great job! Your project has relatively low carbon emissions. Continue these sustainable practices in future projects.'
              : intensityCategory === 'high'
                ? 'Your project has a significant carbon footprint. Consider implementing the suggested improvements to reduce emissions.'
                : 'Your project has a moderate carbon footprint. There is room for improvement - check the suggestions below.'
            }
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
