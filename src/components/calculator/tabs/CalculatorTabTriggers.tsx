
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CalculatorTabTriggersProps {
  isMobile: boolean;
}

const CalculatorTabTriggers = ({ isMobile }: CalculatorTabTriggersProps) => {
  if (isMobile) {
    return (
      <>
        <div className="col-span-2 flex space-x-1">
          <TabsTrigger 
            value="materials" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
          >
            Materials
          </TabsTrigger>
          <TabsTrigger 
            value="transport" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
          >
            Transport
          </TabsTrigger>
        </div>
        <div className="col-span-2 flex space-x-1 mt-1">
          <TabsTrigger 
            value="energy" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
          >
            Energy
          </TabsTrigger>
          <TabsTrigger 
            value="results" 
            className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
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
