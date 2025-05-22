
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { useSustainabilitySuggestions } from "@/hooks/useSustainabilitySuggestions";
import { useMaterialAnalysis } from "@/hooks/sustainability/useMaterialAnalysis";
import { useComplianceChecks } from "@/hooks/sustainability/useComplianceChecks";
import { SustainabilityAnalyzerProps } from "./types";
import { MaterialAnalysisResult } from "./compliance/types";

// Import tab content components
import TabNavigation from "./TabNavigation";
import DashboardTabContent from "./tabs/DashboardTabContent";
import ComplianceTabContent from "./tabs/ComplianceTabContent";
import MaterialsTabContent from "./tabs/MaterialsTabContent";
import PerformanceTabContent from "./tabs/PerformanceTabContent";
import ReportTabContent from "./tabs/ReportTabContent";

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
  
  // Use extracted hooks
  const { 
    materialAnalysis,
    setMaterialAnalysis
  } = useMaterialAnalysis(
    calculationInput.materials, 
    calculationResult.breakdownByMaterial
  );
  
  const {
    nccCompliance,
    nabersCompliance,
    isLoadingCompliance,
    runComplianceChecks
  } = useComplianceChecks();

  // Convert suggestion objects to strings when needed
  const convertSuggestionsToStrings = (suggestions: any[] | undefined): string[] => {
    if (!suggestions || suggestions.length === 0) return [];
    return suggestions.map(s => typeof s === 'string' ? s : (s.description || s.title || ''));
  };

  // Use material analysis data from report if available
  React.useEffect(() => {
    if (report?.materialAnalysis) {
      const defaultAnalysis: MaterialAnalysisResult = {
        materialScores: {},
        impactSummary: "",
        highImpactMaterials: [],
        sustainabilityScore: 0,
        sustainabilityPercentage: 0,
        recommendations: [],
        alternatives: {},
        sustainabilityIssues: []
      };
      
      setMaterialAnalysis({
        ...defaultAnalysis,
        ...report.materialAnalysis
      });
    }
  }, [report, setMaterialAnalysis]);
  
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

  // Run compliance checks when needed
  const handleRunComplianceChecks = () => {
    runComplianceChecks(calculationInput.materials, calculationInput.energy);
  };
  
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

  // Ensure we have complete material analysis data with all required fields
  const completeAnalysis: MaterialAnalysisResult = {
    materialScores: materialAnalysis?.materialScores || {},
    impactSummary: materialAnalysis?.impactSummary || "",
    highImpactMaterials: materialAnalysis?.highImpactMaterials || [],
    sustainabilityScore: materialAnalysis?.sustainabilityScore || 0,
    sustainabilityPercentage: materialAnalysis?.sustainabilityPercentage || 0,
    recommendations: materialAnalysis?.recommendations || [],
    alternatives: materialAnalysis?.alternatives || {},
    sustainabilityIssues: materialAnalysis?.sustainabilityIssues || [],
    categories: materialAnalysis?.categories,
    materialCount: materialAnalysis?.materialCount,
    sustainabilityStrengths: materialAnalysis?.sustainabilityStrengths,
    averageCarbonFootprint: materialAnalysis?.averageCarbonFootprint,
    materialWithHighestFootprint: materialAnalysis?.materialWithHighestFootprint
  };
  
  const suggestionStrings = convertSuggestionsToStrings(suggestions);
  const priorityStrings = convertSuggestionsToStrings(prioritySuggestions);
  
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
              <TabNavigation 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                navigateTab={navigateTab}
              />
              
              <TabsContent value="dashboard">
                <DashboardTabContent 
                  materialAnalysis={completeAnalysis}
                  prioritySuggestions={priorityStrings}
                />
              </TabsContent>
              
              <TabsContent value="compliance">
                <ComplianceTabContent
                  nccData={nccCompliance}
                  nabersData={nabersCompliance}
                  materials={calculationInput.materials}
                  energy={calculationInput.energy}
                  onRunCheck={handleRunComplianceChecks}
                  isLoading={isLoadingCompliance}
                />
              </TabsContent>
              
              <TabsContent value="materials">
                <MaterialsTabContent
                  materialAnalysis={completeAnalysis}
                  materials={calculationInput.materials}
                />
              </TabsContent>
              
              <TabsContent value="performance">
                <PerformanceTabContent
                  materials={calculationInput.materials}
                />
              </TabsContent>
              
              <TabsContent value="report">
                <ReportTabContent
                  calculationInput={calculationInput}
                  calculationResult={calculationResult}
                  sustainabilityReport={report}
                  materialAnalysis={completeAnalysis}
                  complianceData={{
                    ncc: nccCompliance,
                    nabers: nabersCompliance
                  }}
                  suggestions={suggestionStrings}
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
