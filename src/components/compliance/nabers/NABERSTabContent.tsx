
import React from "react";
import { HelpCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ComplianceResult } from "@/hooks/useComplianceCheck";

interface NABERSTabContentProps {
  result: ComplianceResult;
}

const NABERSTabContent: React.FC<NABERSTabContentProps> = ({ result }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          NABERS Rating Assessment
          <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium">Rating:</span>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={i}
                className={`w-3 h-3 rounded-full mx-0.5 ${
                  i < result.nabersStatus.rating ? "bg-green-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-medium mb-2">Current Compliance Elements</h4>
          {result.nabersStatus.requirements.current.length > 0 ? (
            <ul className="space-y-1 pl-5">
              {result.nabersStatus.requirements.current.map((item, idx) => (
                <li key={idx} className="text-xs text-muted-foreground list-disc">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No compliance elements found
            </p>
          )}
        </div>
        
        <div className="p-3 border rounded-md">
          <h4 className="text-xs font-medium mb-2">Missing Requirements</h4>
          {result.nabersStatus.requirements.missing.length > 0 ? (
            <ul className="space-y-1 pl-5">
              {result.nabersStatus.requirements.missing.map((item, idx) => (
                <li key={idx} className="text-xs text-muted-foreground list-disc">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              All requirements met
            </p>
          )}
        </div>
      </div>
      
      <Alert className={result.nabersStatus.compliant ? "bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300" : "bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-300"}>
        <AlertTitle className="text-sm">
          {result.nabersStatus.compliant 
            ? `Your project achieves a ${result.nabersStatus.rating}-star NABERS rating` 
            : `Your project achieves a ${result.nabersStatus.rating}-star NABERS rating (minimum 4-star required)`
          }
        </AlertTitle>
        <AlertDescription className="text-xs">
          {result.nabersStatus.compliant 
            ? "This meets the updated NABERS requirements effective January 1, 2025" 
            : "Implement the recommended actions to achieve at least a 4-star rating before January 1, 2025"
          }
        </AlertDescription>
      </Alert>
      
      <div className="text-xs text-muted-foreground p-3 border rounded-md bg-muted/20">
        <p className="mb-1 font-medium">About the NABERS Rating</p>
        <p>
          NABERS (National Australian Built Environment Rating System) measures 
          the environmental performance of buildings. A higher star rating indicates 
          better performance. From January 2025, a minimum 4-star rating is required 
          for compliance.
        </p>
      </div>
    </div>
  );
};

export default NABERSTabContent;
