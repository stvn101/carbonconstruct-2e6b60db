
import { Tabs, TabsContent } from "@/components/ui/tabs";
import MaterialsInputSection from "../MaterialsInputSection";
import TransportInputSection from "../TransportInputSection";
import EnergyInputSection from "../EnergyInputSection";
import ResultsSection from "../ResultsSection";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { useEffect, useState } from "react";
import ErrorTrackingService from "@/services/error/errorTrackingService";

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

  // Sync with parent component's active tab value
  useEffect(() => {
    const synchTabWithParent = () => {
      const childTabs = document.querySelectorAll('[role="tab"]');
      const activeChildTab = document.querySelector('[role="tab"][aria-selected="true"]');
      
      if (activeChildTab) {
        const tabValue = activeChildTab.getAttribute('data-value') || "materials";
        if (tabValue !== activeTabValue) {
          console.log(`Syncing tab value from DOM: ${tabValue}`);
          setActiveTabValue(tabValue);
        }
      }
    };

    // Run on mount and after any tab change
    synchTabWithParent();
    
    // Setup mutation observer to detect tab changes
    const observer = new MutationObserver(synchTabWithParent);
    observer.observe(document.body, { 
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-selected']
    });
    
    return () => observer.disconnect();
  }, [activeTabValue]);

  // Function to safely handle navigation between tabs
  const handleNextTab = () => {
    try {
      console.log(`Navigating from ${activeTabValue} to next tab`);
      let nextTab;
      
      if (activeTabValue === "materials") {
        nextTab = "transport";
      } else if (activeTabValue === "transport") {
        nextTab = "energy";
      } else if (activeTabValue === "energy") {
        nextTab = "results";
      } else {
        nextTab = activeTabValue; // Keep current if unknown
      }
      
      setActiveTabValue(nextTab);
      
      // Call the parent's onNextTab function to sync state
      onNextTab();
    } catch (error) {
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'CalculatorTabContents', action: 'nextTab' }
      );
      console.error("Error navigating to next tab:", error);
    }
  };

  const handlePrevTab = () => {
    try {
      console.log(`Navigating from ${activeTabValue} to previous tab`);
      let prevTab;
      
      if (activeTabValue === "transport") {
        prevTab = "materials";
      } else if (activeTabValue === "energy") {
        prevTab = "transport";
      } else if (activeTabValue === "results") {
        prevTab = "energy";
      } else {
        prevTab = activeTabValue; // Keep current if unknown
      }
      
      setActiveTabValue(prevTab);
      
      // Call the parent's onPrevTab function to sync state
      onPrevTab();
    } catch (error) {
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'CalculatorTabContents', action: 'prevTab' }
      );
      console.error("Error navigating to previous tab:", error);
    }
  };

  // Handle tab change initiated from tab buttons
  const handleTabChange = (value: string) => {
    console.log(`Tab value changed to: ${value}`);
    setActiveTabValue(value);
    
    // Notify parent component about tab change for sync
    if (value === "materials" || activeTabValue === "transport") {
      onPrevTab();
    } else {
      onNextTab();
    }
  };

  return (
    <Tabs value={activeTabValue} onValueChange={handleTabChange}>
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
