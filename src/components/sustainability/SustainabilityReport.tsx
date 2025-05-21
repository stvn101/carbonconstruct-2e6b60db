
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { MaterialAnalysisResult } from "@/lib/materialCategories";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import SustainabilityImpactChart from "./SustainabilityImpactChart";

export interface SustainabilityReportProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  sustainabilityReport?: any;
  materialAnalysis: MaterialAnalysisResult | null;
  complianceData: {
    ncc: any;
    nabers: any;
  };
  suggestions: string[];
}

const SustainabilityReport: React.FC<SustainabilityReportProps> = ({
  calculationInput,
  calculationResult,
  sustainabilityReport,
  materialAnalysis,
  complianceData,
  suggestions
}) => {
  const handleExportReport = () => {
    // Implementation for exporting report would go here
    console.log("Exporting sustainability report");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sustainability Report</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleExportReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SustainabilityImpactChart data={materialAnalysis} chartType="pie" />
        
        <Card>
          <CardHeader>
            <CardTitle>Project Summary</CardTitle>
            <CardDescription>Key metrics and findings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-semibold">Total Emissions:</div>
              <div>{calculationResult.totalEmissions.toFixed(2)} kg CO₂e</div>
              
              <div className="font-semibold">Material Emissions:</div>
              <div>{calculationResult.materialEmissions.toFixed(2)} kg CO₂e</div>
              
              <div className="font-semibold">Transport Emissions:</div>
              <div>{calculationResult.transportEmissions.toFixed(2)} kg CO₂e</div>
              
              <div className="font-semibold">Energy Emissions:</div>
              <div>{calculationResult.energyEmissions.toFixed(2)} kg CO₂e</div>
              
              {materialAnalysis && (
                <>
                  <div className="font-semibold">Sustainability Score:</div>
                  <div>{materialAnalysis.sustainabilityScore}/100</div>
                  
                  <div className="font-semibold">Sustainable Materials:</div>
                  <div>{materialAnalysis.sustainabilityPercentage}%</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
          <CardDescription>NCC 2025 and NABERS compliance check results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">NCC 2025 Compliance</h3>
              {complianceData.ncc ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="font-medium text-green-700">
                    {complianceData.ncc.compliant ? "Compliant" : "Non-compliant"}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {complianceData.ncc.details || "No detailed information available"}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No compliance data available</div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">NABERS Compliance</h3>
              {complianceData.nabers ? (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="font-medium text-green-700">
                    {complianceData.nabers.rating} Stars
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {complianceData.nabers.details || "No detailed information available"}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">No compliance data available</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Sustainability Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {suggestions && suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0">
                  <div className="h-5 w-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span>{suggestion}</span>
                </li>
              ))
            ) : (
              <li className="text-muted-foreground">No recommendations available</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SustainabilityReport;
