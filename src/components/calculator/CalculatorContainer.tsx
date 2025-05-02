
import React from "react";
import CalculatorTabs from "./CalculatorTabs";
import { CalculatorContextType } from "@/contexts/calculator/types";
import { CalculationResult } from "@/lib/carbonCalculations";
import ProjectNameInput from "./ProjectNameInput";
import CalculatorSaveDialog from "./CalculatorSaveDialog";

interface CalculatorContainerProps {
  projectName: string;
  setProjectName: (name: string) => void;
  authError: Error | null;
  setAuthError: (error: Error | null) => void;
  savingError: Error | null;
  setSavingError: (error: Error | null) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  showSaveDialog: boolean;
  setShowSaveDialog: (show: boolean) => void;
  demoMode: boolean;
  isCalculating: boolean;
  setIsCalculating: (isCalculating: boolean) => void;
  onSaveConfirm: () => void;
  onSaveClick: () => void;
  onSignIn: () => void;
  isExistingProject: boolean;
  calculatorContext: CalculatorContextType;
}

const CalculatorContainer: React.FC<CalculatorContainerProps> = ({
  projectName,
  setProjectName,
  authError,
  setAuthError,
  savingError,
  setSavingError,
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
  calculatorContext
}) => {
  return (
    <>
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border-t-4 border-carbon-600 mb-8">
        <ProjectNameInput
          projectName={projectName}
          setProjectName={setProjectName}
          disabled={isSaving}
          demoMode={demoMode}
        />
        
        <CalculatorTabs 
          calculatorContext={calculatorContext}
          onCalculate={() => {
            setIsCalculating(true);
            setTimeout(() => {
              calculatorContext.handleCalculate();
              setIsCalculating(false);
            }, 500);
          }}
          onSave={onSaveClick}
          isSaving={isSaving}
          isCalculating={isCalculating}
          demoMode={demoMode}
        />
      </div>

      {showSaveDialog && (
        <CalculatorSaveDialog
          isOpen={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onConfirm={onSaveConfirm}
          isSaving={isSaving}
          isExisting={isExistingProject}
        />
      )}
    </>
  );
};

export default CalculatorContainer;
