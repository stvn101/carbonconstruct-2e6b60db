
import { useState } from "react";
import { motion } from "framer-motion";
import { useCalculator } from "@/contexts/calculator";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectNameCard from "./ProjectNameCard";
import CalculatorTabs from "./CalculatorTabs";
import CalculatorTabContents from "./tabs/CalculatorTabContents";
import PageLoading from "../ui/page-loading";
import SaveProjectConfirmDialog from "./SaveProjectConfirmDialog";
import CalculatorUsageTracker from "./CalculatorUsageTracker";
import { TooltipProvider } from "@/components/ui/tooltip";

export interface CalculatorContainerProps {
  projectName: string;
  setProjectName: (name: string) => void;
  authError: string | null;
  setAuthError: (error: string | null) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  demoMode: boolean;
  isCalculating: boolean;
  setIsCalculating: (isCalculating: boolean) => void;
  onSaveConfirm: () => Promise<void>;
  onSaveClick: () => void;
  onSignIn: () => void;
  isExistingProject: boolean;
  calculatorContext: any;
  isPremiumUser?: boolean;
}

const CalculatorContainer = ({
  projectName,
  setProjectName,
  authError,
  setAuthError,
  isSaving,
  setIsSaving,
  showSaveDialog,
  setShowSaveDialog,
  demoMode,
  isCalculating,
  setIsCalculating,
  onSaveConfirm,
  onSaveClick,
  onSignIn,
  isExistingProject,
  calculatorContext,
  isPremiumUser = false
}: CalculatorContainerProps) => {
  const isMobile = useIsMobile().isMobile;
  const {
    calculationInput,
    calculationResult,
    activeTab,
    setActiveTab,
    handleCalculate,
    handleAddMaterial,
    handleUpdateMaterial,
    handleRemoveMaterial,
    handleAddTransport,
    handleUpdateTransport,
    handleRemoveTransport,
    handleAddEnergy,
    handleUpdateEnergy,
    handleRemoveEnergy,
    handleNextTab,
    handlePrevTab
  } = calculatorContext;

  const handleCalculateWithTracking = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    
    try {
      handleCalculate();
      setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error("Error during calculation:", error);
      setIsCalculating(false);
      toast.error("Calculation failed. Please try again.");
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <ProjectNameCard
            projectName={projectName}
            onProjectNameChange={setProjectName}
            onSave={onSaveClick}
            isSaving={isSaving}
            demoMode={demoMode}
          />
        
          {/* Place tabs after project name card to match original layout */}
          <CalculatorTabs 
            activeTab={activeTab || "materials"}
            setActiveTab={setActiveTab}
            onCalculate={handleCalculateWithTracking}
            isMobile={isMobile}
            isPremiumUser={isPremiumUser}
          />
        </motion.div>
        
        {/* Ensure tab contents have proper styling to avoid transparency */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
          <CalculatorTabContents
            calculationInput={calculationInput}
            calculationResult={calculationResult}
            onUpdateMaterial={handleUpdateMaterial}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onUpdateTransport={handleUpdateTransport}
            onAddTransport={handleAddTransport}
            onRemoveTransport={handleRemoveTransport}
            onUpdateEnergy={handleUpdateEnergy}
            onAddEnergy={handleAddEnergy}
            onRemoveEnergy={handleRemoveEnergy}
            onCalculate={handleCalculateWithTracking}
            onPrevTab={handlePrevTab}
            onNextTab={handleNextTab}
            demoMode={demoMode}
          />
        </div>
        
        <PageLoading isLoading={isSaving} text="Saving project..." />

        <SaveProjectConfirmDialog
          isOpen={showSaveDialog}
          projectName={projectName}
          isSaving={isSaving}
          onConfirm={onSaveConfirm}
          onCancel={() => setShowSaveDialog(false)}
          isOverwrite={isExistingProject}
        />

        <CalculatorUsageTracker
          demoMode={demoMode}
          isPremiumUser={isPremiumUser}
          onComplete={() => setIsCalculating(false)}
        />
      </div>
    </TooltipProvider>
  );
};

export default CalculatorContainer;
