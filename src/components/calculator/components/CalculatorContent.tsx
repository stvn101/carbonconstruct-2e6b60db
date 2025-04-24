
import React from 'react';
import { ErrorBoundary } from "react-error-boundary";
import CalculatorTabs from "../CalculatorTabs";
import CalculatorTabContents from "../tabs/CalculatorTabContents";
import ErrorFallback from "./CalculatorErrorBoundary";

interface CalculatorContentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  handleCalculateWithTracking: () => void;
  isMobile: boolean;
  isPremiumUser: boolean;
  calculationInput: any;
  calculationResult: any;
  handleUpdateMaterial: any;
  handleAddMaterial: () => void;
  handleRemoveMaterial: (index: number) => void;
  handleUpdateTransport: any;
  handleAddTransport: () => void;
  handleRemoveTransport: (index: number) => void;
  handleUpdateEnergy: any;
  handleAddEnergy: () => void;
  handleRemoveEnergy: (index: number) => void;
  handlePrevTab: () => void;
  handleNextTab: () => void;
  demoMode: boolean;
  tabError: string | null;
  onResetError: () => void;
}

const CalculatorContent: React.FC<CalculatorContentProps> = ({
  activeTab,
  handleTabChange,
  handleCalculateWithTracking,
  isMobile,
  isPremiumUser,
  calculationInput,
  calculationResult,
  handleUpdateMaterial,
  handleAddMaterial,
  handleRemoveMaterial,
  handleUpdateTransport,
  handleAddTransport,
  handleRemoveTransport,
  handleUpdateEnergy,
  handleAddEnergy,
  handleRemoveEnergy,
  handlePrevTab,
  handleNextTab,
  demoMode,
  tabError,
  onResetError
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={onResetError}
        resetKeys={[activeTab]}
      >
        <CalculatorTabs 
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onCalculate={handleCalculateWithTracking}
          isMobile={isMobile}
          isPremiumUser={isPremiumUser}
        />
        
        {tabError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
            <p className="font-medium">{tabError}</p>
          </div>
        )}

        <CalculatorTabContents
          calculationInput={calculationInput}
          calculationResult={calculationResult}
          onUpdateMaterial={handleUpdateMaterial}
          onAddMaterial={handleAddMaterial}
          onRemoveMaterial={handleRemoveMaterial}
          onUpdateTransport={handleUpdateTransport}
          onAddTransport={handleAddTransport}
          onRemoveTransport={handleRemoveTransport}
          onUpdateEnergy={handleUpdateEnergy}
          onAddEnergy={handleAddEnergy}
          onRemoveEnergy={handleRemoveEnergy}
          onCalculate={handleCalculateWithTracking}
          onPrevTab={handlePrevTab}
          onNextTab={handleNextTab}
          demoMode={demoMode}
        />
      </ErrorBoundary>
    </div>
  );
};

export default CalculatorContent;
