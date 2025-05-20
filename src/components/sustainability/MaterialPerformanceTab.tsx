
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMaterialPerformance } from "@/hooks/useMaterialPerformance";
import MaterialPerformanceChart from "./MaterialPerformanceChart";
import MaterialRecommendations from "./MaterialRecommendations";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/contexts/ProjectContext"; // Fixed: useProject → useProjects
import { ArrowUpDown, BarChart4, LineChart, PieChart } from "lucide-react";
import { formatCarbon } from "@/lib/formatters";

interface MaterialPerformanceTabProps {
  materials: any[];
  className?: string;
}

const MaterialPerformanceTab: React.FC<MaterialPerformanceTabProps> = ({ materials, className }) => {
  const [activeTab, setActiveTab] = React.useState("trends");
  const [selectedMaterial, setSelectedMaterial] = React.useState<string | null>(null);
  const [chartType, setChartType] = React.useState<'line' | 'area'>('line');
  const { projectId } = useProjects(); // This uses the projectId from useProjects
  
  // Find the default material (one with highest quantity)
  React.useEffect(() => {
    if (materials.length > 0 && !selectedMaterial) {
      // Sort by quantity and select the first one
      const sortedMaterials = [...materials].sort(
        (a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0)
      );
      setSelectedMaterial(sortedMaterials[0].type);
    }
  }, [materials, selectedMaterial]);
  
  // Use the material performance hook
  const {
    performanceData,
    trends,
    recommendations,
    topMaterials,
    isTrackingPaused,
    isLoading,
    trackPerformanceNow,
    toggleTracking,
    getTrendForMaterial
  } = useMaterialPerformance({
    materials,
    projectId,
    autoTrack: true
  });
  
  // Get trend data for the selected material
  const selectedTrendData = selectedMaterial ? 
    trends[selectedMaterial] : null;
  
  // Fetch trend data when selected material changes
  React.useEffect(() => {
    if (selectedMaterial && !trends[selectedMaterial]) {
      getTrendForMaterial(selectedMaterial);
    }
  }, [selectedMaterial, trends, getTrendForMaterial]);
  
  // Toggle chart type
  const handleToggleChartType = () => {
    setChartType(prev => prev === 'line' ? 'area' : 'line');
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-carbon-600" />
              Material Performance Tracking
            </div>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="auto-tracking" className="text-sm font-normal">Auto Tracking</Label>
              <Switch 
                id="auto-tracking" 
                checked={!isTrackingPaused}
                onCheckedChange={() => toggleTracking()}
              />
            </div>
          </CardTitle>
          <CardDescription>
            Track material performance over time and get recommendations for improvement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="trends">
                  <LineChart className="h-4 w-4 mr-2" />
                  <span>Performance Trends</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations">
                  <PieChart className="h-4 w-4 mr-2" />
                  <span>Recommendations</span>
                </TabsTrigger>
              </TabsList>
              
              {activeTab === 'trends' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleToggleChartType}
                  className="text-xs"
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  {chartType === 'line' ? 'Area Chart' : 'Line Chart'}
                </Button>
              )}
            </div>
            
            <TabsContent value="trends" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {materials.map(material => (
                  <Button 
                    key={material.type}
                    variant={selectedMaterial === material.type ? "default" : "outline"}
                    onClick={() => setSelectedMaterial(material.type)}
                    className="justify-between"
                  >
                    <span>{material.type}</span>
                    <span className="text-xs ml-2">
                      {formatCarbon(Number(material.quantity) || 0)}
                    </span>
                  </Button>
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MaterialPerformanceChart 
                  trendData={selectedTrendData}
                  isLoading={isLoading && !selectedTrendData}
                  chartType={chartType}
                />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="recommendations" className="pt-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MaterialRecommendations 
                  recommendations={recommendations}
                  isLoading={isLoading && recommendations.length === 0}
                  onRefresh={trackPerformanceNow}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              onClick={trackPerformanceNow}
              variant="outline"
              disabled={isLoading}
              className="text-sm"
            >
              Update Performance Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialPerformanceTab;
