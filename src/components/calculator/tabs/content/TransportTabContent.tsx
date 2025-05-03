
import React from "react";
import { useCalculator } from "@/contexts/calculator";
import TransportInputSection from "../../TransportInputSection";

const TransportTabContent: React.FC = () => {
  const {
    calculationInput,
    handleUpdateTransport,
    handleAddTransport,
    handleRemoveTransport,
    handleNextTab,
    handlePrevTab
  } = useCalculator();

  const handleNext = () => {
    handleNextTab();
  };

  const handlePrev = () => {
    handlePrevTab();
  };

  return (
    <TransportInputSection
      transport={calculationInput.transport}
      onUpdateTransport={handleUpdateTransport}
      onAddTransport={handleAddTransport}
      onRemoveTransport={handleRemoveTransport}
      onNext={handleNext}
      onBack={handlePrev}
      demoMode={false}
    />
  );
};

export default TransportTabContent;
