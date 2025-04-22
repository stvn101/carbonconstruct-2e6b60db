
import { useState } from "react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import ProjectNameCard from "./ProjectNameCard";
import CalculatorTabs from "./CalculatorTabs";
import CalculatorTabContents from "./tabs/CalculatorTabContents";
import PageLoading from "../ui/page-loading";
import SaveProjectConfirmDialog from "./SaveProjectConfirmDialog";
import CalculatorUsageTracker from "./CalculatorUsageTracker";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "react-error-boundary";

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

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-md text-center" role="alert">
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="text-muted-foreground mb-4">{error.message || "An error occurred while rendering the calculator"}</p>
    <button 
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-carbon-600 text-white rounded-md hover:bg-carbon-700"
    >
      Try again
    </button>
  </div>
);

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
  const [tabError, setTabError] = useState<string | null>(null);
  
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
    setTabError(null);
    
    try {
      handleCalculate();
      setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error("Error during calculation:", error);
      setIsCalculating(false);
      setTabError((error as Error)?.message || "Calculation failed. Please try again.");
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
        
          {/* Tabs after project name card */}
          <CalculatorTabs 
            activeTab={activeTab || "materials"}
            setActiveTab={setActiveTab}
            onCalculate={handleCalculateWithTracking}
            isMobile={isMobile}
            isPremiumUser={isPremiumUser}
          />
        </motion.div>
        
        {/* Display tab error if exists */}
        {tabError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
            <p className="font-medium">{tabError}</p>
          </div>
        )}
        
        {/* Tab contents with error boundary */}
        <ErrorBoundary 
          FallbackComponent={ErrorFallback}
          onReset={() => setTabError(null)}
          resetKeys={[activeTab]}
        >
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
        </ErrorBoundary>
        
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
