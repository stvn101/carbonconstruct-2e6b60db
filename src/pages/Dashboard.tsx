
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { 
  Calculator,
  FileText, 
  Brain,
  FolderPlus,
} from "lucide-react";
import AIFeatures from "@/components/ai/AIFeatures";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { EmissionsCharts } from "@/components/dashboard/EmissionsCharts";
import { SustainabilityInsights } from "@/components/dashboard/SustainabilityInsights";
import { ProjectsTab } from "@/components/dashboard/ProjectsTab";
import { ReportsTab } from "@/components/dashboard/ReportsTab";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const { projects } = useProjects();
  
  // Get the most recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50"
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
      <main className="flex-grow pt-24 md:pt-28 pb-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {profile?.full_name || user?.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground">Manage your carbon footprint calculations</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/projects/new">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
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
              <DashboardStats projectsCount={projects.length} recentProjects={recentProjects} />
              <EmissionsCharts />
              <SustainabilityInsights recentProjects={recentProjects} />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsTab projects={projects} />
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
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
