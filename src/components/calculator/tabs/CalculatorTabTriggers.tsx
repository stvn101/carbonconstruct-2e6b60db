
import React from "react";
import { TabsTrigger } from "@/components/ui/tabs";
import { Building2, Gauge, Truck, Zap } from "lucide-react";
import { useCalculator } from "@/contexts/calculator";

export interface CalculatorTabTriggersProps {
  isMobile?: boolean;
}

const CalculatorTabTriggers = ({ isMobile = false }: CalculatorTabTriggersProps) => {
  const { activeTab, setActiveTab } = useCalculator();
  
  console.log("CalculatorTabTriggers rendering with activeTab:", activeTab);
  
  const handleTabClick = (tab: string) => {
    console.log(`Tab clicked: ${tab}`);
    setActiveTab(tab as any);
  };
  
  return (
    <>
      <TabsTrigger 
        value="materials" 
        className="relative"
        onClick={() => handleTabClick("materials")}
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
        onClick={() => handleTabClick("transport")}
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
        onClick={() => handleTabClick("energy")}
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
        onClick={() => handleTabClick("results")}
      >
        <Gauge className={`h-4 w-4 ${isMobile ? "" : "mr-2"}`} />
        {!isMobile && <span>Results</span>}
        {activeTab === "results" && (
          <span className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-green-500" />
        )}
      </TabsTrigger>
    </>
  );
};

export default CalculatorTabTriggers;
