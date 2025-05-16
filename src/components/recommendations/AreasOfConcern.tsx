
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult } from "@/lib/carbonCalculations";

interface AreasOfConcernProps {
  calculationResult: CalculationResult;
}

export const AreasOfConcern: React.FC<AreasOfConcernProps> = ({ calculationResult }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl text-carbon-800 dark:text-carbon-100">
          <AlertTriangle className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400" />
          Areas of Concern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {calculationResult.materialEmissions > calculationResult.totalEmissions * 0.7 && (
            <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-gray-800 dark:border-l-amber-600 rounded-r-lg">
              <h4 className="font-medium mb-1 dark:text-carbon-100">High Material Emissions</h4>
              <p className="text-sm dark:text-carbon-300">
                Your project's material emissions account for over 70% of your total carbon footprint.
                Consider low-carbon Australian alternatives to significantly reduce your impact.
              </p>
            </div>
          )}
          
          {calculationResult.transportEmissions > calculationResult.totalEmissions * 0.3 && (
            <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-gray-800 dark:border-l-amber-600 rounded-r-lg">
              <h4 className="font-medium mb-1 dark:text-carbon-100">High Transport Emissions</h4>
              <p className="text-sm dark:text-carbon-300">
                Your transport emissions are unusually high. Consider sourcing materials locally in Australia
                to minimize shipping distances and associated carbon emissions.
              </p>
            </div>
          )}
          
          {calculationResult.energyEmissions > calculationResult.totalEmissions * 0.25 && (
            <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-gray-800 dark:border-l-amber-600 rounded-r-lg">
              <h4 className="font-medium mb-1 dark:text-carbon-100">High Energy Emissions</h4>
              <p className="text-sm dark:text-carbon-300">
                Your energy use contributes significantly to your carbon footprint. Australia has abundant
                renewable energy options - consider solar power for your construction site.
              </p>
            </div>
          )}
          
          {calculationResult.totalEmissions > 10000 && (
            <div className="p-3 border-l-4 border-l-amber-500 bg-amber-50 dark:bg-gray-800 dark:border-l-amber-600 rounded-r-lg">
              <h4 className="font-medium mb-1 dark:text-carbon-100">High Overall Emissions</h4>
              <p className="text-sm dark:text-carbon-300">
                Your project's total emissions exceed 10,000 kg CO2e, which may impact compliance with
                Australian building sustainability standards. Consider a holistic redesign approach.
              </p>
            </div>
          )}
          
          {calculationResult.materialEmissions <= calculationResult.totalEmissions * 0.7 &&
           calculationResult.transportEmissions <= calculationResult.totalEmissions * 0.3 &&
           calculationResult.energyEmissions <= calculationResult.totalEmissions * 0.25 &&
           calculationResult.totalEmissions <= 10000 && (
            <div className="p-3 border-l-4 border-l-green-500 bg-green-50 dark:bg-gray-800 dark:border-l-green-600 rounded-r-lg">
              <h4 className="font-medium mb-1 dark:text-carbon-100">Good Carbon Performance</h4>
              <p className="text-sm dark:text-carbon-300">
                Your project is performing well on key carbon metrics. Continue to monitor and look for
                additional improvements as new materials and technologies become available in Australia.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
