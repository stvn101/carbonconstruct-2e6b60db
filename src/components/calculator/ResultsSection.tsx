
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import CalculatorResults from "../CalculatorResults";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { Calculator, Save, FileText } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface ResultsSectionProps {
  calculationResult: CalculationResult | null;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  onCalculate: () => void;
  onPrev: () => void;
}

const ResultsSection = ({
  calculationResult,
  materials,
  transport,
  energy,
  onCalculate,
  onPrev
}: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { saveProject } = useProjects();
  const navigate = useNavigate();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  
  // Check if we have valid input data
  const hasValidInputs = materials.some(m => m.quantity > 0) || 
                        transport.some(t => t.distance > 0 && t.weight > 0) ||
                        energy.some(e => e.amount > 0);
  
  // Handle project save
  const handleSaveProject = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }

    try {
      const newProject = await saveProject({
        name: projectName,
        description: projectDescription,
        materials,
        transport,
        energy,
        result: calculationResult || undefined,
        tags: ["Carbon Calculation"]
      });
      
      setSaveDialogOpen(false);
      toast.success("Project saved successfully!");
      
      // Ask if user wants to view the project
      setTimeout(() => {
        if (window.confirm("Project saved! Would you like to view it now?")) {
          navigate(`/project/${newProject.id}`);
        }
      }, 500);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project. Please try again.");
    }
  };
  
  // Animation variants for staggered animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {calculationResult && calculationResult.totalEmissions > 0 ? (
        <>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mb-6">
            {user && (
              <Button 
                type="button" 
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
                onClick={() => setSaveDialogOpen(true)}
              >
                <Save className="h-4 w-4 mr-1.5" />
                Save Project
              </Button>
            )}
          </div>
          <CalculatorResults 
            result={calculationResult} 
            materials={materials}
            transport={transport}
            energy={energy}
            onRecalculate={onCalculate}
          />
        </>
      ) : (
        <motion.div 
          className="space-y-4 md:space-y-6 text-center py-6 md:py-10"
          variants={containerVariants}
        >
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <Calculator className="h-12 w-12 md:h-16 md:w-16 text-carbon-500 mb-2 md:mb-4" />
          </motion.div>
          <motion.p 
            className="text-md md:text-lg"
            variants={itemVariants}
          >
            {!hasValidInputs ? 
              "Please add some input data in the previous tabs before calculating." : 
              "Click the calculate button to see results."}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button 
              type="button" 
              size={isMobile ? "default" : "lg"} 
              onClick={onCalculate} 
              className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm animate-pulse"
              disabled={!hasValidInputs}
            >
              Calculate Now
            </Button>
          </motion.div>
        </motion.div>
      )}
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-between gap-2 mt-6"
        variants={itemVariants}
      >
        <Button 
          type="button" 
          variant="outline" 
          size={isMobile ? "sm" : "default"}
          onClick={onPrev} 
          className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
        >
          Previous: Energy
        </Button>
        <div className="flex gap-2 mt-2 sm:mt-0">
          {calculationResult && user && (
            <Button 
              type="button" 
              size={isMobile ? "sm" : "default"}
              onClick={() => setSaveDialogOpen(true)}
              className="border-carbon-300 hover:bg-carbon-100 hover:text-carbon-800 text-xs md:text-sm"
              variant="outline"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save
            </Button>
          )}
          <Button 
            type="button" 
            size={isMobile ? "sm" : "default"}
            onClick={onCalculate} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
            disabled={!hasValidInputs}
          >
            {calculationResult ? "Recalculate" : "Calculate"}
          </Button>
        </div>
      </motion.div>

      {/* Save Project Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Project</DialogTitle>
            <DialogDescription>
              Save your calculation results to access them later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="e.g., Office Building Phase 1"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="project-description" className="text-sm font-medium">
                Project Description (Optional)
              </label>
              <Textarea
                id="project-description"
                placeholder="Enter project details or notes here"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProject}
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ResultsSection;
