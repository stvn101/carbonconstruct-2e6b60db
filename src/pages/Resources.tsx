
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, Video } from "lucide-react";

const Resources = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Resources - CarbonConstruct"
        description="Educational resources to help you understand and implement carbon reduction strategies in construction."
        canonical="/resources"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Resources</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
          Knowledge and tools to help you reduce the carbon footprint of your construction projects.
        </p>
        
        <Tabs defaultValue="guides" className="max-w-4xl mx-auto">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="guides" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">Guides</TabsTrigger>
            <TabsTrigger value="webinars" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">Webinars</TabsTrigger>
            <TabsTrigger value="research" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">Research</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guides" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {guides.map((guide, index) => (
                <ResourceCard 
                  key={index}
                  title={guide.title}
                  description={guide.description}
                  icon={<FileText className="h-8 w-8 text-carbon-500" />}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="webinars" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {webinars.map((webinar, index) => (
                <ResourceCard 
                  key={index}
                  title={webinar.title}
                  description={webinar.description}
                  icon={<Video className="h-8 w-8 text-carbon-500" />}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="research" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {research.map((researchItem, index) => (
                <ResourceCard 
                  key={index}
                  title={researchItem.title}
                  description={researchItem.description}
                  icon={<Book className="h-8 w-8 text-carbon-500" />}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </motion.div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <div>{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <button className="mt-4 text-carbon-600 font-medium hover:text-carbon-800 transition-colors">
          View resource →
        </button>
      </CardContent>
    </Card>
  );
};

// Sample data
const guides = [
  { title: "Getting Started with Carbon Calculations", description: "Learn the basics of calculating embodied carbon in your construction projects." },
  { title: "Low-Carbon Material Selection Guide", description: "A comprehensive guide to choosing sustainable construction materials." },
  { title: "Optimizing Transport Emissions", description: "Strategies for reducing carbon emissions in your supply chain and transportation." },
  { title: "Renewable Energy Implementation", description: "How to integrate renewable energy sources into your construction projects." }
];

const webinars = [
  { title: "Introduction to CarbonConstruct", description: "A walkthrough of our platform and how it can help your projects." },
  { title: "Expert Panel: Future of Sustainable Construction", description: "Industry leaders discuss trends and innovations in low-carbon building." },
  { title: "Case Study: Commercial Tower Carbon Reduction", description: "Detailed breakdown of how a major project achieved 30% carbon savings." },
  { title: "Regulatory Compliance for Carbon Reporting", description: "Understanding and meeting the latest regulations for construction emissions." }
];

const research = [
  { title: "Annual Construction Carbon Impact Report", description: "Comprehensive analysis of carbon emissions in the construction industry." },
  { title: "Material Innovation Study", description: "Research on emerging low-carbon materials and their performance characteristics." },
  { title: "Benchmarking Industry Standards", description: "Comparative analysis of carbon performance across different project types." },
  { title: "ROI of Sustainable Construction Practices", description: "Economic analysis of investing in carbon reduction strategies." }
];

export default Resources;
