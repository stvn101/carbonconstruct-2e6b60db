
import React from 'react';
import CalculatorTabs from "../../CalculatorTabs";
import CalculatorTabContents from "../../tabs/CalculatorTabContents";
import TabErrorDisplay from "../error/TabErrorDisplay";

interface CalculatorTabSectionProps {
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
}

const CalculatorTabSection: React.FC<CalculatorTabSectionProps> = ({
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
  tabError
}) => {
  return (
    <>
      <CalculatorTabs 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onCalculate={handleCalculateWithTracking}
        isMobile={isMobile}
        isPremiumUser={isPremiumUser}
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
    </>
  );
};

export default CalculatorTabSection;
