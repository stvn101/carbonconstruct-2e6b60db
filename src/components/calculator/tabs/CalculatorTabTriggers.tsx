
import React, { useCallback, memo } from "react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Building2, Gauge, Truck, Zap } from "lucide-react";

export interface CalculatorTabTriggersProps {
  isMobile?: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// Use memo to prevent unnecessary re-renders
const CalculatorTabTriggers = memo(({ isMobile = false, activeTab, onTabChange }: CalculatorTabTriggersProps) => {
  // Use a callback handler that only triggers when the user clicks
  const handleTabClick = useCallback((tab: string) => {
    // Only update if the tab is different than the current one
    if (tab !== activeTab) {
      onTabChange(tab);
    }
  }, [activeTab, onTabChange]);
  
  // Create individual handlers for each tab to avoid recreating functions on each render
  const handleMaterialsClick = useCallback(() => handleTabClick("materials"), [handleTabClick]);
  const handleTransportClick = useCallback(() => handleTabClick("transport"), [handleTabClick]);
  const handleEnergyClick = useCallback(() => handleTabClick("energy"), [handleTabClick]);
  const handleResultsClick = useCallback(() => handleTabClick("results"), [handleTabClick]);
  
  return (
    <>
      <TabsTrigger 
        value="materials" 
        className="relative"
        onClick={handleMaterialsClick}
      >
        <Building2 className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
        {!isMobile && <span>Materials</span>}
        {activeTab === "materials" && (
          <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-green-500" />
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="transport" 
        className="relative"
        onClick={handleTransportClick}
      >
        <Truck className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
        {!isMobile && <span>Transport</span>}
        {activeTab === "transport" && (
          <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-green-500" />
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="energy" 
        className="relative"
        onClick={handleEnergyClick}
      >
        <Zap className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
        {!isMobile && <span>Energy</span>}
        {activeTab === "energy" && (
          <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-green-500" />
        )}
      </TabsTrigger>
      
      <TabsTrigger 
        value="results" 
        className="relative"
        onClick={handleResultsClick}
      >
        <Gauge className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
        {!isMobile && <span>Results</span>}
        {activeTab === "results" && (
          <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-green-500" />
        )}
      </TabsTrigger>
    </>
  );
});

// Explicitly set display name for debugging purposes
CalculatorTabTriggers.displayName = 'CalculatorTabTriggers';

export default CalculatorTabTriggers;
