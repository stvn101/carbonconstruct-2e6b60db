import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Calculator, ImageIcon, Brain } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AIFeatures from "@/components/ai/AIFeatures";
import CarbonCalculator from "@/components/CarbonCalculator";
import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Interactive Demo | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Experience our carbon footprint calculation tools in action with this interactive demo"
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12">
        {/* Hero Section */}
        <section className="bg-carbon-50 dark:bg-carbon-800 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Try CarbonConstruct
              </h1>
              <p className="text-lg md:text-xl text-carbon-600 dark:text-carbon-300 mb-8">
                Experience our powerful carbon footprint calculation tools with this interactive demo
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="bg-carbon-600 hover:bg-carbon-700">
                  <Play className="w-4 h-4 mr-2" />
                  Start Demo
                </Button>
                <Button size="lg" variant="outline">
                  Schedule Full Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Demo Navigation */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="calculator" className="space-y-8">
              <div className="flex justify-center">
                <TabsList className="grid grid-cols-3 w-full max-w-3xl">
                  <TabsTrigger value="calculator" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
                    <Calculator className="h-4 w-4 mr-2" />
                    Carbon Calculator
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Features
                  </TabsTrigger>
                  <TabsTrigger value="gallery" className="data-[state=active]:bg-carbon-600 data-[state=active]:text-white">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Gallery
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="calculator">
                <CarbonCalculator />
              </TabsContent>
              
              <TabsContent value="ai">
                <AIFeatures />
              </TabsContent>
              
              <TabsContent value="gallery">
                <div className="container mx-auto px-4">
                  <div className="text-center max-w-3xl mx-auto mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Project Gallery</h2>
                    <p className="text-muted-foreground">
                      View examples of projects that have used CarbonConstruct to reduce their carbon footprint
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Project Cards */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="overflow-hidden">
                        <div className="h-48 bg-carbon-100 dark:bg-carbon-700 flex items-center justify-center">
                          <ImageIcon className="h-12 w-12 text-carbon-400 dark:text-carbon-500" />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="font-medium text-lg mb-2">Example Project {i}</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This project achieved a 30% reduction in carbon emissions through material optimization and sustainable construction practices.
                          </p>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-carbon-600 dark:bg-carbon-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-xl mx-auto">
              Sign up today and start calculating your project's carbon footprint
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" variant="secondary">
                <Link to="/auth">Create Account</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Demo;
