
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
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
    console.log(`Tab changed to: ${value}`);
    setActiveTabValue(value);
  };

  // Ensure parent component is notified when tabs change
  useEffect(() => {
    console.log(`Tab state updated: ${activeTabValue}`);
  }, [activeTabValue]);

  // Custom navigation functions to ensure proper tab flow
  const handleNext = () => {
    console.log("Next button clicked, current tab:", activeTabValue);
    if (typeof onNext === "function") {
      onNext();
    }
    
    if (activeTabValue === "materials") {
      setActiveTabValue("transport");
      console.log("Moving to transport tab");
    } else if (activeTabValue === "transport") {
      setActiveTabValue("energy");
      console.log("Moving to energy tab");
    } else if (activeTabValue === "energy") {
      setActiveTabValue("results");
      console.log("Moving to results tab");
      if (typeof onCalculate === "function") {
        onCalculate();
      }
    }
  };

  const handlePrev = () => {
    console.log("Previous button clicked, current tab:", activeTabValue);
    if (typeof onPrev === "function") {
      onPrev();
    }
    
    if (activeTabValue === "transport") {
      setActiveTabValue("materials");
      console.log("Moving back to materials tab");
    } else if (activeTabValue === "energy") {
      setActiveTabValue("transport");
      console.log("Moving back to transport tab");
    } else if (activeTabValue === "results") {
      setActiveTabValue("energy");
      console.log("Moving back to energy tab");
    }
  };

  // Debug logging
  console.log("CalculatorTabContents rendering with activeTab:", activeTabValue);
  console.log("Has materials:", calculationInput.materials?.length);
  console.log("Has transport:", calculationInput.transport?.length);
  console.log("Has energy:", calculationInput.energy?.length);

  return (
    <Tabs value={activeTabValue} onValueChange={handleTabChange} className="w-full">
      <TabsContent value="materials" className="mt-6">
        <MaterialsTabContent 
          materials={calculationInput.materials}
          onUpdateMaterial={onUpdateMaterial}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
          onNext={handleNext}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="transport" className="mt-6">
        <TransportTabContent 
          transportItems={calculationInput.transport}
          onUpdateTransport={onUpdateTransport}
          onAddTransport={onAddTransport}
          onRemoveTransport={onRemoveTransport}
          onNext={handleNext}
          onPrev={handlePrev}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="energy" className="mt-6">
        <EnergyTabContent 
          energyItems={calculationInput.energy}
          onUpdateEnergy={onUpdateEnergy}
          onAddEnergy={onAddEnergy}
          onRemoveEnergy={onRemoveEnergy}
          onCalculate={handleNext}
          onPrev={handlePrev}
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
          onPrev={handlePrev}
          demoMode={demoMode}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CalculatorTabContents;
