
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
  
  const {
    calculationInput,
    calculationResult,
    activeTab,
    setActiveTab
  } = useCalculator();

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
};

export default CarbonCalculator;
