
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarbonCalculator from "@/components/CarbonCalculator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialDatabase from "@/components/MaterialDatabase";
import ProjectReporting from "@/components/ProjectReporting";
import EasyIntegration from "@/components/EasyIntegration";
import Benchmarking from "@/components/Benchmarking";
import EducationalResources from "@/components/EducationalResources";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FileText, ArrowRight, Zap, Calculator as CalculatorIcon, BarChart3 } from "lucide-react";

const Calculator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("calculator");
  
  // Set active tab based on URL hash or query parameter
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    if (hash && ["calculator", "materials", "reporting", "integration", "benchmarking", "education"].includes(hash)) {
      setActiveTab(hash);
    } else if (tab && ["calculator", "materials", "reporting", "integration", "benchmarking", "education"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);
  
  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/calculator#${value}`, { replace: true });
  };
  
  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Carbon Footprint Calculator | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Calculate the carbon footprint of your construction projects with our precise calculator that accounts for materials, transportation, and energy use."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-carbon-900 dark:text-carbon-50">Sustainable Construction Tools</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you measure, analyze, and reduce the carbon footprint of your construction projects.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto bg-carbon-100 dark:bg-carbon-800">
                <TabsTrigger value="calculator" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <CalculatorIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Calculator</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Materials</span>
                </TabsTrigger>
                <TabsTrigger value="reporting" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Reporting</span>
                </TabsTrigger>
                <TabsTrigger value="integration" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <ArrowRight className="h-4 w-4" />
                  <span className="hidden sm:inline">Integration</span>
                </TabsTrigger>
                <TabsTrigger value="benchmarking" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Benchmarking</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="calculator">
              <CarbonCalculator />
            </TabsContent>
            
            <TabsContent value="materials">
              <MaterialDatabase />
            </TabsContent>
            
            <TabsContent value="reporting">
              <ProjectReporting />
            </TabsContent>
            
            <TabsContent value="integration">
              <EasyIntegration />
            </TabsContent>
            
            <TabsContent value="benchmarking">
              <Benchmarking />
            </TabsContent>
            
            <TabsContent value="education">
              <EducationalResources />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Calculator;
