
import { useCalculatorActions } from './calculator/hooks/useCalculatorActions';
import CalculatorError from "./calculator/CalculatorError";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";

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
  if (error || !calculatorContext) {
    return <CalculatorError />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorAlerts 
        demoMode={demoMode} 
        authError={authError}
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
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
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
