
import React from 'react';
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { ErrorBoundary } from "react-error-boundary";

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
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
    isCalculating,
    setIsCalculating,
    handleSaveClick,
    handleSaveConfirm,
    handleSignIn,
    isExistingProject,
    calculatorContext
  } = useCalculatorActions({ demoMode });

  // Handle error gracefully
  if (error) {
    console.error("Calculator error:", error);
    return <CalculatorError />;
  }

  // Ensure we have the calculator context
  if (!calculatorContext) {
    console.error("Calculator context is not available");
    return <CalculatorError />;
  }

  console.log("CarbonCalculator rendering with calculatorContext:", calculatorContext.activeTab);

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
          isCalculating={calculatorContext.isCalculating}
          setIsCalculating={calculatorContext.setIsCalculating}
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
