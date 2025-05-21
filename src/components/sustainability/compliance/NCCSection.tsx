
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle, Info } from "lucide-react";
import ComplianceDetails from "./ComplianceDetails";
import ComplianceTip from "./ComplianceTip";
import ComplianceSection from "./ComplianceSection";
import { ComplianceData } from "../types";

interface NCCSectionProps {
  nccData: ComplianceData | null;
}

const NCCSection: React.FC<NCCSectionProps> = ({ nccData }) => {
  const hasNccData = nccData && !nccData.error;
  
  return (
    <ComplianceSection 
      title="NCC 2025" 
      compliant={hasNccData ? nccData.compliant : false}
      badgeText={hasNccData ? (nccData.compliant ? "Compliant" : "Non-Compliant") : "No Data"}
    >
      {hasNccData ? (
        nccData.compliant ? (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertTitle>NCC 2025 Compliant</AlertTitle>
            <AlertDescription className="text-green-700">
              Your project meets the National Construction Code 2025 requirements.
              <ComplianceDetails details={nccData.details} />
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>NCC 2025 Non-Compliant</AlertTitle>
            <AlertDescription>
              Your project does not meet all NCC 2025 requirements. Review the details below.
              <ComplianceDetails details={nccData.details} />
            </AlertDescription>
          </Alert>
        )
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No NCC 2025 compliance data available.
          </AlertDescription>
        </Alert>
      )}
      
      <ComplianceTip>
        The National Construction Code 2025 requires a 20% improvement in thermal performance 
        over 2019 standards. Consider upgrading insulation and glazing to meet these requirements.
      </ComplianceTip>
    </ComplianceSection>
  );
};

export default NCCSection;
