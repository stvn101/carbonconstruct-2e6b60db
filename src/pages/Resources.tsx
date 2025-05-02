
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

const Resources = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('guides');
  const { scrollToElement } = useScrollTo();
  
  const handleViewResource = (resource: any) => {
    // Navigate to the resource URL or handle viewing the resource
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else {
      // Handle internal navigation if needed
      console.log('Viewing resource:', resource.title);
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

// Updated sample data with 2024+ resources
const guides = [
  { 
    title: "2024 NCC Compliance Guide", 
    description: "Learn how to meet Australia's National Construction Code 2024 updates for carbon reduction requirements.",
    url: "https://ncc.abcb.gov.au/news/2024/05/latest-updates-ncc-2024-amendments"
  },
  { 
    title: "Carbon Neutral Materials Selection", 
    description: "A comprehensive guide to selecting carbon neutral and net-zero materials for 2024 and beyond.",
    url: "https://www.worldgbc.org/advancing-net-zero-status-report-2024"
  },
  { 
    title: "Embodied Carbon Calculation Methods", 
    description: "Updated 2024 methodologies for accurately measuring and reducing embodied carbon in construction projects.",
    url: "https://carbonleadershipforum.org/lca-practice-guide/"
  },
  { 
    title: "Green Star Buildings Rating Tool", 
    description: "Navigate the 2024 Green Star Buildings rating system to achieve higher sustainability scores.",
    url: "https://new.gbca.org.au/green-star/"
  }
];

const webinars = [
  { 
    title: "Managing Material EPDs in 2024", 
    description: "Learn how to interpret and leverage Environmental Product Declarations for your construction projects.",
    url: "https://www.thefifthestate.com.au/innovation/building-construction/epds-and-their-role-in-construction/"
  },
  { 
    title: "Digital Carbon Tracking Technologies", 
    description: "Explore the latest digital tools for real-time carbon tracking in construction projects.",
    url: "https://buildingtransparency.org/ec3"
  },
  { 
    title: "NABERS for New Buildings", 
    description: "Understanding the May 2024 updates to NABERS ratings for new construction in Australia.",
    url: "https://www.nabers.gov.au/publications/nabers-annualreport-2023-24"
  },
  { 
    title: "Carbon Neutral Construction Practices", 
    description: "Industry experts discuss practical approaches to achieving carbon neutrality in construction.",
    url: "https://www.climateworkscentre.org/resource/decarbonisation-futures-solutions-actions-and-benchmarks-for-a-net-zero-emissions-australia/"
  }
];

const research = [
  { 
    title: "Construction Emissions Report 2024", 
    description: "Comprehensive analysis of construction carbon emissions in Australia for the first quarter of 2024.",
    url: "https://www.industry.gov.au/publications/australias-national-greenhouse-accounts"
  },
  { 
    title: "Circular Economy in Construction", 
    description: "Research on implementing circular economy principles in Australian construction projects.",
    url: "https://www.csiro.au/en/research/environmental-impacts/sustainability/circular-economy"
  },
  { 
    title: "Low-Carbon Concrete Innovations", 
    description: "The latest research on geopolymer and other low-carbon concrete technologies from 2024.",
    url: "https://www.nature.com/articles/s41598-023-50109-0"
  },
  { 
    title: "Climate Resilient Building Materials", 
    description: "2024 study on materials that can withstand increasing climate challenges while reducing carbon footprint.",
    url: "https://www.science.org/doi/10.1126/science.abf8943"
  }
];

export default Resources;
