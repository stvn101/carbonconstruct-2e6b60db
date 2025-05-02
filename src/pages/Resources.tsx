
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, FileText, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollTo } from '@/hooks/useScrollTo';
import { resourcesData } from '@/data/resourcesData';
import { toast } from "sonner";

const Resources = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guides');
  const { scrollToElement } = useScrollTo();
  
  // Filter resources by type
  const guides = resourcesData.filter(resource => resource.type === 'guide');
  const webinars = resourcesData.filter(resource => resource.type === 'webinar');
  const research = resourcesData.filter(resource => resource.type === 'research');
  
  const handleViewResource = (resource: any) => {
    // Navigate to the resource URL or handle viewing the resource
    if (resource.url) {
      try {
        window.open(resource.url, '_blank');
        // Show toast confirmation that the link was opened
        toast.success(`Opening ${resource.title}`);
      } catch (error) {
        console.error('Error opening resource URL:', error);
        toast.error("Couldn't open the resource. Please try again later.");
      }
    } else {
      // Handle internal navigation if needed
      console.log('Viewing resource:', resource.title);
      toast.error("Resource URL not available");
    }
  };

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
      <main className="flex-grow container mx-auto px-4 py-12 pt-24 md:pt-28">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center" id="resources-title">Resources</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-8">
          Knowledge and tools to help you reduce the carbon footprint of your construction projects.
        </p>
        
        <Tabs 
          defaultValue="guides" 
          className="max-w-4xl mx-auto"
          onValueChange={(value) => setActiveTab(value)}
        >
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
                  onClick={() => handleViewResource(guide)}
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
                  onClick={() => handleViewResource(webinar)}
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
                  onClick={() => handleViewResource(researchItem)}
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
  onClick: () => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300 hover:border-carbon-300">
      <CardHeader className="pb-2 flex flex-row items-center gap-4">
        <div>{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <Button 
          onClick={onClick} 
          variant="link" 
          className="mt-4 text-carbon-600 font-medium hover:text-carbon-800 transition-colors p-0"
        >
          View resource →
        </Button>
      </CardContent>
    </Card>
  );
};

export default Resources;
