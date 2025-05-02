
import React from 'react';
import CalculatorTabs from "../../CalculatorTabs";
import CalculatorTabContents from "../../tabs/CalculatorTabContents";
import TabErrorDisplay from "../error/TabErrorDisplay";
import { CalculatorContextType } from "@/contexts/calculator/types";

interface CalculatorTabSectionProps {
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
  handleCalculateWithTracking: () => void;
  demoMode: boolean;
  tabError: string | null;
  calculatorContext: CalculatorContextType;
  isSaving: boolean;
  onSaveClick: () => void;
  isCalculating?: boolean;
}

const CalculatorTabSection: React.FC<CalculatorTabSectionProps> = ({
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
  handleCalculateWithTracking,
  demoMode,
  tabError,
  calculatorContext,
  isSaving,
  onSaveClick,
  isCalculating = false
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <CalculatorTabs 
        calculatorContext={calculatorContext}
        onCalculate={handleCalculateWithTracking}
        onSave={onSaveClick}
        isSaving={isSaving}
        isCalculating={isCalculating}
        demoMode={demoMode}
      />
      
      <TabErrorDisplay error={tabError} />

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
        onPrev={handlePrevTab}
        onNext={handleNextTab}
        demoMode={demoMode}
      />
    </div>
  );
};

export default CalculatorTabSection;
