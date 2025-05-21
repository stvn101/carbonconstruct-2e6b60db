
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { ComplianceStatusProps } from "./types";
import NCCSection from "./NCCSection";
import NABERSSection from "./NABERSSection";
import EmptyState from "./EmptyState";

const ComplianceStatus: React.FC<ComplianceStatusProps> = ({
  nccData,
  nabersData,
  onRunCheck,
  isLoading = false,
  className
}) => {
  const hasNccData = nccData && !nccData.error;
  const hasNabersData = nabersData && !nabersData.error;

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
          <EmptyState onRunCheck={onRunCheck} isLoading={isLoading} />
        ) : (
          <div className="space-y-6">
            {/* NCC 2025 Compliance */}
            <NCCSection nccData={nccData} />
            
            {/* NABERS Compliance */}
            <NABERSSection nabersData={nabersData} />
            
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
