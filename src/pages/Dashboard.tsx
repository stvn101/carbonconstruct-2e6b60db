
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { Calculator, FileText, Database, BarChart3, User, Sparkles, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIService } from "@/components/ai/AIServiceProvider";
import AIConfigModal from "@/components/ai/AIConfigModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const isMobile = useIsMobile();
  const [trendData, setTrendData] = useState<any[]>([]);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const { isConfigured } = useAIService();
  
  useEffect(() => {
    // Generate trend data based on projects
    if (projects.length) {
      const data = [];
      const sorted = [...projects].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      for (let i = 0; i < sorted.length; i++) {
        const project = sorted[i];
        data.push({
          name: new Date(project.createdAt).toLocaleDateString(),
          emissions: project.result?.totalEmissions || 0,
          materials: project.result?.materialEmissions || 0,
          transport: project.result?.transportEmissions || 0,
          energy: project.result?.energyEmissions || 0
        });
      }
      setTrendData(data);
    }
  }, [projects]);

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
          content="Track and manage your construction project's carbon footprint from your personalized dashboard."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.name || "Guest"}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button 
                variant="outline" 
                asChild
                className="border-carbon-300 hover:bg-carbon-100 hover:text-carbon-800 dark:border-carbon-700 dark:hover:bg-carbon-800 dark:hover:text-carbon-200"
              >
                <Link to="/calculator">New Calculation</Link>
              </Button>
              <Button 
                asChild
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Link to="/projects">View Projects</Link>
              </Button>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard 
              title="Total Projects" 
              value={projects.length.toString()}
              description="All saved projects" 
              icon={<FileText className="h-5 w-5 text-carbon-600 dark:text-carbon-400" />} 
            />
            <StatsCard 
              title="Recent Calculations" 
              value={projects.filter(p => new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString()}
              description="Past 7 days" 
              icon={<Calculator className="h-5 w-5 text-carbon-600 dark:text-carbon-400" />} 
            />
            <StatsCard 
              title="Materials Used" 
              value={Array.from(new Set(projects.flatMap(p => p.materials.map(m => m.type)))).length.toString()}
              description="Unique materials" 
              icon={<Database className="h-5 w-5 text-carbon-600 dark:text-carbon-400" />} 
            />
            <StatsCard 
              title="Avg CO₂ Reduction" 
              value="12%"
              description="From industry average" 
              icon={<BarChart3 className="h-5 w-5 text-carbon-600 dark:text-carbon-400" />} 
            />
          </div>

          {/* Charts and data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Emissions trend */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Emissions Trend</CardTitle>
                    <CardDescription>Your project emissions over time</CardDescription>
                  </div>
                  <Tabs defaultValue="line" className="w-[180px]">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="line">Line</TabsTrigger>
                      <TabsTrigger value="area">Area</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="line" className="mt-0">
                  {trendData.length > 0 ? (
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: 'var(--background)', 
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)'
                            }} 
                          />
                          <Line type="monotone" dataKey="emissions" stroke="#9b87f5" strokeWidth={2} name="Total CO₂e" />
                          <Line type="monotone" dataKey="materials" stroke="#6E59A5" name="Materials" />
                          <Line type="monotone" dataKey="transport" stroke="#33C3F0" name="Transport" />
                          <Line type="monotone" dataKey="energy" stroke="#D6BCFA" name="Energy" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-60 flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground">No emission data available yet</p>
                      <p className="mt-2 text-sm">Save projects with calculation results to see trends</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="area" className="mt-0">
                  {trendData.length > 0 ? (
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: 'var(--background)', 
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)'
                            }} 
                          />
                          <Area type="monotone" dataKey="materials" stackId="1" stroke="#6E59A5" fill="#6E59A5" name="Materials" />
                          <Area type="monotone" dataKey="transport" stackId="1" stroke="#33C3F0" fill="#33C3F0" name="Transport" />
                          <Area type="monotone" dataKey="energy" stackId="1" stroke="#D6BCFA" fill="#D6BCFA" name="Energy" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-60 flex flex-col justify-center items-center text-center">
                      <p className="text-muted-foreground">No emission data available yet</p>
                      <p className="mt-2 text-sm">Save projects with calculation results to see trends</p>
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Card>

            {/* Recent projects */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <CardDescription>Your latest carbon calculations</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2 h-full flex flex-col">
                  {projects.length > 0 ? (
                    <div className="flex-grow">
                      {projects
                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                        .slice(0, 5)
                        .map(project => (
                          <Link 
                            key={project.id} 
                            to={`/project/${project.id}`}
                            className="block p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(project.updatedAt).toLocaleDateString()}
                                </p>
                              </div>
                              {project.result && (
                                <span className="text-sm font-medium">
                                  {Math.round(project.result.totalEmissions)} kg CO₂e
                                </span>
                              )}
                            </div>
                          </Link>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 flex-grow flex flex-col justify-center">
                      <p className="text-muted-foreground">No projects yet</p>
                      <Button 
                        asChild 
                        variant="outline" 
                        className="mt-2"
                      >
                        <Link to="/calculator">Start a calculation</Link>
                      </Button>
                    </div>
                  )}
                </div>
                {projects.length > 5 && (
                  <div className="mt-4 text-center">
                    <Button 
                      variant="outline" 
                      asChild
                      className="w-full"
                    >
                      <Link to="/projects">View all projects</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* AI insights section */}
          {projects.length > 0 && (
            <Card className="mb-8 border-carbon-200 bg-gradient-to-r from-carbon-50/70 to-carbon-100/50 dark:from-carbon-900/50 dark:to-carbon-800/30 dark:border-carbon-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400" />
                  AI Carbon Insights
                </CardTitle>
                <CardDescription>
                  AI-powered analysis of your carbon reduction performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isConfigured ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white dark:bg-carbon-900 rounded-lg p-4 border shadow-sm">
                        <h3 className="text-sm font-medium mb-2 text-carbon-600 dark:text-carbon-400">Reduction Potential</h3>
                        <p className="text-2xl font-bold mb-1">23%</p>
                        <p className="text-xs text-muted-foreground">Possible improvement based on AI analysis</p>
                      </div>
                      <div className="bg-white dark:bg-carbon-900 rounded-lg p-4 border shadow-sm">
                        <h3 className="text-sm font-medium mb-2 text-carbon-600 dark:text-carbon-400">Top Material Alternative</h3>
                        <p className="text-md font-bold mb-1">Recycled Steel</p>
                        <p className="text-xs text-muted-foreground">Reduces emissions by 37%</p>
                      </div>
                      <div className="bg-white dark:bg-carbon-900 rounded-lg p-4 border shadow-sm">
                        <h3 className="text-sm font-medium mb-2 text-carbon-600 dark:text-carbon-400">Industry Ranking</h3>
                        <p className="text-2xl font-bold mb-1">Top 15%</p>
                        <p className="text-xs text-muted-foreground">Your projects vs. industry average</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-carbon-900 rounded-lg p-4 border">
                      <h3 className="font-medium mb-3">AI Recommendations</h3>
                      <ul className="space-y-2">
                        <li className="flex">
                          <Sparkles className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400 flex-shrink-0" />
                          <p className="text-sm">Consider replacing standard concrete with low-carbon alternatives in your next 3 projects.</p>
                        </li>
                        <li className="flex">
                          <Sparkles className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400 flex-shrink-0" />
                          <p className="text-sm">Optimize material transportation by consolidating deliveries, potentially reducing emissions by 15%.</p>
                        </li>
                        <li className="flex">
                          <Sparkles className="h-5 w-5 mr-2 text-carbon-600 dark:text-carbon-400 flex-shrink-0" />
                          <p className="text-sm">Implement renewable energy sources for on-site operations to reduce energy emissions.</p>
                        </li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <Button className="bg-carbon-600 hover:bg-carbon-700 text-white">
                        Get Full AI Analysis
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Sparkles className="h-12 w-12 mx-auto text-carbon-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Unlock AI-Powered Insights</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Configure AI services to get personalized recommendations and insights to reduce your project's carbon footprint.
                    </p>
                    <Button onClick={() => setConfigModalOpen(true)}>
                      Configure AI Services
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickActionCard 
              title="Material Database" 
              description="Browse and compare sustainable materials"
              icon={<Database className="h-6 w-6" />}
              link="/materials"
            />
            <QuickActionCard 
              title="New Calculation" 
              description="Start a new carbon footprint calculation"
              icon={<Calculator className="h-6 w-6" />}
              link="/calculator"
            />
            <QuickActionCard 
              title="Account Settings" 
              description="Manage your profile and preferences"
              icon={<Settings className="h-6 w-6" />}
              link="/settings"
              isNew={true}
            />
          </div>
        </div>
      </main>
      <Footer />
      <AIConfigModal open={configModalOpen} onOpenChange={setConfigModalOpen} />
    </motion.div>
  );
};

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, description, icon }: StatsCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <span className="bg-carbon-100 dark:bg-carbon-800 p-1.5 rounded-md">{icon}</span>
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  isNew?: boolean;
}

const QuickActionCard = ({ title, description, icon, link, isNew }: QuickActionCardProps) => {
  return (
    <Link to={link}>
      <Card className="h-full transition-all hover:shadow-md hover:border-carbon-300 dark:hover:border-carbon-700">
        <CardContent className="p-6 flex">
          <div className="bg-carbon-100 dark:bg-carbon-800 p-3 rounded-lg mr-4">
            {icon}
          </div>
          <div className="flex-grow">
            <div className="flex items-center">
              <h3 className="font-medium">{title}</h3>
              {isNew && (
                <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-carbon-600 text-white rounded-full">
                  New
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Dashboard;
