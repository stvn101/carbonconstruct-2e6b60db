
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import MaterialsInputSection from "@/components/calculator/MaterialsInputSection";
import TransportInputSection from "@/components/calculator/TransportInputSection";
import EnergyInputSection from "@/components/calculator/EnergyInputSection";
import ResultsSection from "@/components/calculator/ResultsSection";

interface ProjectCalculatorTabProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  onUpdateMaterial: (index: number, field: string, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (index: number) => void;
  onUpdateTransport: (index: number, field: string, value: string | number) => void;
  onAddTransport: () => void;
  onRemoveTransport: (index: number) => void;
  onUpdateEnergy: (index: number, field: string, value: string | number) => void;
  onAddEnergy: () => void;
  onRemoveEnergy: (index: number) => void;
  onCalculate: () => void;
  onNextTab: () => void;
  onPrevTab: () => void;
}

const ProjectCalculatorTab: React.FC<ProjectCalculatorTabProps> = ({
  calculationInput,
  calculationResult,
  onUpdateMaterial,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onUpdateEnergy,
  onAddEnergy,
  onRemoveEnergy,
  onCalculate,
  onNextTab,
  onPrevTab
}) => {
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
              onUpdateMaterial={onUpdateMaterial}
              onAddMaterial={onAddMaterial}
              onRemoveMaterial={onRemoveMaterial}
              onNext={onNextTab}
            />
          </TabsContent>
          
          <TabsContent value="transport">
            <TransportInputSection 
              transportItems={calculationInput.transport}
              onUpdateTransport={onUpdateTransport}
              onAddTransport={onAddTransport}
              onRemoveTransport={onRemoveTransport}
              onNext={onNextTab}
              onPrev={onPrevTab}
            />
          </TabsContent>
          
          <TabsContent value="energy">
            <EnergyInputSection 
              energyItems={calculationInput.energy}
              onUpdateEnergy={onUpdateEnergy}
              onAddEnergy={onAddEnergy}
              onRemoveEnergy={onRemoveEnergy}
              onCalculate={onNextTab}
              onPrev={onPrevTab}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsSection 
              calculationResult={calculationResult}
              materials={calculationInput.materials}
              transport={calculationInput.transport}
              energy={calculationInput.energy}
              onCalculate={onCalculate}
              onPrev={onPrevTab}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProjectCalculatorTab;
