
import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { useCalculator } from '@/contexts/calculator';
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';

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

  // Get calculator context - nested in try/catch to prevent render failures
  let calculatorContext = null;
  let isCalculating = false;
  
  try {
    calculatorContext = useCalculator();
    isCalculating = calculatorContext?.isCalculating || false;
  } catch (err) {
    console.error("Failed to access calculator context:", err);
    return <CalculatorError />;
  }
  
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
