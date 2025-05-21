
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ComplianceResult } from "@/hooks/useComplianceCheck";
import { Grid } from "@/components/ui/grid";
import { useIsMobile } from "@/hooks/use-mobile";

interface OverviewTabContentProps {
  result: ComplianceResult;
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({ result }) => {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Overall Compliance</h3>
        <div className="flex items-center">
          {result.isCompliant ? (
            <CheckCircle className="h-4 w-4 text-green-600 mr-1.5" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600 mr-1.5" />
          )}
          <span className={result.isCompliant ? "text-green-600" : "text-red-600"}>
            {result.isCompliant ? "Compliant" : "Non-Compliant"}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="p-3 border rounded-md">
          <div className="flex justify-between mb-1">
            <h4 className="text-xs font-medium">NCC 2025</h4>
            {result.nccStatus.compliant ? (
              <Badge variant="outline" className="text-green-600 border-green-600">Pass</Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">Fail</Badge>
            )}
          </div>
          <Progress 
            value={result.nccStatus.score} 
            className="h-2"
            indicatorClassName={
              result.nccStatus.score >= 70 ? "bg-green-600" :
              result.nccStatus.score >= 50 ? "bg-amber-600" : "bg-red-600"
            }
          />
        </div>
        
        <div className="p-3 border rounded-md">
          <div className="flex justify-between mb-1">
            <h4 className="text-xs font-medium">NABERS</h4>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full mx-0.5 ${
                    i < result.nabersStatus.rating ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {result.nabersStatus.rating}-star rating
            {result.nabersStatus.compliant ? 
              " (meets requirements)" : 
              " (below 4-star requirement)"
            }
          </div>
        </div>
      </div>
      
      {result.recommendedActions.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-md">
          <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
          <ul className="space-y-1 pl-5">
            {result.recommendedActions.map((action, idx) => (
              <li key={idx} className="text-xs text-muted-foreground list-disc">
                {action}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="text-xs text-right text-muted-foreground pt-2">
        Last checked: {new Date(result.complianceDate).toLocaleString()}
      </div>
    </div>
  );
};

export default OverviewTabContent;
