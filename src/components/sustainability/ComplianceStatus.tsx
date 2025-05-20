
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldX, Lightbulb, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplianceStatusProps {
  nccData: any;
  nabersData: any;
  onRunCheck?: () => void;
  isLoading?: boolean;
  className?: string;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  nccData,
  nabersData,
  onRunCheck,
  isLoading = false,
  className
}) => {
  const hasNccData = nccData && !nccData.error;
  const hasNabersData = nabersData && !nabersData.error;
  
  // Helper function to render compliance details
  const renderDetails = (details: Record<string, any> | null | undefined) => {
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

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2 text-carbon-600" />
          Compliance Status
        </CardTitle>
        <CardDescription>
          NCC 2025 and NABERS compliance information for your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!hasNccData && !hasNabersData) ? (
          <div className="text-center py-4">
            <ShieldX className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-medium mb-1">No Compliance Data</h3>
            <p className="text-muted-foreground mb-4">
              Run a compliance check to analyze your project against NCC 2025 and NABERS standards.
            </p>
            <Button 
              onClick={onRunCheck} 
              disabled={isLoading || !onRunCheck}
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
            >
              {isLoading ? 'Checking...' : 'Run Compliance Check'}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* NCC 2025 Compliance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">NCC 2025</h3>
                {hasNccData ? (
                  <Badge className={nccData.compliant ? "bg-green-500" : "bg-red-500"}>
                    {nccData.compliant ? "Compliant" : "Non-Compliant"}
                  </Badge>
                ) : (
                  <Badge variant="outline">No Data</Badge>
                )}
              </div>
              
              {hasNccData ? (
                nccData.compliant ? (
                  <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                    <Shield className="h-4 w-4 text-green-600" />
                    <AlertTitle>NCC 2025 Compliant</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your project meets the National Construction Code 2025 requirements.
                      {renderDetails(nccData.details)}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>NCC 2025 Non-Compliant</AlertTitle>
                    <AlertDescription>
                      Your project does not meet all NCC 2025 requirements. Review the details below.
                      {renderDetails(nccData.details)}
                    </AlertDescription>
                  </Alert>
                )
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No NCC 2025 compliance data available.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* NCC Tips */}
              <div className="mt-3 bg-muted p-3 rounded-md">
                <div className="flex items-start">
                  <Lightbulb className="h-4 w-4 text-carbon-600 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium text-sm">NCC 2025 Tip: </span>
                    <span className="text-sm">
                      The National Construction Code 2025 requires a 20% improvement in thermal performance 
                      over 2019 standards. Consider upgrading insulation and glazing to meet these requirements.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* NABERS Compliance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">NABERS Rating</h3>
                {hasNabersData ? (
                  <Badge className={
                    nabersData.rating >= 5 ? "bg-green-500" : 
                    nabersData.rating >= 4 ? "bg-green-400" :
                    nabersData.rating >= 3 ? "bg-yellow-500" :
                    "bg-red-500"
                  }>
                    {nabersData.rating} Stars
                  </Badge>
                ) : (
                  <Badge variant="outline">No Data</Badge>
                )}
              </div>
              
              {hasNabersData ? (
                <div>
                  <Alert 
                    variant={nabersData.rating >= 4 ? "default" : "warning"} 
                    className={nabersData.rating >= 4 ? "bg-green-50 text-green-800 border-green-200" : ""}
                  >
                    {nabersData.rating >= 4 ? (
                      <Shield className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <AlertTitle>NABERS {nabersData.rating} Star Rating</AlertTitle>
                    <AlertDescription className={nabersData.rating >= 4 ? "text-green-700" : ""}>
                      {nabersData.rating >= 4 
                        ? `Excellent! Your project achieves a ${nabersData.rating} star NABERS rating.`
                        : `Your project currently achieves a ${nabersData.rating} star NABERS rating. Consider improvements to achieve 5 stars.`
                      }
                      {renderDetails(nabersData.details)}
                    </AlertDescription>
                  </Alert>
                  
                  {/* NABERS Tips */}
                  <div className="mt-3 bg-muted p-3 rounded-md">
                    <div className="flex items-start">
                      <Lightbulb className="h-4 w-4 text-carbon-600 mr-2 mt-0.5" />
                      <div>
                        <span className="font-medium text-sm">NABERS Tip: </span>
                        <span className="text-sm">
                          {nabersData.rating < 5 
                            ? "Consider integrating renewable energy sources to improve your NABERS rating. The 2025 criteria emphasize on-site renewable generation."
                            : "Maintain your excellent NABERS rating by regularly monitoring energy usage and continuing sustainable practices."
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    No NABERS rating data available.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Run check button */}
            {onRunCheck && (
              <div className="flex justify-end">
                <Button 
                  onClick={onRunCheck} 
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                >
                  {isLoading ? 'Checking...' : 'Re-Run Check'}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplianceStatus;
