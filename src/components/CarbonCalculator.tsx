
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";
import { ErrorBoundary } from 'react-error-boundary';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800">
      <AlertTitle className="text-red-800 dark:text-red-300">Calculator Error</AlertTitle>
      <AlertDescription className="text-red-700 dark:text-red-400">
        An error occurred while loading the calculator: {error.message}
        <div className="mt-2">
          <Button 
            onClick={resetErrorBoundary} 
            className="bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => console.log("Calculator error reset")}>
      <CarbonCalculatorContent demoMode={demoMode} />
    </ErrorBoundary>
  );
};

const CarbonCalculatorContent = ({ demoMode = false }: CarbonCalculatorProps) => {
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
    </div>
  );
};

export default CarbonCalculator;
