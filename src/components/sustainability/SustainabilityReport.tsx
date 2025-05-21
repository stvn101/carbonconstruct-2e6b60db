
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Printer, Share2 } from "lucide-react";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { SustainabilityAnalysisOptions } from "@/hooks/sustainability/types";
import { MaterialAnalysisResult } from "supabase/functions/get-sustainability-suggestions/Material";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SustainabilityImpactChart from "./SustainabilityImpactChart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SustainabilityReportProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  sustainabilityReport: any;
  materialAnalysis?: MaterialAnalysisResult | null;
  complianceData?: any;
  suggestions?: string[];
  className?: string;
}

const SustainabilityReport: React.FC<SustainabilityReportProps> = ({
  calculationInput,
  calculationResult,
  sustainabilityReport,
  materialAnalysis,
  complianceData,
  suggestions = [],
  className
}) => {
  // Function to export report as PDF
  const handleExportPDF = async () => {
    try {
      // Use dynamic import to load PDF generation utility
      const { exportSustainabilityReport } = await import('@/utils/reportExportUtils');
      await exportSustainabilityReport({
        calculationInput,
        calculationResult,
        sustainabilityReport,
        materialAnalysis,
        complianceData,
        suggestions,
        filename: 'sustainability-report.pdf'
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
    }
  };

  // Function to export report as CSV
  const handleExportCSV = async () => {
    try {
      // Use dynamic import to load CSV generation utility
      const { exportSustainabilityCSV } = await import('@/utils/reportExportUtils');
      await exportSustainabilityCSV({
        calculationResult,
        materialAnalysis,
        suggestions,
        filename: 'sustainability-data.csv'
      });
    } catch (error) {
      console.error("Failed to export CSV:", error);
    }
  };

  // Function to print report
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className={`print:shadow-none ${className}`}>
      <CardHeader className="print:pb-0">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl print:text-3xl">Sustainability Report</CardTitle>
            <CardDescription className="print:text-base">
              Comprehensive analysis of your project's sustainability performance
            </CardDescription>
          </div>
          <div className="print:hidden flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <FileText className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button size="sm" onClick={handleExportPDF} className="bg-carbon-600 hover:bg-carbon-700 text-white">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary">
          <TabsList className="print:hidden">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6 space-y-6 print:mt-0">
            {/* Summary Section */}
            <div className="bg-carbon-50 dark:bg-carbon-900 p-4 rounded-lg border border-carbon-100 dark:border-carbon-800">
              <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Carbon Emissions</p>
                  <p className="text-xl font-bold">{calculationResult.totalEmissions.toFixed(2)} kg CO2e</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sustainability Score</p>
                  <p className="text-xl font-bold flex items-center">
                    {materialAnalysis?.sustainabilityScore || '—'}/100
                    {materialAnalysis?.sustainabilityScore && (
                      <Badge className={`ml-2 ${materialAnalysis.sustainabilityScore > 70 ? 'bg-green-500' : materialAnalysis.sustainabilityScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                        {materialAnalysis.sustainabilityScore > 70 ? 'Good' : materialAnalysis.sustainabilityScore > 40 ? 'Average' : 'Needs Improvement'}
                      </Badge>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sustainable Materials</p>
                  <p className="text-xl font-bold">
                    {materialAnalysis?.sustainabilityPercentage 
                      ? `${materialAnalysis.sustainabilityPercentage.toFixed(1)}%` 
                      : '—'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">High Impact Materials</p>
                  <p className="text-xl font-bold">
                    {materialAnalysis?.highImpactMaterials?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Key Findings */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-1">
                {sustainabilityReport?.keyFindings?.map((finding: string, index: number) => (
                  <li key={index}>{finding}</li>
                )) || (
                  <li>No specific findings available in this report.</li>
                )}
              </ul>
            </div>
            
            {/* Material Breakdown */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Material Breakdown</h3>
              {materialAnalysis?.highImpactMaterials && materialAnalysis.highImpactMaterials.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Material</th>
                        <th className="p-2 text-right">Quantity</th>
                        <th className="p-2 text-right">Carbon Footprint</th>
                        <th className="p-2 text-right">Total Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materialAnalysis.highImpactMaterials.map((material, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-transparent' : 'bg-muted/50'}>
                          <td className="p-2">{material.name}</td>
                          <td className="p-2 text-right">{material.quantity || 0} {material.unit || 'kg'}</td>
                          <td className="p-2 text-right">{material.carbonFootprint.toFixed(2)} kg CO2e/{material.unit || 'kg'}</td>
                          <td className="p-2 text-right">{((material.quantity || 0) * material.carbonFootprint).toFixed(2)} kg CO2e</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">No specific material breakdown available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="mt-6 space-y-6">
            {/* Compliance Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Status</h3>
              {complianceData ? (
                <div className="space-y-4">
                  {/* NCC 2025 Compliance */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      NCC 2025 Compliance
                      <Badge className={`ml-2 ${complianceData.ncc?.compliant ? 'bg-green-500' : 'bg-red-500'}`}>
                        {complianceData.ncc?.compliant ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </h4>
                    {complianceData.ncc?.details ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {Object.entries(complianceData.ncc.details).map(([key, value]: [string, any]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value.toString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific compliance details available.</p>
                    )}
                  </div>
                  
                  {/* NABERS Compliance */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center">
                      NABERS Rating
                      <Badge className={`ml-2 ${
                        (complianceData.nabers?.rating || 0) >= 5 ? 'bg-green-500' : 
                        (complianceData.nabers?.rating || 0) >= 3.5 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}>
                        {complianceData.nabers?.rating || 0} Stars
                      </Badge>
                    </h4>
                    {complianceData.nabers?.details ? (
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        {Object.entries(complianceData.nabers.details).map(([key, value]: [string, any]) => (
                          <li key={key}>
                            <span className="font-medium">{key}:</span> {value.toString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground">No specific NABERS details available.</p>
                    )}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertTitle>Compliance data not available</AlertTitle>
                  <AlertDescription>
                    Run a compliance check to get detailed information on NCC 2025 and NABERS compliance.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            {/* Compliance Documentation */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Compliance Documentation</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">NCC 2025 Requirements</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The National Construction Code (NCC) 2025 has specific requirements for energy efficiency and sustainability:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Requires 20% improvement in thermal performance over 2019 standards</li>
                    <li>Mandates minimum R-values for insulation in various climate zones</li>
                    <li>Sets new standards for glazing performance (SHGC and U-values)</li>
                    <li>Requires air leakage testing for residential buildings</li>
                    <li>Enhanced requirements for building sealing</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">NABERS Requirements</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The National Australian Built Environment Rating System (NABERS) 2025 update includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Revised 5-star rating criteria with emphasis on renewable energy integration</li>
                    <li>Enhanced requirements for energy efficiency in new buildings</li>
                    <li>Mandatory disclosure of NABERS ratings for certain building types</li>
                    <li>Integration with Green Star and other rating systems</li>
                    <li>Focus on embodied carbon measurement and reduction</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6 space-y-6">
            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Improvement Recommendations</h3>
              {suggestions && suggestions.length > 0 ? (
                <div className="space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-muted-foreground">No specific recommendations available.</p>
              )}
            </div>
            
            {/* Alternative Materials */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Alternative Materials</h3>
              {materialAnalysis?.alternatives && Object.keys(materialAnalysis.alternatives).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(materialAnalysis.alternatives).map(([materialId, alternatives]: [string, any]) => {
                    const material = materialAnalysis.highImpactMaterials.find(m => m.id === materialId);
                    if (!material || !alternatives.length) return null;
                    
                    return (
                      <div key={materialId} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Alternatives for {material.name}</h4>
                        <table className="w-full">
                          <thead className="bg-muted">
                            <tr>
                              <th className="p-2 text-left">Alternative</th>
                              <th className="p-2 text-right">Carbon Reduction</th>
                              <th className="p-2 text-right">Sustainability Score</th>
                              <th className="p-2 text-right">Cost Difference</th>
                            </tr>
                          </thead>
                          <tbody>
                            {alternatives.map((alt: any, index: number) => (
                              <tr key={index} className={index % 2 === 0 ? 'bg-transparent' : 'bg-muted/50'}>
                                <td className="p-2">{alt.name}</td>
                                <td className="p-2 text-right">{alt.carbonReduction}%</td>
                                <td className="p-2 text-right">{alt.sustainabilityScore}/100</td>
                                <td className="p-2 text-right">{alt.costDifference || 0}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No alternative materials data available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="charts" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SustainabilityImpactChart data={materialAnalysis} chartType="bar" />
              <SustainabilityImpactChart data={materialAnalysis} chartType="radar" />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 print:pt-2">
        <div className="text-xs text-muted-foreground">
          <p>Generated on {new Date().toLocaleDateString()} by CarbonConstruct</p>
          <p>Compliant with Australian NCC 2025 and NABERS standards for sustainability reporting</p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SustainabilityReport;
