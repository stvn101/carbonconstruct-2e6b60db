
import React, { useState, useEffect } from "react";
import { useComplianceCheck } from "@/hooks/useComplianceCheck";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComplianceResult } from "@/hooks/useComplianceCheck";
import { useIsMobile } from "@/hooks/use-mobile";
import { withNetworkErrorHandling } from "@/utils/errorHandling";

// Import component parts
import LoadingState from "./loading/LoadingState";
import ErrorState from "./error/ErrorState";
import EmptyState from "./empty/EmptyState";
import OverviewTabContent from "./overview/OverviewTabContent";
import NCCTabContent from "./ncc/NCCTabContent";
import NABERSTabContent from "./nabers/NABERSTabContent";

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
  const { isMobile } = useIsMobile();

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
    try {
      // Create the promise first, then pass it to withNetworkErrorHandling
      const compliancePromise = checkCompliance(materials, transport, energy, { includeDetailedReport: true });
      
      // Now pass the promise directly to withNetworkErrorHandling
      await withNetworkErrorHandling(
        compliancePromise,
        10000, // 10 second timeout
        2 // Max 2 retries
      );
    } catch (err) {
      // Error handling is done inside the hook
      console.error("Error in compliance check:", err);
    }
  };

  // Show appropriate state based on data status
  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={runComplianceCheck} />;
  }

  if (!result) {
    return <EmptyState onRunCheck={runComplianceCheck} />;
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
          <TabsList className="w-full mb-2">
            <TabsTrigger value="overview" className="flex-1">
              {isMobile ? "Overview" : "Overview"}
            </TabsTrigger>
            <TabsTrigger value="ncc" className="flex-1">
              {isMobile ? "NCC" : "NCC 2025"}
            </TabsTrigger>
            <TabsTrigger value="nabers" className="flex-1">
              {isMobile ? "NABERS" : "NABERS"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="pt-4">
            <OverviewTabContent result={result} />
          </TabsContent>
          
          <TabsContent value="ncc" className="pt-4">
            <NCCTabContent result={result} />
          </TabsContent>
          
          <TabsContent value="nabers" className="pt-4">
            <NABERSTabContent result={result} />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
          <Button variant="outline" size="sm" onClick={runComplianceCheck} className="w-full sm:w-auto">
            Re-check Compliance
          </Button>
          <div className="text-xs text-muted-foreground flex items-center justify-center">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Based on January 1, 2025 standards
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplianceStatus;
