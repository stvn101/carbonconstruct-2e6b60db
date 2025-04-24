
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { ErrorBoundary } from "react-error-boundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import PageLoading from "../ui/page-loading";
import SaveProjectConfirmDialog from "./SaveProjectConfirmDialog";
import CalculatorUsageTracker from "./CalculatorUsageTracker";
import ErrorFallback from "./components/CalculatorErrorBoundary";
import ProjectNameSection from "./components/ProjectNameSection";
import CalculatorContent from "./components/CalculatorContent";
import ErrorTrackingService from "@/services/error/errorTrackingService";

interface CalculatorContainerProps {
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

const CalculatorContainer: React.FC<CalculatorContainerProps> = ({
  projectName,
  setProjectName,
  isSaving,
  setIsSaving,
  showSaveDialog,
  setShowSaveDialog,
  demoMode,
  isCalculating,
  setIsCalculating,
  onSaveConfirm,
  onSaveClick,
  isExistingProject,
  calculatorContext,
  isPremiumUser = false
}) => {
  const isMobile = useIsMobile()?.isMobile || false;
  const [tabError, setTabError] = useState<string | null>(null);
  const [calculatorKey, setCalculatorKey] = useState<number>(0);

  if (!calculatorContext) {
    return (
      <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-md text-center">
        <h3 className="text-lg font-semibold mb-2">Failed to load calculator</h3>
        <p className="text-muted-foreground mb-4">The calculator data could not be initialized</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-carbon-600 text-white rounded-md hover:bg-carbon-700"
        >
          Reload page
        </button>
      </div>
    );
  }

  const handleCalculateWithTracking = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    setTabError(null);
    
    try {
      calculatorContext.handleCalculate();
      setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error("Error during calculation:", error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'Calculator', action: 'calculate' }
      );
      setIsCalculating(false);
      setTabError((error as Error)?.message || "Calculation failed. Please try again.");
    }
  };

  const handleResetCalculator = () => {
    setCalculatorKey(prev => prev + 1);
    setTabError(null);
  };

  const handleTabChange = (newTab: string) => {
    console.log(`Container: Tab change request to ${newTab}`);
    if (typeof calculatorContext.setActiveTab === 'function') {
      calculatorContext.setActiveTab(newTab as any);
      console.log(`Container: Tab set to ${newTab}`);
    }
  };

  const handleNextTab = () => {
    console.log("Container: Next tab request");
    if (typeof calculatorContext.handleNextTab === 'function') {
      calculatorContext.handleNextTab();
      console.log("Container: Next tab function called");
    }
  };

  const handlePrevTab = () => {
    console.log("Container: Previous tab request");
    if (typeof calculatorContext.handlePrevTab === 'function') {
      calculatorContext.handlePrevTab();
      console.log("Container: Previous tab function called");
    }
  };

  return (
    <TooltipProvider>
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={handleResetCalculator}
        onError={(error) => {
          console.error("Main calculator error:", error);
          ErrorTrackingService.captureException(error, { 
            component: 'CalculatorContainer', 
            level: 'critical'
          });
        }}
      >
        <div className="container mx-auto px-4 md:px-6" key={calculatorKey}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ProjectNameSection 
              projectName={projectName}
              setProjectName={setProjectName}
              onSave={onSaveClick}
              isSaving={isSaving}
              demoMode={demoMode}
            />

            <CalculatorContent
              activeTab={calculatorContext.activeTab}
              handleTabChange={handleTabChange}
              handleCalculateWithTracking={handleCalculateWithTracking}
              isMobile={isMobile}
              isPremiumUser={isPremiumUser}
              calculationInput={calculatorContext.calculationInput}
              calculationResult={calculatorContext.calculationResult}
              handleUpdateMaterial={calculatorContext.handleUpdateMaterial}
              handleAddMaterial={calculatorContext.handleAddMaterial}
              handleRemoveMaterial={calculatorContext.handleRemoveMaterial}
              handleUpdateTransport={calculatorContext.handleUpdateTransport}
              handleAddTransport={calculatorContext.handleAddTransport}
              handleRemoveTransport={calculatorContext.handleRemoveTransport}
              handleUpdateEnergy={calculatorContext.handleUpdateEnergy}
              handleAddEnergy={calculatorContext.handleAddEnergy}
              handleRemoveEnergy={calculatorContext.handleRemoveEnergy}
              handlePrevTab={handlePrevTab}
              handleNextTab={handleNextTab}
              demoMode={demoMode}
              tabError={tabError}
              onResetError={() => setTabError(null)}
            />
          </motion.div>
          
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
      </ErrorBoundary>
    </TooltipProvider>
  );
};

export default CalculatorContainer;
