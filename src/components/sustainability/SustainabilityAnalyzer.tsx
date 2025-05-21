import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download, Leaf, Shield, BarChart3, Recycle, FileText, TrendingUp } from "lucide-react";
import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { fetchMaterialAlternatives, fetchNabersComplianceCheck, fetchNccComplianceCheck } from "@/hooks/sustainability/sustainabilityService";
import SustainabilityReport from "./SustainabilityReport";
import ComplianceStatus from "./ComplianceStatus";
import SustainabilityImpactChart from "./SustainabilityImpactChart";
import MaterialAlternatives from "./MaterialAlternatives";
import MaterialPerformanceTab from "./MaterialPerformanceTab";
import { MaterialAnalysisResult, generateMaterialAnalysis } from "@/lib/materialCategories";
import { toast } from "sonner";

interface SustainabilityAnalyzerProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  className?: string;
}

const SustainabilityAnalyzer: React.FC<SustainabilityAnalyzerProps> = ({
  calculationInput,
  calculationResult,
  className
}) => {
  const { 
    suggestions,
    prioritySuggestions, 
    report,
    isLoading,
    error
  } = useSustainabilitySuggestions();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [materialAnalysis, setMaterialAnalysis] = useState<MaterialAnalysisResult | null>(null);
  const [nccCompliance, setNccCompliance] = useState<any | null>(null);
  const [nabersCompliance, setNabersCompliance] = useState<any | null>(null);
  const [isLoadingCompliance, setIsLoadingCompliance] = useState(false);
  
  // Use material analysis data from report if available
  React.useEffect(() => {
    if (report?.materialAnalysis) {
      setMaterialAnalysis(report.materialAnalysis);
    }
  }, [report]);
  
  // Function to run compliance checks
  const runComplianceChecks = async () => {
    setIsLoadingCompliance(true);
    
    try {
      // Run NCC compliance check
      const nccResult = await fetchNccComplianceCheck(calculationInput.materials, { includeDetails: true });
      setNccCompliance(nccResult);
      
      // Run NABERS compliance check
      const nabersResult = await fetchNabersComplianceCheck(calculationInput.energy, { targetRating: 5 });
      setNabersCompliance(nabersResult);
      
      toast.success("Compliance check complete", {
        description: "Project analyzed against NCC 2025 and NABERS standards."
      });
    } catch (err) {
      console.error("Error running compliance checks:", err);
      toast.error("Compliance check failed", {
        description: "Could not analyze your project. Please try again later."
      });
    } finally {
      setIsLoadingCompliance(false);
    }
  };
  
  // Run material analysis if needed
  React.useEffect(() => {
    const fetchMaterialsData = async () => {
      if (!materialAnalysis && calculationInput.materials && calculationInput.materials.length > 0) {
        try {
          // Generate material analysis using our utility function
          const analysis = generateMaterialAnalysis(
            calculationInput.materials.map(m => ({
              id: `material-${Math.random().toString(36).substring(7)}`,
              name: m.type,
              carbon_footprint_kgco2e_kg: 
                m.type in calculationResult.breakdownByMaterial 
                  ? calculationResult.breakdownByMaterial[m.type as keyof typeof calculationResult.breakdownByMaterial] || 1 
                  : 1,
              quantity: Number(m.quantity) || 0
            }))
          );
          
          // Get alternatives for each high impact material
          for (const material of analysis.highImpactMaterials) {
            const alternatives = await fetchMaterialAlternatives(material.name, material.quantity);
            if (alternatives && alternatives.length > 0) {
              analysis.alternatives[material.id] = alternatives;
            }
          }
          
          setMaterialAnalysis(analysis);
        } catch (error) {
          console.error("Failed to fetch material analysis:", error);
        }
      }
    };
    
    fetchMaterialsData();
  }, [calculationInput.materials, materialAnalysis, calculationResult.breakdownByMaterial]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Navigate between tabs with animations
  const navigateTab = (direction: "next" | "prev") => {
    const tabs = ["dashboard", "compliance", "materials", "performance", "report"];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (direction === "next" && currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    } else if (direction === "prev" && currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };
  
  return (
    <motion.div 
      className={`space-y-6 ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Leaf className="h-6 w-6 mr-2 text-carbon-600" />
              Sustainability Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive analysis of your project's sustainability performance and compliance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="dashboard" className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Data</span>
                  </TabsTrigger>
                  <TabsTrigger value="compliance" className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Compliance</span>
                    <span className="sm:hidden">Regs</span>
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="flex items-center">
                    <Recycle className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Alternatives</span>
                    <span className="sm:hidden">Alt</span>
                  </TabsTrigger>
                  <TabsTrigger value="performance" className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Performance</span>
                    <span className="sm:hidden">Perf</span>
                  </TabsTrigger>
                  <TabsTrigger value="report" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Report</span>
                    <span className="sm:hidden">Rep</span>
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateTab("prev")}
                    disabled={activeTab === "dashboard"}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigateTab("next")}
                    disabled={activeTab === "report"}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <TabsContent value="dashboard" className="mt-4 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <SustainabilityImpactChart data={materialAnalysis} chartType="bar" />
                  <SustainabilityImpactChart data={materialAnalysis} chartType="radar" />
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Recommendations</CardTitle>
                      <CardDescription>
                        Priority actions to improve sustainability
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {prioritySuggestions && prioritySuggestions.length > 0 ? (
                          prioritySuggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                              <Leaf className="h-5 w-5 text-carbon-600 mr-2 mt-0.5 flex-shrink-0" />
                              <span>{suggestion}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground">No priority recommendations available</li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="compliance" className="mt-4">
                <ComplianceStatus
                  nccData={nccCompliance}
                  nabersData={nabersCompliance}
                  onRunCheck={runComplianceChecks}
                  isLoading={isLoadingCompliance}
                />
              </TabsContent>
              
              <TabsContent value="materials" className="mt-4">
                <MaterialAlternatives
                  materialAnalysis={materialAnalysis}
                  materials={calculationInput.materials}
                />
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <MaterialPerformanceTab
                  materials={calculationInput.materials}
                />
              </TabsContent>
              
              <TabsContent value="report" className="mt-4">
                <SustainabilityReport
                  calculationInput={calculationInput}
                  calculationResult={calculationResult}
                  sustainabilityReport={report}
                  materialAnalysis={materialAnalysis}
                  complianceData={{
                    ncc: nccCompliance,
                    nabers: nabersCompliance
                  }}
                  suggestions={suggestions || []}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default SustainabilityAnalyzer;
