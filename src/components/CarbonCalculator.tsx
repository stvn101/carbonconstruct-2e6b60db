
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useCalculator } from "@/contexts/calculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CalculatorHeader from "./calculator/CalculatorHeader";
import ProjectNameCard from "./calculator/ProjectNameCard";
import CalculatorTabs from "./calculator/CalculatorTabs";
import PageLoading from "./ui/page-loading";

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode }: CarbonCalculatorProps) => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Try to access calculator context, handle errors gracefully
  let calculatorContext = null;
  try {
    calculatorContext = useCalculator();
  } catch (error) {
    console.error("Error accessing calculator context:", error);
    
    // Return error UI
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

  const {
    calculationInput,
    calculationResult,
    activeTab,
    setActiveTab,
    handleCalculate
  } = calculatorContext;

  const handleSaveProject = async () => {
    if (!user) {
      toast.error("Please log in to save your project");
      navigate("/auth");
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }
    
    setIsSaving(true);
    
    try {
      await saveProject({
        name: projectName,
        description: "Carbon calculation project",
        materials: calculationInput.materials,
        transport: calculationInput.transport,
        energy: calculationInput.energy,
        result: calculationResult,
        tags: ["carbon", "calculation"],
        // Add the missing required properties
        status: 'draft',
        total_emissions: calculationResult.totalEmissions || 0,
        premium_only: false
      });
      
      toast.success("Project saved successfully!");
      navigate(`/projects`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
      setIsSaving(false);
    }
  };

  const recordCalculatorUsage = useCallback(async () => {
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
  }, [user, demoMode]);

  const handleCalculateWithTracking = useCallback(() => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    try {
      handleCalculate();
      setTimeout(() => {
        recordCalculatorUsage().finally(() => {
          setIsCalculating(false);
        });
      }, 100);
    } catch (error) {
      console.error("Error during calculation:", error);
      setIsCalculating(false);
      toast.error("Calculation failed. Please try again.");
    }
  }, [handleCalculate, recordCalculatorUsage, isCalculating]);

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
          isSaving={isSaving}
        />
      
        <CalculatorTabs 
          isMobile={isMobile}
          activeTab={activeTab || "materials"}
          setActiveTab={setActiveTab}
          onCalculate={handleCalculateWithTracking}
        />
      </motion.div>
      
      {/* Loading overlay while saving */}
      <PageLoading isLoading={isSaving} text="Saving project..." />
    </div>
  );
};

export default CarbonCalculator;
