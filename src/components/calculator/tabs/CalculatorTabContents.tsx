
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MaterialsInputSection from "../MaterialsInputSection";
import TransportInputSection from "../TransportInputSection";
import EnergyInputSection from "../EnergyInputSection";
import ResultsSection from "../ResultsSection";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";

interface CalculatorTabContentsProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
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
  onPrevTab: () => void;
  onNextTab: () => void;
  demoMode?: boolean;
}

const CalculatorTabContents = ({
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
  onPrevTab,
  onNextTab,
  demoMode = false
}: CalculatorTabContentsProps) => {
  return (
    <Tabs defaultValue="materials">
      <TabsContent value="materials">
        <MaterialsInputSection 
          materials={calculationInput.materials}
          onUpdateMaterial={onUpdateMaterial}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
          onNext={onNextTab}
          demoMode={demoMode}
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
          demoMode={demoMode}
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
          demoMode={demoMode}
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
          demoMode={demoMode}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CalculatorTabContents;
