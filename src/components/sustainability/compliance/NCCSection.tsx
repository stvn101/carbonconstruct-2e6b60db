
import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface NCCSectionProps {
  nccData: {
    compliant: boolean;
    score: number;
    details?: any;
    error?: string;
  } | null;
}

const NCCSection: React.FC<NCCSectionProps> = ({ nccData }) => {
  if (!nccData) return null;
  
  if (nccData.error) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">NCC 2025</h3>
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{nccData.error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">NCC 2025 Compliance</h3>
        <div className="flex items-center">
          {nccData.compliant ? (
            <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Pass
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Fail
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>Compliance Score</span>
          <span className="font-medium">{nccData.score}/100</span>
        </div>
        <Progress 
          value={nccData.score} 
          className="h-2" 
          indicatorClassName={
            nccData.score >= 70 ? "bg-green-600" : 
            nccData.score >= 50 ? "bg-amber-500" : 
            "bg-red-600"
          }
        />
      </div>
      
      {nccData.details && (
        <div className="space-y-3">
          {/* Section J details */}
          {nccData.details.sectionJ && (
            <div className="p-3 border rounded-md space-y-2">
              <h4 className="text-xs font-medium">Section J (Energy Efficiency)</h4>
              <ul className="space-y-1">
                <li className="flex justify-between items-center text-xs">
                  <span>Thermal Performance</span>
                  {nccData.details.sectionJ.thermalPerformance ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                </li>
                <li className="flex justify-between items-center text-xs">
                  <span>Insulation Standards</span>
                  {nccData.details.sectionJ.insulationStandards ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                </li>
                <li className="flex justify-between items-center text-xs">
                  <span>Glazing Requirements</span>
                  {nccData.details.sectionJ.glazingRequirements ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-600" />
                  )}
                </li>
              </ul>
            </div>
          )}
          
          {/* Section F8 details */}
          {nccData.details.sectionF8 && (
            <div className="p-3 border rounded-md space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-medium">Section F8 (Material Sustainability)</h4>
                {nccData.details.sectionF8.compliant ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <XCircle className="h-3 w-3 text-red-600" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {nccData.details.sectionF8.details}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Grok AI Analysis */}
      {nccData.grokAnalysis && (
        <div className="p-3 border border-carbon-200 dark:border-carbon-700 rounded-md bg-carbon-50 dark:bg-carbon-900/50 mt-2">
          <h4 className="text-xs font-medium mb-1">Grok AI Analysis</h4>
          <p className="text-xs text-muted-foreground whitespace-pre-line">
            {typeof nccData.grokAnalysis === 'string' 
              ? nccData.grokAnalysis.substring(0, 300) + (nccData.grokAnalysis.length > 300 ? '...' : '')
              : 'Analysis available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NCCSection;
