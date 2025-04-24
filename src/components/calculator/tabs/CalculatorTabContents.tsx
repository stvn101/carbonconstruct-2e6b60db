
import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
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
  demoMode = false
}: CalculatorTabContentsProps) => {
  const [activeTabValue, setActiveTabValue] = useState<string>("materials");

  const handleTabChange = (value: string) => {
    setActiveTabValue(value);
    
    if (value === "materials" || value === "transport" && activeTabValue === "energy") {
      onPrev();
    } else if (value === "energy" || value === "results") {
      onNext();
    }
  };

  return (
    <Tabs value={activeTabValue} onValueChange={handleTabChange}>
      <MaterialsTabContent 
        materials={calculationInput.materials}
        onUpdateMaterial={onUpdateMaterial}
        onAddMaterial={onAddMaterial}
        onRemoveMaterial={onRemoveMaterial}
        onNext={onNext}
        demoMode={demoMode}
      />
      
      <TransportTabContent 
        transportItems={calculationInput.transport}
        onUpdateTransport={onUpdateTransport}
        onAddTransport={onAddTransport}
        onRemoveTransport={onRemoveTransport}
        onNext={onNext}
        onPrev={onPrev}
        demoMode={demoMode}
      />
      
      <EnergyTabContent 
        energyItems={calculationInput.energy}
        onUpdateEnergy={onUpdateEnergy}
        onAddEnergy={onAddEnergy}
        onRemoveEnergy={onRemoveEnergy}
        onCalculate={onNext}
        onPrev={onPrev}
        demoMode={demoMode}
      />
      
      <ResultsTabContent 
        calculationResult={calculationResult}
        materials={calculationInput.materials}
        transport={calculationInput.transport}
        energy={calculationInput.energy}
        onCalculate={onCalculate}
        onPrev={onPrev}
        demoMode={demoMode}
      />
    </Tabs>
  );
};

export default CalculatorTabContents;
