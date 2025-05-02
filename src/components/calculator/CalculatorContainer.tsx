
import React from "react";
import { CalculatorContextType } from "@/contexts/calculator/types";
import ProjectNameInput from "./ProjectNameInput";
import CalculatorSaveDialog from "./CalculatorSaveDialog";
import CalculatorTabs from "./CalculatorTabs";
import CalculatorTabContents from "./tabs/CalculatorTabContents";

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
  onSaveConfirm,
  onSaveClick,
  onSignIn,
  isExistingProject,
  calculatorContext
}) => {
  // Remove the redundant setIsCalculating function call that's causing the infinite loop
  const handleCalculate = () => {
    setTimeout(() => {
      calculatorContext.handleCalculate();
    }, 500);
  };

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
          onCalculate={handleCalculate}
          onSave={onSaveClick}
          isSaving={isSaving}
          isCalculating={isCalculating}
          demoMode={demoMode}
        />

        {/* Add the tab contents here */}
        <CalculatorTabContents
          calculationInput={calculatorContext.calculationInput}
          calculationResult={calculatorContext.calculationResult}
          onUpdateMaterial={calculatorContext.handleUpdateMaterial}
          onAddMaterial={calculatorContext.handleAddMaterial}
          onRemoveMaterial={calculatorContext.handleRemoveMaterial}
          onUpdateTransport={calculatorContext.handleUpdateTransport}
          onAddTransport={calculatorContext.handleAddTransport}
          onRemoveTransport={calculatorContext.handleRemoveTransport}
          onUpdateEnergy={calculatorContext.handleUpdateEnergy}
          onAddEnergy={calculatorContext.handleAddEnergy}
          onRemoveEnergy={calculatorContext.handleRemoveEnergy}
          onCalculate={handleCalculate}
          onPrev={calculatorContext.handlePrevTab}
          onNext={calculatorContext.handleNextTab}
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
