
import React from "react";
import { Info } from "lucide-react";
import { ComplianceDetailProps } from "./types";

const ComplianceDetails: React.FC<ComplianceDetailProps> = ({ details }) => {
  if (!details) return <p className="text-muted-foreground text-sm">No detailed information available.</p>;
  
  return (
    <ul className="space-y-2 mt-2">
      {Object.entries(details).map(([key, value]) => (
        <li key={key} className="flex items-start">
          <Info className="h-4 w-4 mr-2 mt-0.5 text-carbon-500" />
          <div>
            <span className="font-medium">{key}: </span>
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ComplianceDetails;
