import React from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, Users } from "lucide-react";

const Careers = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Careers - CarbonConstruct"
        description="Join our team and help build the future of sustainable construction."
        canonical="/careers"
        type="website"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Help us transform the construction industry through innovative carbon management solutions.
          </p>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Open Positions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {jobPostings.map((job, index) => (
              <JobCard key={index} job={job} />
            ))}
          </div>
        </div>
        
        <div className="bg-carbon-50 rounded-lg p-8 max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Why Work With Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              title="Mission-Driven Impact"
              description="Be part of a team making a real difference in climate action through construction."
              icon={<Users className="h-6 w-6 text-carbon-600" />}
            />
            <BenefitCard 
              title="Innovation & Growth"
              description="Work on cutting-edge sustainability technology and advance your career."
              icon={<Briefcase className="h-6 w-6 text-carbon-600" />}
            />
            <BenefitCard 
              title="Flexible Work Environment"
              description="Remote-first culture with flexible schedules and competitive benefits."
              icon={<MapPin className="h-6 w-6 text-carbon-600" />}
            />
          </div>
        </div>
        
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-muted-foreground mb-6">
            We're always looking for talented individuals passionate about sustainability and construction. 
            Send us your resume for future opportunities.
          </p>
          <Button className="bg-carbon-600 hover:bg-carbon-700">
            Submit General Application
          </Button>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

interface Job {
  title: string;
  location: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract";
  description: string;
}

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <Badge className="bg-carbon-500">{job.type}</Badge>
        </div>
        <CardDescription className="text-base flex gap-2 items-center mt-2">
          <MapPin className="h-4 w-4" /> {job.location} • {job.department}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{job.description}</p>
        <Button variant="outline" className="border-carbon-300 hover:bg-carbon-50 mt-2">
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  );
};

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ title, description, icon }) => {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

// Sample data
const jobPostings: Job[] = [
  {
    title: "Senior Software Engineer",
    location: "Remote",
    department: "Engineering",
    type: "Full-time",
    description: "Design and develop core features for our carbon calculation engine and data visualization components."
  },
  {
    title: "Sustainability Consultant",
    location: "New York, NY",
    department: "Client Services",
    type: "Full-time",
    description: "Help clients implement carbon reduction strategies and maximize the value of our platform."
  },
  {
    title: "Product Manager",
    location: "San Francisco, CA",
    department: "Product",
    type: "Full-time",
    description: "Drive the roadmap for our carbon management platform and collaborate with cross-functional teams."
  },
  {
    title: "UX/UI Designer",
    location: "Remote",
    department: "Design",
    type: "Full-time",
    description: "Create intuitive interfaces for complex carbon data visualization and analysis tools."
  }
];

export default Careers;
