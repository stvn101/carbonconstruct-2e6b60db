
import React from "react";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ComplianceResult } from "@/hooks/useComplianceCheck";

interface NCCTabContentProps {
  result: ComplianceResult;
}

const NCCTabContent: React.FC<NCCTabContentProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          National Construction Code 2025
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </h3>
        {result.nccStatus.compliant ? (
          <Badge variant="outline" className="text-green-600 border-green-600">Compliant</Badge>
        ) : (
          <Badge variant="outline" className="text-red-600 border-red-600">Non-Compliant</Badge>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-medium mb-2">Section J - Energy Efficiency</h4>
          <div className="space-y-2 pl-2">
            <div className="flex justify-between text-xs">
              <span>Thermal Performance</span>
              {result.nccStatus.details.sectionJ?.thermalPerformance ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-600" />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span>Insulation Standards</span>
              {result.nccStatus.details.sectionJ?.insulationStandards ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-600" />
              )}
            </div>
            <div className="flex justify-between text-xs">
              <span>Glazing Requirements</span>
              {result.nccStatus.details.sectionJ?.glazingRequirements ? (
                <CheckCircle className="h-3.5 w-3.5 text-green-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-red-600" />
              )}
            </div>
          </div>
        </div>
        
        <div className="p-3 border rounded-md">
          <div className="flex justify-between mb-2">
            <h4 className="text-xs font-medium">Section F8 - Low Carbon Requirements</h4>
            {result.nccStatus.details.sectionF8?.compliant ? (
              <CheckCircle className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <XCircle className="h-3.5 w-3.5 text-red-600" />
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {result.nccStatus.details.sectionF8?.details}
          </p>
        </div>
        
        <Alert className={result.nccStatus.compliant ? "bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300" : "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300"}>
          <AlertTitle className="text-sm">
            {result.nccStatus.compliant 
              ? "Your project meets NCC 2025 requirements" 
              : "Your project does not meet NCC 2025 requirements"
            }
          </AlertTitle>
          <AlertDescription className="text-xs">
            {result.nccStatus.compliant 
              ? "All necessary sections comply with the updated standards" 
              : "Review the recommendations to achieve compliance before January 1, 2025"
            }
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default NCCTabContent;
