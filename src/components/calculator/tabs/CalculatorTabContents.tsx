
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MaterialsTabContent from "./content/MaterialsTabContent";
import TransportTabContent from "./content/TransportTabContent";
import EnergyTabContent from "./content/EnergyTabContent";
import ResultsTabContent from "./content/ResultsTabContent";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";

export interface CalculatorTabContentsProps {
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
  onPrev: () => void;
  onNext: () => void;
  demoMode?: boolean;
  activeTab: string;
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
  onPrev,
  onNext,
  demoMode = false,
  activeTab
}: CalculatorTabContentsProps) => {
  return (
    <Tabs value={activeTab} className="w-full mt-4">
      <TabsContent value="materials" className="mt-6">
        <MaterialsTabContent 
          materials={calculationInput.materials}
          onUpdateMaterial={onUpdateMaterial}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
          onNext={onNext}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="transport" className="mt-6">
        <TransportTabContent 
          transportItems={calculationInput.transport}
          onUpdateTransport={onUpdateTransport}
          onAddTransport={onAddTransport}
          onRemoveTransport={onRemoveTransport}
          onNext={onNext}
          onPrev={onPrev}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="energy" className="mt-6">
        <EnergyTabContent 
          energyItems={calculationInput.energy}
          onUpdateEnergy={onUpdateEnergy}
          onAddEnergy={onAddEnergy}
          onRemoveEnergy={onRemoveEnergy}
          onCalculate={onNext}
          onPrev={onPrev}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="results" className="mt-6">
        <ResultsTabContent 
          calculationResult={calculationResult}
          materials={calculationInput.materials}
          transport={calculationInput.transport}
          energy={calculationInput.energy}
          onCalculate={onCalculate}
          onPrev={onPrev}
          demoMode={demoMode}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CalculatorTabContents;
