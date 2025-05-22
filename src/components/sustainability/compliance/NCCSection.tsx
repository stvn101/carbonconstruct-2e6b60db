
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check, AlertCircle, Shield } from "lucide-react";
import { ComplianceData, NCCSectionProps } from "./types";

const NCCSection: React.FC<NCCSectionProps> = ({ nccData }) => {
  if (!nccData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="h-5 w-5 mr-2" />
            NCC 2025 Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No compliance data available.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (nccData.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Shield className="h-5 w-5 mr-2" />
            NCC 2025 Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {nccData.error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  const getBadgeVariant = (compliant: boolean) => {
    return compliant ? "success" : "destructive";
  };
  
  const getBadgeText = (compliant: boolean) => {
    return compliant ? "Compliant" : "Non-Compliant";
  };

  const formatComplianceScore = (score?: number) => {
    if (typeof score !== 'number') return 'N/A';
    return `${score.toFixed(1)}/10`;
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-lg">
          <Shield className="h-5 w-5 mr-2" />
          NCC 2025 Compliance
        </CardTitle>
        <Badge variant={getBadgeVariant(nccData.compliant)}>
          {getBadgeText(nccData.compliant)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm">Compliance Score:</span>
          <span className="font-medium">{formatComplianceScore(nccData.score)}</span>
        </div>

        {/* Show details if available */}
        {nccData.details && (
          <div>
            <h4 className="font-medium mb-2">Compliance Details</h4>
            <div className="text-sm space-y-2">
              {typeof nccData.details === 'string' ? (
                <p>{nccData.details}</p>
              ) : (
                <pre className="p-2 bg-muted rounded-md overflow-x-auto text-xs">
                  {JSON.stringify(nccData.details, null, 2)}
                </pre>
              )}
            </div>
          </div>
        )}
        
        {/* Grok AI Analysis */}
        {nccData.grokAnalysis && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Compliance Analysis</h4>
            <div className="text-sm p-2 bg-muted rounded-md">
              <p>{nccData.grokAnalysis}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NCCSection;
