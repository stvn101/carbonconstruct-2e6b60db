
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorTabTriggers from "./tabs/CalculatorTabTriggers";
import { CalculatorContextType } from "@/contexts/calculator/types";

interface CalculatorTabsProps {
  calculatorContext: CalculatorContextType;
  onCalculate: () => void;
  onSave: () => void;
  isSaving: boolean;
  isCalculating: boolean;
  demoMode?: boolean;
}

const CalculatorTabs = ({ 
  calculatorContext, 
  onCalculate,
  onSave,
  isSaving,
  isCalculating,
  demoMode = false
}: CalculatorTabsProps) => {
  const { activeTab, setActiveTab } = calculatorContext;
  const isMobile = window.innerWidth < 768; // Simple check for mobile

  // Function to safely handle tab changes
  const handleTabChange = (newTab: string) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(newTab as any);
      console.log(`Tab changed to: ${newTab}`);
    } else {
      console.error("setActiveTab is not a function", setActiveTab);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Tabs 
        value={activeTab} 
        onValueChange={handleTabChange}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 mb-0 flex-grow">
            <CalculatorTabTriggers isMobile={isMobile} isPremiumUser={false} />
          </TabsList>
          
          <Button 
            onClick={onCalculate} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white w-full md:w-auto"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Emissions
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default CalculatorTabs;
