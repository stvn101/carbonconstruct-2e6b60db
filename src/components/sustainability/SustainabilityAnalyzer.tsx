
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Leaf } from "lucide-react";
import { SustainabilityAnalyzerProps } from "./types";
import TabNavigation from "./TabNavigation";
import DashboardTabContent from "./tabs/DashboardTabContent";
import ComplianceTabContent from "./tabs/ComplianceTabContent";
import MaterialsTabContent from "./tabs/MaterialsTabContent";
import PerformanceTabContent from "./tabs/PerformanceTabContent";
import ReportTabContent from "./tabs/ReportTabContent";
import { containerVariants, itemVariants } from "./animations/sustainabilityAnimations";
import { useSustainabilityAnalyzer } from "@/hooks/sustainability/useSustainabilityAnalyzer";

const SustainabilityAnalyzer: React.FC<SustainabilityAnalyzerProps> = ({
  calculationInput,
  calculationResult,
  className
}) => {
  const {
    activeTab,
    setActiveTab,
    navigateTab,
    completeAnalysis,
    handleRunComplianceChecks,
    isLoadingCompliance,
    nccCompliance,
    nabersCompliance,
    priorityStrings,
    suggestionStrings,
    report
  } = useSustainabilityAnalyzer({
    calculationInput,
    calculationResult
  });
  
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
