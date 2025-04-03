
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stars, Building, Building2, ArrowRight, Handshake } from "lucide-react";

const Partners = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Partners - CarbonConstruct"
        description="Join our partner ecosystem and help drive sustainable construction practices forward."
        canonical="/partners"
        type="website"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Partner With Us</h1>
          <p className="text-lg text-muted-foreground">
            Join our growing ecosystem of partners transforming the construction industry through sustainable practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <PartnerTypeCard 
            title="Technology Partners"
            description="Integrate your solutions with our platform to provide comprehensive carbon management tools."
            icon={<Stars className="h-8 w-8 text-carbon-500" />}
            partnerExamples={["BIM Software Providers", "Project Management Tools", "Digital Twin Platforms"]}
          />
          <PartnerTypeCard 
            title="Implementation Partners"
            description="Help clients implement and maximize the value of CarbonConstruct in their projects."
            icon={<Handshake className="h-8 w-8 text-carbon-500" />}
            partnerExamples={["Sustainability Consultants", "Construction Management Firms", "Architecture Practices"]}
          />
          <PartnerTypeCard 
            title="Industry Partners"
            description="Collaborate on industry standards and best practices for carbon measurement."
            icon={<Building className="h-8 w-8 text-carbon-500" />}
            partnerExamples={["Industry Associations", "Certification Bodies", "Research Institutions"]}
          />
        </div>
        
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Partners</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg aspect-[3/2] flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-carbon-50 rounded-lg p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Become a Partner</h2>
          <p className="text-muted-foreground mb-6">
            Interested in joining our partner ecosystem? Contact us to learn more about partnership opportunities.
          </p>
          <Button className="bg-carbon-600 hover:bg-carbon-700">
            Contact Partner Team
          </Button>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

interface PartnerTypeCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  partnerExamples: string[];
}

const PartnerTypeCard: React.FC<PartnerTypeCardProps> = ({ title, description, icon, partnerExamples }) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base mb-4">{description}</CardDescription>
        <div className="space-y-2 mb-4">
          {partnerExamples.map((example, index) => (
            <Badge key={index} variant="outline" className="mr-2 bg-background">
              {example}
            </Badge>
          ))}
        </div>
        <Button variant="ghost" className="p-0 h-auto text-carbon-600 hover:text-carbon-800 hover:bg-transparent">
          Learn more <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Partners;
