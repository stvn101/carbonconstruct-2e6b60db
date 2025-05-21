
import React from "react";
import SustainabilityReport from "../SustainabilityReport";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { MaterialAnalysisResult } from "@/lib/materialCategories";
import { ComplianceData } from "../types";

interface ReportTabContentProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  sustainabilityReport: any;
  materialAnalysis: MaterialAnalysisResult | null;
  complianceData: {
    ncc: ComplianceData | null;
    nabers: ComplianceData | null;
  };
  suggestions: string[];
}

const ReportTabContent: React.FC<ReportTabContentProps> = ({
  calculationInput,
  calculationResult,
  sustainabilityReport,
  materialAnalysis,
  complianceData,
  suggestions
}) => {
  return (
    <div className="mt-4">
      <SustainabilityReport
        calculationInput={calculationInput}
        calculationResult={calculationResult}
        sustainabilityReport={sustainabilityReport}
        materialAnalysis={materialAnalysis}
        complianceData={complianceData}
        suggestions={suggestions}
      />
    </div>
  );
};

export default ReportTabContent;
