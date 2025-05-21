
import React from "react";
import ComplianceStatus from "./compliance/ComplianceStatus";
import { ComplianceStatusProps } from "./compliance/types";

// Re-export the component with the same props to maintain backward compatibility
const ComplianceStatusWrapper: React.FC<ComplianceStatusProps> = (props) => {
  return <ComplianceStatus {...props} />;
};

export default ComplianceStatusWrapper;
