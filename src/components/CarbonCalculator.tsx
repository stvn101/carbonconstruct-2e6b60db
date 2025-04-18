
import { useState } from "react";
import { motion } from "framer-motion";
import { useCalculator } from "@/contexts/CalculatorContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CalculatorHeader from "./calculator/CalculatorHeader";
import ProjectNameCard from "./calculator/ProjectNameCard";
import CalculatorTabs from "./calculator/CalculatorTabs";

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode }: CarbonCalculatorProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  
  // Wrap context usage in try/catch for better error handling
  try {
    const {
      calculationInput,
      calculationResult,
      activeTab,
      setActiveTab,
      handleCalculate
    } = useCalculator();

    // Ensure we have the calculator context
    console.log("Calculator context loaded successfully");

    const handleSaveProject = async () => {
      if (!user) {
        toast.error("Please log in to save your project");
        navigate("/auth");
        return;
      }
      
      try {
        await saveProject({
          name: projectName,
          description: "Carbon calculation project",
          materials: calculationInput.materials,
          transport: calculationInput.transport,
          energy: calculationInput.energy,
          result: calculationResult,
          tags: ["carbon", "calculation"],
        });
        
        toast.success("Project saved successfully!");
        navigate(`/projects`);
      } catch (error) {
        console.error("Error saving project:", error);
        toast.error("Failed to save project");
      }
    };

    const recordCalculatorUsage = async () => {
      try {
        if (user && !demoMode) {
          const { error } = await supabase
            .from('calculator_usage')
            .insert({ 
              user_id: user.id,
              ip_address: null
            });

          if (error) {
            console.error('Failed to record calculator usage:', error);
          }
        }
      } catch (error) {
        console.error('Error recording calculator usage:', error);
      }
    };

    const handleCalculateWithTracking = () => {
      handleCalculate();
      recordCalculatorUsage();
    };

    return (
      <div className="container mx-auto px-4 md:px-6">
        <CalculatorHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <ProjectNameCard
            projectName={projectName}
            onProjectNameChange={setProjectName}
            onSave={handleSaveProject}
          />
        
          <CalculatorTabs 
            isMobile={isMobile}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onCalculate={handleCalculateWithTracking}
          />
        </motion.div>
      </div>
    );
  } catch (error) {
    console.error("Error in CarbonCalculator:", error);
    
    // Fallback UI if context fails
    return (
      <div className="container mx-auto px-4 md:px-6">
        <CalculatorHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800 mt-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Calculator Error</h3>
            <p className="mt-2 text-red-700 dark:text-red-400">
              There was a problem loading the calculator. Please refresh the page or contact support if the issue persists.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </motion.div>
      </div>
    );
  }
};

export default CarbonCalculator;
