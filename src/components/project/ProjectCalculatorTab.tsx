
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProjectCalculatorTabProps {
  calculationInput?: any;
  calculationResult?: any;
  onCalculate?: () => void;
}

const ProjectCalculatorTab: React.FC<ProjectCalculatorTabProps> = ({
  calculationInput,
  calculationResult,
  onCalculate
}) => {
  // Check if we have valid calculation data
  const hasInputData = calculationInput && 
    (calculationInput.materials?.length > 0 || 
     calculationInput.transport?.length > 0 || 
     calculationInput.energy?.length > 0);

  // Function to format material type for display
  const formatMaterialType = (type: string) => {
    // Convert camelCase to Title Case with spaces
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {hasInputData ? (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Project Calculation Data</h3>
              <p className="text-muted-foreground">
                Review and recalculate the carbon footprint for this project.
              </p>
            </div>
            
            {/* Materials Section */}
            {calculationInput.materials && calculationInput.materials.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Materials</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {calculationInput.materials.map((material: any, index: number) => (
                      <li key={index} className="py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{formatMaterialType(material.type)}</span>
                          <span>{material.quantity} kg</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Transport Section */}
            {calculationInput.transport && calculationInput.transport.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Transport</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {calculationInput.transport.map((transport: any, index: number) => (
                      <li key={index} className="py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{formatMaterialType(transport.type)}</span>
                          <span>{transport.distance} km, {transport.weight} kg</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Energy Section */}
            {calculationInput.energy && calculationInput.energy.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Energy</h4>
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {calculationInput.energy.map((energy: any, index: number) => (
                      <li key={index} className="py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{formatMaterialType(energy.type)}</span>
                          <span>{energy.amount} {energy.unit || 'kWh'}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Result Section */}
            {calculationResult && (
              <div className="mt-6 p-4 bg-carbon-50 dark:bg-carbon-800 rounded-md">
                <h4 className="font-medium mb-2">Calculation Results</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Emissions:</p>
                    <p className="text-lg font-semibold">{Math.round(calculationResult.totalEmissions)} kg CO₂e</p>
                  </div>
                  {calculationResult.materialsEmissions !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Materials Emissions:</p>
                      <p className="text-lg font-semibold">{Math.round(calculationResult.materialsEmissions)} kg CO₂e</p>
                    </div>
                  )}
                  {calculationResult.transportEmissions !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Transport Emissions:</p>
                      <p className="text-lg font-semibold">{Math.round(calculationResult.transportEmissions)} kg CO₂e</p>
                    </div>
                  )}
                  {calculationResult.energyEmissions !== undefined && (
                    <div>
                      <p className="text-sm text-muted-foreground">Energy Emissions:</p>
                      <p className="text-lg font-semibold">{Math.round(calculationResult.energyEmissions)} kg CO₂e</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <Button 
                onClick={onCalculate}
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
                disabled={!onCalculate}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Recalculate Emissions
              </Button>
            </div>
            
            {!calculationResult && (
              <Alert className="mt-4 bg-amber-50 border-amber-200">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  No calculation results available yet. Click the button above to calculate emissions.
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Calculator className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium mb-1">No calculation data</h3>
            <p className="text-muted-foreground mb-4">
              This project doesn't have calculation data or the calculator isn't available.
            </p>
            {onCalculate && (
              <Button 
                onClick={onCalculate}
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Initialize Calculator
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCalculatorTab;
