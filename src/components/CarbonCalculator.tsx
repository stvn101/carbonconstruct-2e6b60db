
import React, { useState, useEffect } from 'react';
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { ErrorBoundary } from "react-error-boundary";
import { useCalculator } from '@/contexts/calculator';

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
    isExistingProject,
    handleSaveClick,
    handleSaveConfirm,
    handleSignIn
  } = useCalculatorActions({ demoMode });

  // Get calculator context
  const calculatorContext = useCalculator();
  const { isCalculating, setIsCalculating } = calculatorContext;
  
  // Handle error gracefully
  if (error) {
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
          setIsCalculating={setIsCalculating}
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
