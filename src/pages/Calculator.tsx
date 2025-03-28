
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
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Calculator = () => {
  const location = useLocation();
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Construction Tools</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you measure, analyze, and reduce the carbon footprint of your construction projects.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <div className="flex justify-center">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
                <TabsTrigger value="reporting">Reporting</TabsTrigger>
                <TabsTrigger value="integration">Integration</TabsTrigger>
                <TabsTrigger value="benchmarking">Benchmarking</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
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
