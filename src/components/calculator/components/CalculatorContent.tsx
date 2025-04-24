
import React from 'react';
import CalculatorErrorBoundaryWrapper from "./error/CalculatorErrorBoundaryWrapper";
import CalculatorTabSection from "./tabs/CalculatorTabSection";

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

const CalculatorContent: React.FC<CalculatorContentProps> = (props) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <CalculatorErrorBoundaryWrapper 
        onResetError={props.onResetError}
        resetKeys={[props.activeTab]}
      >
        <CalculatorTabSection {...props} />
      </CalculatorErrorBoundaryWrapper>
    </div>
  );
};

export default CalculatorContent;
