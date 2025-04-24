
import React from 'react';
import { useState, useEffect } from "react";
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
import ErrorTrackingService from "@/services/error/errorTrackingService";

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

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  React.useEffect(() => {
    ErrorTrackingService.captureException(error, { 
      component: 'CalculatorContainer', 
      errorDetails: error.toString() 
    });
  }, [error]);
  
  return (
    <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-md text-center" role="alert">
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">{error?.message || "An error occurred while rendering the calculator"}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-carbon-600 text-white rounded-md hover:bg-carbon-700"
      >
        Try again
      </button>
    </div>
  );
};

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
  const isMobile = useIsMobile()?.isMobile || false;
  const [tabError, setTabError] = useState<string | null>(null);
  const [calculatorKey, setCalculatorKey] = useState<number>(0);
  
  // Sync local state with calculator context
  useEffect(() => {
    if (calculatorContext && calculatorContext.activeTab) {
      console.log(`CalculatorContainer syncing with calculator context tab: ${calculatorContext.activeTab}`);
    }
  }, [calculatorContext]);
  
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
    try {
      console.log(`CalculatorContainer handling tab change to: ${newTab}`);
      if (typeof setActiveTab === 'function') {
        setActiveTab(newTab as any);
      } else {
        console.error("setActiveTab is not available:", setActiveTab);
      }
    } catch (error) {
      console.error("Error changing tab:", error);
      ErrorTrackingService.captureException(
        error instanceof Error ? error : new Error(String(error)),
        { component: 'Calculator', action: 'change-tab' }
      );
    }
  };

  // Log the current active tab for debugging
  useEffect(() => {
    console.log(`CalculatorContainer current tab: ${activeTab}`);
  }, [activeTab]);

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
            className="mb-6"
          >
            <ProjectNameCard
              projectName={projectName || ""}
              onProjectNameChange={setProjectName}
              onSave={onSaveClick}
              isSaving={isSaving}
              demoMode={demoMode}
            />
          
            <CalculatorTabs 
              activeTab={activeTab || "materials"}
              setActiveTab={handleTabChange}
              onCalculate={handleCalculateWithTracking}
              isMobile={!!isMobile}
              isPremiumUser={!!isPremiumUser}
            />
          </motion.div>
          
          {tabError && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
              <p className="font-medium">{tabError}</p>
            </div>
          )}
          
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
            projectName={projectName || ""}
            isSaving={isSaving}
            onConfirm={onSaveConfirm}
            onCancel={() => setShowSaveDialog(false)}
            isOverwrite={isExistingProject}
          />

          <CalculatorUsageTracker
            demoMode={demoMode}
            isPremiumUser={!!isPremiumUser}
            onComplete={() => setIsCalculating(false)}
          />
        </div>
      </ErrorBoundary>
    </TooltipProvider>
  );
};

export default CalculatorContainer;
