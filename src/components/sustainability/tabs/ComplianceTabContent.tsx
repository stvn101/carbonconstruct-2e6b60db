
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileCheck, AlertCircle } from "lucide-react";
import { MaterialInput, EnergyInput } from "@/lib/carbonExports";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import NCCSection from "../compliance/NCCSection";
import NABERSSection from "../compliance/NABERSSection";
import { ComplianceData } from "../compliance/types";
import GrokComplianceInsights from "../compliance/GrokComplianceInsights";

interface ComplianceTabContentProps {
  nccData: ComplianceData;
  nabersData: ComplianceData;
  materials: MaterialInput[];
  energy: EnergyInput[];
  onRunCheck: () => void;
  isLoading: boolean;
}

const ComplianceTabContent: React.FC<ComplianceTabContentProps> = ({
  nccData,
  nabersData,
  materials,
  energy,
  onRunCheck,
  isLoading
}) => {
  const hasNccData = nccData && typeof nccData.compliant !== 'undefined';
  const hasNabersData = nabersData && typeof nabersData.compliant !== 'undefined';
  
  // State to store Grok analysis results
  const [nccGrokAnalysis, setNccGrokAnalysis] = useState<string | undefined>(nccData?.grokAnalysis);
  const [nabersGrokAnalysis, setNabersGrokAnalysis] = useState<string | undefined>(nabersData?.grokAnalysis);

  // Ensure the compliance data objects have all required properties
  const completeNccData: ComplianceData = {
    compliant: nccData?.compliant || false,
    score: nccData?.score || 0,
    details: nccData?.details || null,
    error: nccData?.error || undefined,
    grokAnalysis: nccGrokAnalysis
  };

  const completeNabersData: ComplianceData = {
    compliant: nabersData?.compliant || false,
    score: nabersData?.score || 0,
    details: nabersData?.details || null,
    error: nabersData?.error || undefined,
    grokAnalysis: nabersGrokAnalysis
  };
  
  // Handle when Grok analysis is complete
  const handleGrokAnalysisComplete = (nccAnalysis: string, nabersAnalysis: string) => {
    setNccGrokAnalysis(nccAnalysis);
    setNabersGrokAnalysis(nabersAnalysis);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Compliance Analysis</h2>
        <Button 
          variant="outline" 
          onClick={onRunCheck}
          disabled={isLoading}
          size="sm"
        >
          <FileCheck className="mr-1 h-4 w-4" />
          Run Compliance Check
        </Button>
      </div>
      
      {(!hasNccData && !hasNabersData && !isLoading) && (
        <Alert className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Compliance Data Available</AlertTitle>
          <AlertDescription>
            Run a compliance check to evaluate your project against the NCC 2025 and NABERS standards.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <NCCSection 
          nccData={completeNccData}
        />
        
        <NABERSSection 
          nabersData={completeNabersData}
        />
      </div>
      
      {/* Add Grok AI Compliance Insights */}
      {(hasNccData || hasNabersData) && (
        <GrokComplianceInsights 
          nccData={completeNccData}
          nabersData={completeNabersData}
          onGrokAnalysisComplete={handleGrokAnalysisComplete}
        />
      )}
    </div>
  );
};

export default ComplianceTabContent;
