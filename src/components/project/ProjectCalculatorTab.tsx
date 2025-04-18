
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { useCalculator } from "@/contexts/calculator";
import MaterialsInputSection from "@/components/calculator/MaterialsInputSection";
import TransportInputSection from "@/components/calculator/TransportInputSection";
import EnergyInputSection from "@/components/calculator/EnergyInputSection";
import ResultsSection from "@/components/calculator/ResultsSection";

interface ProjectCalculatorTabProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  onCalculate: () => void;
}

const ProjectCalculatorTab: React.FC<ProjectCalculatorTabProps> = ({
  calculationInput,
  calculationResult,
  onCalculate
}) => {
  const {
    setCalculationInput,
    setCalculationResult,
    handleUpdateMaterial,
    handleAddMaterial,
    handleRemoveMaterial,
    handleUpdateTransport,
    handleAddTransport,
    handleRemoveTransport,
    handleUpdateEnergy,
    handleAddEnergy,
    handleRemoveEnergy,
    handleNextTab,
    handlePrevTab
  } = useCalculator();

  // Initialize the calculator with the project data
  useEffect(() => {
    setCalculationInput(calculationInput);
    setCalculationResult(calculationResult);
  }, [calculationInput, calculationResult, setCalculationInput, setCalculationResult]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carbon Calculator</CardTitle>
        <CardDescription>
          Modify the project details and recalculate the carbon footprint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="materials">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="transport">Transport</TabsTrigger>
            <TabsTrigger value="energy">Energy</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>
          
          <TabsContent value="materials">
            <MaterialsInputSection 
              materials={calculationInput.materials}
              onUpdateMaterial={handleUpdateMaterial}
              onAddMaterial={handleAddMaterial}
              onRemoveMaterial={handleRemoveMaterial}
              onNext={handleNextTab}
            />
          </TabsContent>
          
          <TabsContent value="transport">
            <TransportInputSection 
              transportItems={calculationInput.transport}
              onUpdateTransport={handleUpdateTransport}
              onAddTransport={handleAddTransport}
              onRemoveTransport={handleRemoveTransport}
              onNext={handleNextTab}
              onPrev={handlePrevTab}
            />
          </TabsContent>
          
          <TabsContent value="energy">
            <EnergyInputSection 
              energyItems={calculationInput.energy}
              onUpdateEnergy={handleUpdateEnergy}
              onAddEnergy={handleAddEnergy}
              onRemoveEnergy={handleRemoveEnergy}
              onCalculate={handleNextTab}
              onPrev={handlePrevTab}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsSection 
              calculationResult={calculationResult}
              materials={calculationInput.materials}
              transport={calculationInput.transport}
              energy={calculationInput.energy}
              onCalculate={onCalculate}
              onPrev={handlePrevTab}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectCalculatorTab;
