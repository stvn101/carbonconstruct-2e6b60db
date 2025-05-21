
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ComposedChart,
  Area
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMaterialPerformance } from "@/hooks/useMaterialPerformance";
import MaterialPerformanceChart from "./MaterialPerformanceChart";
import MaterialRecommendations from "./MaterialRecommendations";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BarChart3, 
  LineChart as LineChartIcon, 
  PieChart, 
  ArrowUpDown, 
  Download,
  HelpCircle,
  BarChart4,
  LineChart2,
  RadarIcon
} from "lucide-react";
import { formatCarbon } from "@/lib/formatters";
import { Progress } from "@/components/ui/progress";
import { Tooltip as TooltipComponent, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MaterialPerformanceDashboardProps {
  materials: any[];
  projectId?: string;
  className?: string;
}

const MaterialPerformanceDashboard: React.FC<MaterialPerformanceDashboardProps> = ({
  materials,
  projectId,
  className
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'line' | 'area' | 'composed'>('composed');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [viewMode, setViewMode] = useState<'standard' | 'detailed'>('standard');
  
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
  
  // Find the default material (one with highest quantity)
  useEffect(() => {
    if (materials.length > 0 && !selectedMaterial) {
      // Sort by quantity and select the first one
      const sortedMaterials = [...materials].sort(
        (a, b) => (Number(b.quantity) || 0) - (Number(a.quantity) || 0)
      );
      setSelectedMaterial(sortedMaterials[0].type);
    }
  }, [materials, selectedMaterial]);
  
  // Get trend data for the selected material
  const selectedTrendData = selectedMaterial ? 
    trends[selectedMaterial] : null;
  
  // Fetch trend data when selected material changes
  useEffect(() => {
    if (selectedMaterial && !trends[selectedMaterial]) {
      getTrendForMaterial(selectedMaterial);
    }
  }, [selectedMaterial, trends, getTrendForMaterial]);
  
  // Calculate overall performance metrics
  const overallMetrics = React.useMemo(() => {
    let totalFootprint = 0;
    let totalQuantity = 0;
    let sustainabilityScore = 0;
    
    performanceData.forEach(material => {
      totalFootprint += material.carbonFootprint || 0;
      totalQuantity += material.quantity || 0;
      sustainabilityScore += material.sustainabilityScore || 0;
    });
    
    const avgSustainabilityScore = performanceData.length > 0 ? 
      sustainabilityScore / performanceData.length : 0;
    
    return {
      totalFootprint,
      totalQuantity,
      avgSustainabilityScore,
      materialCount: performanceData.length,
      footprintPerUnit: totalQuantity > 0 ? totalFootprint / totalQuantity : 0
    };
  }, [performanceData]);
  
  // Format data for the overview chart
  const overviewChartData = React.useMemo(() => {
    if (!topMaterials || topMaterials.length === 0) return [];
    
    return topMaterials.map(material => ({
      name: material.materialName,
      footprint: material.carbonFootprint,
      score: material.sustainabilityScore,
      quantity: material.quantity
    }));
  }, [topMaterials]);
  
  // Format data for the radar chart
  const radarChartData = React.useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    const categories = [
      "Carbon Footprint",
      "Renewability",
      "Recyclability",
      "Durability",
      "Local Sourcing",
      "Cost Efficiency"
    ];
    
    return categories.map(category => {
      const dataPoint: any = { category };
      
      materials.forEach((material: any, index: number) => {
        if (index < 5) { // Limit to 5 materials for readability
          // Generate mock values between 20-100
          const baseValue = material.sustainabilityScore || 60;
          const randomVariation = (Math.random() * 30) - 15; // ±15
          const value = Math.min(100, Math.max(20, baseValue + randomVariation));
          dataPoint[material.type] = Math.round(value);
        }
      });
      
      return dataPoint;
    });
  }, [materials]);
  
  // Format the carbon footprint value for display
  const formattedCarbonFootprint = formatCarbon(overallMetrics.totalFootprint);
  
  // Toggle chart type
  const handleToggleChartType = () => {
    const types: ('line' | 'area' | 'composed')[] = ['line', 'area', 'composed'];
    const currentIndex = types.indexOf(chartType);
    const nextIndex = (currentIndex + 1) % types.length;
    setChartType(types[nextIndex]);
  };
  
  // Generate a sustainability rating (0-5)
  const sustainabilityRating = Math.min(5, Math.max(0, Math.round(overallMetrics.avgSustainabilityScore / 20)));
  
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-carbon-600" />
              Material Performance Analytics
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Label htmlFor="auto-tracking" className="text-sm font-normal hidden sm:inline">Automatic Tracking</Label>
                <Switch 
                  id="auto-tracking" 
                  checked={!isTrackingPaused}
                  onCheckedChange={() => toggleTracking()}
                />
              </div>
              
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
          <CardDescription>
            Comprehensive analysis and tracking of material sustainability performance over time
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Total Carbon Footprint</div>
                <div className="text-2xl font-bold">{formattedCarbonFootprint}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Sustainability Rating</div>
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < sustainabilityRating ? 'text-yellow-400' : 'text-gray-300'}`}
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xl font-semibold">
                    {sustainabilityRating}/5
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Avg. Sustainability Score</div>
                <div className="text-2xl font-bold">
                  {Math.round(overallMetrics.avgSustainabilityScore)}/100
                </div>
                <Progress 
                  value={overallMetrics.avgSustainabilityScore} 
                  className="h-2 mt-2" 
                  indicatorColor={
                    overallMetrics.avgSustainabilityScore > 80 ? "bg-green-500" :
                    overallMetrics.avgSustainabilityScore > 60 ? "bg-lime-500" :
                    overallMetrics.avgSustainabilityScore > 40 ? "bg-yellow-500" :
                    "bg-red-500"
                  }
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Materials Analyzed</div>
                <div className="text-2xl font-bold">{materials.length}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formattedCarbonFootprint} total impact
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="overview" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span>Overview</span>
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center">
                  <LineChartIcon className="h-4 w-4 mr-2" />
                  <span>Performance Trends</span>
                </TabsTrigger>
                <TabsTrigger value="comparison" className="flex items-center">
                  <RadarIcon className="h-4 w-4 mr-2" />
                  <span>Comparison</span>
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  <span>Recommendations</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setViewMode(prev => prev === 'standard' ? 'detailed' : 'standard')}
                      >
                        {viewMode === 'standard' ? 
                          <BarChart3 className="h-4 w-4" /> : 
                          <LineChart2 className="h-4 w-4" />
                        }
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {viewMode === 'standard' ? 'Switch to Detailed View' : 'Switch to Standard View'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleToggleChartType}
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Change Chart Type
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-[350px]"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Material Carbon Impact</CardTitle>
                      <CardDescription>Top materials by carbon footprint</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={overviewChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            dataKey="footprint" 
                            name="Carbon Footprint" 
                            fill="#f59e0b" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="h-[350px]"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Sustainability Score</CardTitle>
                      <CardDescription>Material sustainability comparison</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={overviewChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar 
                            yAxisId="left"
                            dataKey="quantity" 
                            name="Quantity" 
                            fill="#94a3b8" 
                          />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="score" 
                            name="Sustainability Score" 
                            stroke="#10b981" 
                            strokeWidth={2}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            {/* Trends Tab */}
            <TabsContent value="trends" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {materials.map((material, index) => {
                  if (index >= 6) return null; // Limit to 6 materials
                  return (
                    <Button 
                      key={material.type}
                      variant={selectedMaterial === material.type ? "default" : "outline"}
                      onClick={() => setSelectedMaterial(material.type)}
                      className="justify-between"
                    >
                      <span className="truncate max-w-[180px]">{material.type}</span>
                      <span className="text-xs ml-2">
                        {formatCarbon(Number(material.quantity) || 0)}
                      </span>
                    </Button>
                  );
                })}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MaterialPerformanceChart 
                  trendData={selectedTrendData}
                  isLoading={isLoading && !selectedTrendData}
                  chartType={chartType === 'composed' ? 'line' : chartType}
                  className="mb-4"
                />
                
                {viewMode === 'detailed' && selectedTrendData && (
                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Performance Details</CardTitle>
                      <CardDescription>
                        Detailed metrics for {selectedTrendData.materialName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Average Footprint</div>
                          <div className="text-xl font-bold">{formatCarbon(selectedTrendData.averageFootprint)}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Improvement</div>
                          <div className="text-xl font-bold flex items-center">
                            {selectedTrendData.improvement >= 0 ? (
                              <>
                                <svg className="h-5 w-5 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                                {Math.abs(selectedTrendData.improvement).toFixed(1)}%
                              </>
                            ) : (
                              <>
                                <svg className="h-5 w-5 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                                {Math.abs(selectedTrendData.improvement).toFixed(1)}%
                              </>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Projected Footprint</div>
                          <div className="text-xl font-bold">{formatCarbon(selectedTrendData.projectedFootprint || 0)}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
            
            {/* Comparison Tab */}
            <TabsContent value="comparison" className="pt-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-[500px]"
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Material Comparison</CardTitle>
                    <CardDescription>Comparing sustainability aspects across materials</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} width={730} height={250} data={radarChartData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        
                        {materials.slice(0, 5).map((material: any, index: number) => (
                          <Radar
                            key={material.type}
                            name={material.type}
                            dataKey={material.type}
                            stroke={getColorByIndex(index)}
                            fill={getColorByIndex(index)}
                            fillOpacity={0.3}
                          />
                        ))}
                        
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
              
              {viewMode === 'detailed' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="mt-4"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Material Comparison</CardTitle>
                      <CardDescription>Side-by-side metrics comparison</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Material</th>
                              <th className="text-right p-2">Carbon Footprint</th>
                              <th className="text-right p-2">Sustainability Score</th>
                              <th className="text-right p-2">Quantity</th>
                              <th className="text-right p-2">Impact per Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {performanceData.map((material, index) => (
                              <tr 
                                key={material.materialId} 
                                className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
                              >
                                <td className="p-2 font-medium">{material.materialName}</td>
                                <td className="text-right p-2">{formatCarbon(material.carbonFootprint)}</td>
                                <td className="text-right p-2">{material.sustainabilityScore.toFixed(0)}</td>
                                <td className="text-right p-2">{material.quantity}</td>
                                <td className="text-right p-2">
                                  {material.quantity > 0 ? 
                                    formatCarbon(material.carbonFootprint / material.quantity) : 
                                    'N/A'
                                  }
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </TabsContent>
            
            {/* Recommendations Tab */}
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
          
          <div className="flex justify-between">
            <Button 
              onClick={trackPerformanceNow}
              variant="outline"
              disabled={isLoading}
              className="text-sm"
            >
              Update Performance Data
            </Button>
            
            <Button 
              variant="outline" 
              className="text-sm"
              onClick={() => {/* Export report functionality */}}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Utility function for chart colors
function getColorByIndex(index: number): string {
  const colors = [
    '#3b82f6', // blue
    '#22c55e', // green
    '#f59e0b', // amber
    '#6366f1', // indigo
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f43f5e', // rose
    '#8b5cf6'  // violet
  ];
  
  return colors[index % colors.length];
}

export default MaterialPerformanceDashboard;
