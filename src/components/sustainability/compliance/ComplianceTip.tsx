
import React from "react";
import { Lightbulb } from "lucide-react";
import { ComplianceTipProps } from "./types";

const ComplianceTip: React.FC<ComplianceTipProps> = ({ children }) => {
  return (
    <div className="mt-3 bg-muted p-3 rounded-md">
      <div className="flex items-start">
        <Lightbulb className="h-4 w-4 text-carbon-600 mr-2 mt-0.5" />
        <div>
          <span className="font-medium text-sm">Tip: </span>
          <span className="text-sm">{children}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceTip;
