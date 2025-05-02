
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Calculator, Save, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorTabTriggers from "./tabs/CalculatorTabTriggers";
import { CalculatorContextType } from "@/contexts/calculator/types";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CalculatorTabsProps {
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
  const { isMobile } = useIsMobile();

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
            <CalculatorTabTriggers isMobile={isMobile} />
          </TabsList>
          
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={onCalculate} 
              disabled={isCalculating}
              className="bg-carbon-600 hover:bg-carbon-700 text-white flex-1 md:flex-grow-0"
            >
              {isCalculating ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate Emissions
                </>
              )}
            </Button>
            
            {!demoMode && (
              <Button 
                onClick={onSave} 
                disabled={isSaving || isCalculating}
                variant="outline" 
                className="flex-1 md:flex-grow-0 border-carbon-600 text-carbon-600 hover:bg-carbon-50"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default CalculatorTabs;
