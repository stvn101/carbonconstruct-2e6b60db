
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MaterialsInputSection from "../MaterialsInputSection";
import TransportInputSection from "../TransportInputSection";
import EnergyInputSection from "../EnergyInputSection";
import ResultsSection from "../ResultsSection";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { useEffect, useState } from "react";

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
  const [activeTabValue, setActiveTabValue] = useState<string>("materials");

  // Function to safely handle navigation between tabs
  const handleNextTab = () => {
    try {
      console.log(`Navigating from ${activeTabValue} to next tab`);
      if (activeTabValue === "materials") {
        setActiveTabValue("transport");
      } else if (activeTabValue === "transport") {
        setActiveTabValue("energy");
      } else if (activeTabValue === "energy") {
        setActiveTabValue("results");
      }
      
      // Call the parent's onNextTab function to sync state
      onNextTab();
    } catch (error) {
      console.error("Error navigating to next tab:", error);
    }
  };

  const handlePrevTab = () => {
    try {
      console.log(`Navigating from ${activeTabValue} to previous tab`);
      if (activeTabValue === "transport") {
        setActiveTabValue("materials");
      } else if (activeTabValue === "energy") {
        setActiveTabValue("transport");
      } else if (activeTabValue === "results") {
        setActiveTabValue("energy");
      }
      
      // Call the parent's onPrevTab function to sync state
      onPrevTab();
    } catch (error) {
      console.error("Error navigating to previous tab:", error);
    }
  };

  return (
    <Tabs value={activeTabValue} onValueChange={setActiveTabValue}>
      <TabsContent value="materials">
        <MaterialsInputSection 
          materials={calculationInput.materials}
          onUpdateMaterial={onUpdateMaterial}
          onAddMaterial={onAddMaterial}
          onRemoveMaterial={onRemoveMaterial}
          onNext={handleNextTab}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="transport">
        <TransportInputSection 
          transportItems={calculationInput.transport}
          onUpdateTransport={onUpdateTransport}
          onAddTransport={onAddTransport}
          onRemoveTransport={onRemoveTransport}
          onNext={handleNextTab}
          onPrev={handlePrevTab}
          demoMode={demoMode}
        />
      </TabsContent>
      
      <TabsContent value="energy">
        <EnergyInputSection 
          energyItems={calculationInput.energy}
          onUpdateEnergy={onUpdateEnergy}
          onAddEnergy={onAddEnergy}
          onRemoveEnergy={onRemoveEnergy}
          onCalculate={handleNextTab}
          onPrev={handlePrevTab}
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
          onPrev={handlePrevTab}
          demoMode={demoMode}
        />
      </TabsContent>
    </Tabs>
  );
};

export default CalculatorTabContents;
