
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
    <Alert className="mb-6 bg-destructive/10 border-destructive/20 dark:bg-destructive/20 dark:border-destructive/30">
      <AlertTitle className="text-destructive">Calculator Error</AlertTitle>
      <AlertDescription className="text-destructive/90">
        An error occurred while loading the calculator: {error.message}
        <div className="mt-2">
          <Button 
            onClick={resetErrorBoundary} 
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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

  return (
    <div className="container mx-auto px-4 md:px-6 pb-16">
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
