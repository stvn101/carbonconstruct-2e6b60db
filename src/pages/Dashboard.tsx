
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chart } from "@/components/ui/chart";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { 
  BarChart3, 
  FileText, 
  Plus, 
  Calculator,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Building2,
  Leaf,
  Zap,
  Truck,
  Brain,
} from "lucide-react";
import AIFeatures from "@/components/ai/AIFeatures";

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  
  // Get the most recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
    
  // Mock data for charts
  const emissionsData = [
    {
      name: "Jan",
      total: 2400,
    },
    {
      name: "Feb",
      total: 1398,
    },
    {
      name: "Mar",
      total: 9800,
    },
    {
      name: "Apr",
      total: 3908,
    },
    {
      name: "May",
      total: 4800,
    },
    {
      name: "Jun",
      total: 3800,
    },
  ];
  
  const categoryData = [
    { name: "Materials", value: 65 },
    { name: "Transport", value: 15 },
    { name: "Energy", value: 20 },
  ];

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Dashboard | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Manage your projects and view your carbon footprint calculations"
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user?.name}</h1>
              <p className="text-muted-foreground">Manage your carbon footprint calculations</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button 
                asChild
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Link to="/calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  New Calculation
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/projects">
                  <FileText className="h-4 w-4 mr-2" />
                  All Projects
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList>
              <TabsTrigger value="overview" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="projects" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Recent Projects
              </TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Total Projects</CardDescription>
                    <CardTitle className="text-3xl">{projects.length}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+2</span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Average Emissions</CardDescription>
                    <CardTitle className="text-3xl">243 <span className="text-lg">kg CO₂e</span></CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1 text-green-500 rotate-180" />
                      <span className="text-green-500 font-medium">-5%</span>
                      <span className="ml-1">reduction from baseline</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Latest Calculation</CardDescription>
                    <CardTitle className="text-xl truncate">
                      {recentProjects[0]?.name || "No projects yet"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {recentProjects[0] 
                        ? new Date(recentProjects[0].updatedAt).toLocaleDateString() 
                        : "N/A"}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Optimization Potential</CardDescription>
                    <CardTitle className="text-3xl">18.5%</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <RefreshCw className="h-3 w-3 mr-1 text-blue-500" />
                      <span>Based on latest AI analysis</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
                      Emissions Trend
                    </CardTitle>
                    <CardDescription>
                      Your carbon emissions over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[240px]">
                      <Chart 
                        type="bar"
                        data={emissionsData}
                        categories={["total"]}
                        index="name"
                        colors={["#16a34a"]}
                        valueFormatter={(value) => `${value} kg CO₂e`}
                        showLegend={false}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
                      Emissions by Category
                    </CardTitle>
                    <CardDescription>
                      Breakdown of your carbon footprint
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[240px]">
                      <Chart 
                        type="pie"
                        data={categoryData}
                        categories={["value"]}
                        index="name"
                        colors={["#16a34a", "#2563eb", "#ea580c"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Projects</CardTitle>
                    <CardDescription>
                      Your most recent carbon calculations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentProjects.length > 0 ? (
                      <div className="space-y-4">
                        {recentProjects.map((project) => (
                          <div 
                            key={project.id}
                            className="flex justify-between items-center p-3 rounded-lg border hover:bg-carbon-50 dark:hover:bg-carbon-800"
                          >
                            <div className="flex items-center">
                              <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-md mr-3">
                                <Building2 className="h-5 w-5 text-carbon-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-xs text-muted-foreground">
                                  Updated: {new Date(project.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button asChild variant="ghost" size="sm">
                              <Link to={`/project/${project.id}`}>
                                View
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                        <h3 className="font-medium mb-1">No projects yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Start by creating your first carbon calculation
                        </p>
                        <Button 
                          asChild
                          className="bg-carbon-600 hover:bg-carbon-700 text-white"
                        >
                          <Link to="/calculator">
                            <Plus className="h-4 w-4 mr-2" />
                            New Calculation
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Sustainability Insights</CardTitle>
                    <CardDescription>
                      Key opportunities for carbon reduction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-3 rounded-lg border bg-carbon-50 dark:bg-carbon-800">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-green-700 dark:text-green-400">Material Substitution</h3>
                          <p className="text-sm text-carbon-600 dark:text-carbon-300">
                            Replacing traditional concrete with geopolymer alternatives could reduce your emissions by up to 30%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                          <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-blue-700 dark:text-blue-400">Transport Optimization</h3>
                          <p className="text-sm text-carbon-600 dark:text-carbon-300">
                            Sourcing materials locally could reduce transportation emissions by up to 15%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                          <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h3 className="font-medium text-orange-700 dark:text-orange-400">Energy Management</h3>
                          <p className="text-sm text-carbon-600 dark:text-carbon-300">
                            Switching to renewable energy sources on-site could reduce energy emissions by up to 40%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Manage and view your recent carbon calculations
                    </CardDescription>
                  </div>
                  <Button 
                    asChild
                    className="bg-carbon-600 hover:bg-carbon-700 text-white"
                  >
                    <Link to="/projects">
                      <FileText className="h-4 w-4 mr-2" />
                      View All
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-4">
                      {projects
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .slice(0, 5)
                        .map((project) => (
                          <div 
                            key={project.id}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border hover:bg-carbon-50 dark:hover:bg-carbon-800"
                          >
                            <div className="flex items-center mb-2 sm:mb-0">
                              <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-md mr-3">
                                <Building2 className="h-5 w-5 text-carbon-600" />
                              </div>
                              <div>
                                <h3 className="font-medium">{project.name}</h3>
                                <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-2 mt-1">
                                  <span className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {new Date(project.updatedAt).toLocaleDateString()}
                                  </span>
                                  {project.result && (
                                    <span className="flex items-center">
                                      <Leaf className="h-3 w-3 mr-1" />
                                      {Math.round(project.result.totalEmissions)} kg CO₂e
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/project/${project.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                      <h3 className="font-medium mb-1">No projects yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by creating your first carbon calculation
                      </p>
                      <Button 
                        asChild
                        className="bg-carbon-600 hover:bg-carbon-700 text-white"
                      >
                        <Link to="/calculator">
                          <Plus className="h-4 w-4 mr-2" />
                          New Calculation
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-carbon-600" />
                    AI Carbon Assistant
                  </CardTitle>
                  <CardDescription>
                    Use our AI-powered tools to analyze and optimize your construction projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AIFeatures />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    Generate and view carbon footprint reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                          <FileText className="h-5 w-5 text-carbon-600" />
                        </div>
                        <span className="text-xs text-muted-foreground">Updated Weekly</span>
                      </div>
                      <h3 className="font-medium mb-1">Project Summary</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Overview of all your project emissions
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Generate Report
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                          <BarChart3 className="h-5 w-5 text-carbon-600" />
                        </div>
                        <span className="text-xs text-muted-foreground">Updated Monthly</span>
                      </div>
                      <h3 className="font-medium mb-1">Emissions Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed analysis of your carbon footprint
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Generate Report
                      </Button>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-full">
                          <Leaf className="h-5 w-5 text-carbon-600" />
                        </div>
                        <span className="text-xs text-muted-foreground">Updated Quarterly</span>
                      </div>
                      <h3 className="font-medium mb-1">Sustainability Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Comprehensive sustainability assessment
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
