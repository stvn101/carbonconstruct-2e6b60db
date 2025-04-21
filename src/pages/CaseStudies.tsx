import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Building2, Factory, School } from "lucide-react";

const CaseStudies = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Case Studies - CarbonConstruct"
        description="Real-world examples of how CarbonConstruct helps construction projects reduce their carbon footprint."
        canonical="/case-studies"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Case Studies</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          Discover how real construction projects have achieved significant carbon reductions using CarbonConstruct.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <CaseStudyCard 
            title="Commercial Office Tower"
            description="How a 50-story office building reduced embodied carbon by 25% during construction."
            icon={<Building className="h-10 w-10 text-carbon-500" />}
          />
          <CaseStudyCard 
            title="Residential Development"
            description="A 200-unit housing development that achieved carbon neutrality through smart material choices."
            icon={<Building2 className="h-10 w-10 text-carbon-500" />}
          />
          <CaseStudyCard 
            title="Manufacturing Facility"
            description="Retrofitting an industrial facility to reduce operational carbon emissions by 40%."
            icon={<Factory className="h-10 w-10 text-carbon-500" />}
          />
          <CaseStudyCard 
            title="University Campus"
            description="New campus construction that prioritized carbon-conscious materials and design."
            icon={<School className="h-10 w-10 text-carbon-500" />}
          />
          <CaseStudyCard 
            title="Mixed-Use Development"
            description="A sustainable urban project combining retail, office, and residential spaces."
            icon={<Building className="h-10 w-10 text-carbon-500" />}
          />
          <CaseStudyCard 
            title="Hospital Extension"
            description="Adding a new wing to an existing hospital with minimal carbon impact."
            icon={<Building2 className="h-10 w-10 text-carbon-500" />}
          />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

interface CaseStudyCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ title, description, icon }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <button className="mt-4 text-carbon-600 font-medium hover:text-carbon-800 transition-colors">
          Read full case study →
        </button>
      </CardContent>
    </Card>
  );
};

export default CaseStudies;
