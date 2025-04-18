
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectDetailsTab from "./ProjectDetailsTab";
import ProjectCalculatorTab from "./ProjectCalculatorTab";
import { SavedProject } from "@/types/project";
import { toast } from "sonner";

interface ProjectTabsProps {
  project: SavedProject;
  isPremiumUser: boolean;
  onExportPDF: (project: SavedProject) => void;
  onExportCSV: (project: SavedProject) => void;
  calculatorData: {
    calculationInput?: any;
    calculationResult?: any;
    handleCalculate?: () => void;
  };
}

const ProjectTabs = ({ 
  project, 
  isPremiumUser, 
  onExportPDF, 
  onExportCSV, 
  calculatorData 
}: ProjectTabsProps) => {
  const handleCalculatorUsage = async () => {
    if (calculatorData.handleCalculate) {
      try {
        calculatorData.handleCalculate();
      } catch (error) {
        console.error("Error during calculation:", error);
        toast.error("Calculation failed. Please try again.");
      }
    } else {
      toast.error("Calculator is not available");
    }
  };

  return (
    <Tabs defaultValue="details" className="mb-4">
      <TabsList className="w-full sm:w-auto flex">
        <TabsTrigger value="details" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
          Project Details
        </TabsTrigger>
        <TabsTrigger value="calculator" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
          Calculator
        </TabsTrigger>
        <TabsTrigger value="advanced" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white premium-feature">
          Advanced Analysis
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="details">
        <ProjectDetailsTab 
          project={project}
          onExportPDF={() => onExportPDF(project)}
          onExportCSV={() => onExportCSV(project)}
        />
      </TabsContent>
      
      <TabsContent value="calculator">
        <ProjectCalculatorTab 
          calculationInput={calculatorData.calculationInput}
          calculationResult={calculatorData.calculationResult}
          onCalculate={handleCalculatorUsage}
        />
      </TabsContent>
      
      <TabsContent value="advanced" className="premium-feature">
        <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Advanced Analysis (Premium Feature)</h3>
          <p className="text-muted-foreground mb-4">
            This section contains advanced analytics and insights for your project.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProjectTabs;
