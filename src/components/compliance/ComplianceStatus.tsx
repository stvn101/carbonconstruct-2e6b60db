
import React, { useState, useEffect } from "react";
import { useComplianceCheck } from "@/hooks/useComplianceCheck";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, HelpCircle, Shield, XCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceResult } from "@/hooks/useComplianceCheck";

interface ComplianceStatusProps {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  onComplianceResult?: (result: ComplianceResult | null) => void;
}

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  materials,
  transport,
  energy,
  onComplianceResult
}) => {
  const { result, isLoading, error, checkCompliance } = useComplianceCheck();
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    if (materials.length > 0) {
      runComplianceCheck();
    }
  }, [materials, transport, energy]);

  useEffect(() => {
    if (result && onComplianceResult) {
      onComplianceResult(result);
    }
  }, [result, onComplianceResult]);

  const runComplianceCheck = async () => {
    await checkCompliance(materials, transport, energy, { includeDetailedReport: true });
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3">
          <CardTitle>Checking Compliance</CardTitle>
          <CardDescription>Verifying against NCC 2025 and NABERS standards</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={45} className="mb-4" />
          <p className="text-sm text-muted-foreground">
            Processing project inputs to determine compliance status...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Compliance Check Failed</AlertTitle>
        <AlertDescription>
          {error}
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={runComplianceCheck}>
              Retry Check
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-carbon-600" />
            Compliance Check
          </CardTitle>
          <CardDescription>
            Verify if your project meets NCC 2025 and NABERS requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <Button onClick={runComplianceCheck}>
              Run Compliance Check
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-carbon-600" />
            <CardTitle>Compliance Status</CardTitle>
          </div>
          <Badge className={result.isCompliant ? "bg-green-600" : "bg-red-600"}>
            {result.isCompliant ? "Compliant" : "Non-Compliant"}
          </Badge>
        </div>
        <CardDescription>
          Based on NCC 2025 and NABERS standards, effective January 1, 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="ncc" className="flex-1">NCC 2025</TabsTrigger>
            <TabsTrigger value="nabers" className="flex-1">NABERS</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
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
              
              <div className="grid grid-cols-2 gap-4">
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
          </TabsContent>
          
          <TabsContent value="ncc" className="pt-4">
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
          </TabsContent>
          
          <TabsContent value="nabers" className="pt-4">
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
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t flex justify-between">
          <Button variant="outline" size="sm" onClick={runComplianceCheck}>
            Re-check Compliance
          </Button>
          <div className="text-xs text-muted-foreground flex items-center">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Based on January 1, 2025 standards
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceStatus;
