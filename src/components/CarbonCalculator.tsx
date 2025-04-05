
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCalculator } from "@/hooks/useCalculator";
import { useIsMobile } from "@/hooks/use-mobile";

// Import the component sections
import MaterialsInputSection from "./calculator/MaterialsInputSection";
import TransportInputSection from "./calculator/TransportInputSection";
import EnergyInputSection from "./calculator/EnergyInputSection";
import ResultsSection from "./calculator/ResultsSection";

const CarbonCalculator = () => {
  const isMobile = useIsMobile();
  const {
    calculationInput,
    calculationResult,
    activeTab,
    setActiveTab,
    handleAddMaterial,
    handleUpdateMaterial,
    handleRemoveMaterial,
    handleAddTransport,
    handleUpdateTransport,
    handleRemoveTransport,
    handleAddEnergy,
    handleUpdateEnergy,
    handleRemoveEnergy,
    handleCalculate,
    handleNextTab,
    handlePrevTab
  } = useCalculator();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">Carbon Footprint Calculator</h1>
        <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
          Calculate the carbon emissions of your construction projects with our precise calculator
          that accounts for materials, transportation, and energy use.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mb-8 border-border bg-card">
          <CardHeader className="pb-2 md:pb-6">
            <div className="flex items-center gap-2 md:gap-3">
              <Calculator className="h-5 w-5 md:h-6 md:w-6 text-carbon-600 dark:text-carbon-400" />
              <CardTitle className="text-lg md:text-2xl text-foreground">Project Carbon Calculator</CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm mt-1 text-muted-foreground">
              Enter the details of your construction project to calculate its carbon footprint.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2 pb-4 md:pt-0 md:pb-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1 mb-4' : 'grid-cols-4 mb-6'} w-full bg-muted`}>
                {isMobile ? (
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
                ) : (
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
                )}
              </TabsList>
              
              <TabsContent value="materials">
                <MaterialsInputSection 
                  materials={calculationInput.materials}
                  onUpdateMaterial={handleUpdateMaterial}
                  onAddMaterial={handleAddMaterial}
                  onRemoveMaterial={handleRemoveMaterial}
                  onNext={handleNextTab}
                />
              </TabsContent>
              
              <TabsContent value="transport">
                <TransportInputSection 
                  transportItems={calculationInput.transport}
                  onUpdateTransport={handleUpdateTransport}
                  onAddTransport={handleAddTransport}
                  onRemoveTransport={handleRemoveTransport}
                  onNext={handleNextTab}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
              
              <TabsContent value="energy">
                <EnergyInputSection 
                  energyItems={calculationInput.energy}
                  onUpdateEnergy={handleUpdateEnergy}
                  onAddEnergy={handleAddEnergy}
                  onRemoveEnergy={handleRemoveEnergy}
                  onCalculate={handleNextTab}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
              
              <TabsContent value="results">
                <ResultsSection 
                  calculationResult={calculationResult}
                  materials={calculationInput.materials}
                  transport={calculationInput.transport}
                  energy={calculationInput.energy}
                  onCalculate={handleCalculate}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CarbonCalculator;
