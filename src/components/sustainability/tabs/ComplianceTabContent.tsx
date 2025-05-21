
import React from "react";
import ComplianceStatus from "../compliance/ComplianceStatus";
import { ComplianceData } from "../types";
import { MaterialInput } from "@/lib/carbonExports";

interface ComplianceTabContentProps {
  nccData: ComplianceData | null;
  nabersData: ComplianceData | null;
  materials?: MaterialInput[];
  energy?: any;
  onRunCheck: () => void;
  isLoading: boolean;
}

const ComplianceTabContent: React.FC<ComplianceTabContentProps> = ({
  nccData,
  nabersData,
  onRunCheck,
  isLoading
}) => {
  return (
    <div className="mt-4">
      <ComplianceStatus
        nccData={nccData}
        nabersData={nabersData}
        onRunCheck={onRunCheck}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ComplianceTabContent;
