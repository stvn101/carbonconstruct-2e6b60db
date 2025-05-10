
import React from 'react';
import CalculatorErrorBoundaryWrapper from "./error/CalculatorErrorBoundaryWrapper";
import CalculatorTabSection from "./tabs/CalculatorTabSection";
import { CalculatorContextType } from "@/contexts/calculator/types";
import { CalculationInput, CalculationResult, EnergyInput, MaterialInput, TransportInput } from '@/lib/carbonExports';

interface CalculatorContentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
  handleCalculateWithTracking: () => void;
  isMobile: boolean;
  isPremiumUser: boolean;
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: string | number) => void;
  handleAddMaterial: () => void;
  handleRemoveMaterial: (index: number) => void;
  handleUpdateTransport: (index: number, field: keyof TransportInput, value: string | number) => void;
  handleAddTransport: () => void;
  handleRemoveTransport: (index: number) => void;
  handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: string | number) => void;
  handleAddEnergy: () => void;
  handleRemoveEnergy: (index: number) => void;
  handlePrevTab: () => void;
  handleNextTab: () => void;
  demoMode: boolean;
  tabError: string | null;
  onResetError: () => void;
  calculatorContext: CalculatorContextType;
  isSaving: boolean;
  onSaveClick: () => void;
  isCalculating: boolean;
}

const CalculatorContent: React.FC<CalculatorContentProps> = (props) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <CalculatorErrorBoundaryWrapper 
        onResetError={props.onResetError}
        resetKeys={[props.activeTab]}
      >
        <CalculatorTabSection 
          calculationInput={props.calculationInput}
          calculationResult={props.calculationResult}
          handleUpdateMaterial={props.handleUpdateMaterial}
          handleAddMaterial={props.handleAddMaterial}
          handleRemoveMaterial={props.handleRemoveMaterial}
          handleUpdateTransport={props.handleUpdateTransport}
          handleAddTransport={props.handleAddTransport}
          handleRemoveTransport={props.handleRemoveTransport}
          handleUpdateEnergy={props.handleUpdateEnergy}
          handleAddEnergy={props.handleAddEnergy}
          handleRemoveEnergy={props.handleRemoveEnergy}
          handlePrevTab={props.handlePrevTab}
          handleNextTab={props.handleNextTab}
          handleCalculateWithTracking={props.handleCalculateWithTracking}
          demoMode={props.demoMode}
          tabError={props.tabError}
          calculatorContext={props.calculatorContext}
          isSaving={props.isSaving}
          onSaveClick={props.onSaveClick}
          isCalculating={props.isCalculating}
        />
      </CalculatorErrorBoundaryWrapper>
    </div>
  );
};

export default CalculatorContent;
