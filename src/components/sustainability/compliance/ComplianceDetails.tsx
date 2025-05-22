
import React from "react";
import { ComplianceDetailProps } from "./types";

const ComplianceDetail: React.FC<ComplianceDetailProps> = ({ 
  title, 
  details,
  color = "text-carbon-800 dark:text-carbon-200"
}) => {
  return (
    <div className="space-y-2">
      <h4 className={`font-medium ${color}`}>{title}</h4>
      {typeof details === 'string' ? (
        <p className="text-sm">{details}</p>
      ) : typeof details === 'object' && details !== null ? (
        <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
          {JSON.stringify(details, null, 2)}
        </pre>
      ) : (
        <p className="text-sm text-muted-foreground">No details available</p>
      )}
    </div>
  );
};

export default ComplianceDetail;
