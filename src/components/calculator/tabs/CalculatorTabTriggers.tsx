
import { TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CalculatorTabTriggersProps {
  isMobile: boolean;
  isPremiumUser?: boolean;
}

const CalculatorTabTriggers = ({ isMobile, isPremiumUser = false }: CalculatorTabTriggersProps) => {
  const renderAdvancedTrigger = (value: string, label: string) => {
    if (isPremiumUser) {
      return (
        <TabsTrigger 
          value={value} 
          className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
        >
          {label}
        </TabsTrigger>
      );
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <TabsTrigger 
              value={value}
              disabled={!isPremiumUser}
              className="relative data-[state=active]:bg-gray-400 data-[state=active]:text-white text-gray-400"
            >
              {label}
              <Lock className="h-3 w-3 ml-1 inline-flex" />
            </TabsTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Premium feature. Upgrade to access.</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="col-span-2 flex space-x-1">
          <TabsTrigger 
            value="materials" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1 text-foreground"
          >
            Materials
          </TabsTrigger>
          <TabsTrigger 
            value="transport" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1 text-foreground"
          >
            Transport
          </TabsTrigger>
        </div>
        <div className="col-span-2 flex space-x-1 mt-1">
          <TabsTrigger 
            value="energy" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1 text-foreground"
          >
            Energy
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1 text-foreground"
          >
            Results
          </TabsTrigger>
        </div>
      </>
    );
  }

  return (
    <>
      <TabsTrigger 
        value="materials" 
        className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
      >
        Materials
      </TabsTrigger>
      <TabsTrigger 
        value="transport" 
        className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
      >
        Transport
      </TabsTrigger>
      <TabsTrigger 
        value="energy" 
        className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
      >
        Energy
      </TabsTrigger>
      <TabsTrigger 
        value="results" 
        className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
      >
        Results
      </TabsTrigger>
    </>
  );
};

export default CalculatorTabTriggers;
