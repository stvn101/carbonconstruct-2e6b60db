
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { ComplianceTipProps } from "./types";

const ComplianceTip: React.FC<ComplianceTipProps> = ({ tip, category, children }) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
      <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-300" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        {children || tip}
        {category && <span className="text-xs block mt-1 opacity-70">Category: {category}</span>}
      </AlertDescription>
    </Alert>
  );
};

export default ComplianceTip;
