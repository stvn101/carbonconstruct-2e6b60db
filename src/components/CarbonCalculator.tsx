
import React, { memo } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

// Use memo to prevent unnecessary re-renders
const CarbonCalculator = memo(({ demoMode = false }: CarbonCalculatorProps) => {
  const { isOffline } = useSimpleOfflineMode();
  
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
  } = useCalculatorActions({ demoMode: demoMode || isOffline });
  
  // Handle error gracefully
  if (error || !calculatorContext) {
    console.error("Calculator error: Context unavailable", { error, hasContext: !!calculatorContext });
    return <CalculatorError />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorAlerts 
        demoMode={demoMode || isOffline} 
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
          demoMode={demoMode || isOffline}
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
});

// Explicitly set display name for debugging purposes
CarbonCalculator.displayName = 'CarbonCalculator';

export default CarbonCalculator;
