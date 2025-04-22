
import { Tabs, TabsList } from "@/components/ui/tabs";
import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorTabTriggers from "./tabs/CalculatorTabTriggers";

interface CalculatorTabsProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onCalculate: () => void;
  isMobile: boolean;
  isPremiumUser?: boolean;
}

const CalculatorTabs = ({ 
  activeTab, 
  setActiveTab, 
  onCalculate,
  isMobile,
  isPremiumUser = false
}: CalculatorTabsProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 mb-0 flex-grow">
            <CalculatorTabTriggers isMobile={isMobile} isPremiumUser={isPremiumUser} />
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
