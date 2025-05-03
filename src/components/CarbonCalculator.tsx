
import React from 'react';
import { ErrorBoundary } from "react-error-boundary";
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
  // Get all needed actions and state in one place to avoid multiple context accesses
  const {
    error,
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
    isExistingProject,
    isCalculating,
    handleSaveClick,
    handleSaveConfirm,
    handleSignIn,
    calculatorContext
  } = useCalculatorActions({ demoMode });
  
  // Handle error gracefully
  if (error || !calculatorContext) {
    console.error("Calculator error:", error);
    return <CalculatorError />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorAlerts 
        demoMode={demoMode} 
        authError={authError ? authError.message : null}
        onAuthErrorClear={() => setAuthError(null)}
        onSignIn={handleSignIn}
      />
      
      <ErrorBoundary 
        fallback={<CalculatorError />}
        onError={(error) => console.error("Calculator component error:", error)}
      >
        <CalculatorContainer
          projectName={projectName}
          setProjectName={setProjectName}
          authError={authError}
          setAuthError={setAuthError}
          savingError={savingError}
          setSavingError={setSavingError}
          isSaving={isSaving}
          setIsSaving={setIsSaving}
          showSaveDialog={showSaveDialog}
          setShowSaveDialog={setShowSaveDialog}
          demoMode={demoMode}
          isCalculating={isCalculating}
          onSaveConfirm={handleSaveConfirm}
          onSaveClick={handleSaveClick}
          onSignIn={handleSignIn}
          isExistingProject={isExistingProject}
          calculatorContext={calculatorContext}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CarbonCalculator;
