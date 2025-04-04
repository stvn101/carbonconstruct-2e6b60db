
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { Calculator, FileText, Database, BarChart3, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const { projects } = useProjects();
  const isMobile = useIsMobile();
  const [trendData, setTrendData] = useState<any[]>([]);

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
              <p className="text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button 
                variant="outline" 
                asChild
                className="border-carbon-300 hover:bg-carbon-100 hover:text-carbon-800"
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
              icon={<FileText className="h-5 w-5 text-carbon-600" />} 
            />
            <StatsCard 
              title="Recent Calculations" 
              value={projects.filter(p => new Date(p.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length.toString()}
              description="Past 7 days" 
              icon={<Calculator className="h-5 w-5 text-carbon-600" />} 
            />
            <StatsCard 
              title="Materials Used" 
              value={Array.from(new Set(projects.flatMap(p => p.materials.map(m => m.type)))).length.toString()}
              description="Unique materials" 
              icon={<Database className="h-5 w-5 text-carbon-600" />} 
            />
            <StatsCard 
              title="Avg CO₂ Reduction" 
              value="12%"
              description="From industry average" 
              icon={<BarChart3 className="h-5 w-5 text-carbon-600" />} 
            />
          </div>

          {/* Charts and data */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Emissions trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Emissions Trend</CardTitle>
                <CardDescription>Your project emissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {trendData.length > 0 ? (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="emissions" stroke="#9b87f5" name="Total CO₂e" />
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
              </CardContent>
            </Card>

            {/* Recent projects */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Projects</CardTitle>
                <CardDescription>Your latest carbon calculations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {projects.length > 0 ? (
                    projects
                      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                      .slice(0, 5)
                      .map(project => (
                        <Link 
                          key={project.id} 
                          to={`/project/${project.id}`}
                          className="block p-3 rounded-md hover:bg-gray-100 transition-colors"
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
                      ))
                  ) : (
                    <div className="text-center py-4">
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
              title="Industry Benchmarks" 
              description="Compare your projects against industry standards"
              icon={<BarChart3 className="h-6 w-6" />}
              link="/benchmarking"
            />
          </div>
        </div>
      </main>
      <Footer />
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
          <span className="bg-carbon-100 p-1.5 rounded-md">{icon}</span>
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
}

const QuickActionCard = ({ title, description, icon, link }: QuickActionCardProps) => {
  return (
    <Link to={link}>
      <Card className="h-full transition-all hover:shadow-md hover:border-carbon-300">
        <CardContent className="p-6 flex">
          <div className="bg-carbon-100 p-3 rounded-lg mr-4">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Dashboard;
