
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Check, PlayCircle } from "lucide-react";

const Demo = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Success notification
    toast({
      title: "Demo request submitted",
      description: "We'll contact you shortly to schedule your personalized demo.",
      variant: "default"
    });
    
    setIsSubmitted(true);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Request a Demo - CarbonConstruct"
        description="Schedule a personalized demonstration of the CarbonConstruct platform."
        canonical="/demo"
        type="website"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Request a Demo</h1>
        <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto mb-12">
          See firsthand how CarbonConstruct can help your construction projects reduce their carbon footprint.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold mb-6">What You'll See</h2>
            
            <div className="space-y-6">
              <DemoFeature 
                title="Materials Database & Calculation Engine"
                description="Explore our comprehensive database of construction materials and how our engine calculates embodied carbon."
                icon={<Check className="h-5 w-5 text-green-500" />}
              />
              
              <DemoFeature 
                title="Project Reporting & Analytics"
                description="See how you can generate detailed reports and visualize your project's carbon performance."
                icon={<Check className="h-5 w-5 text-green-500" />}
              />
              
              <DemoFeature 
                title="Benchmarking & Comparison Tools"
                description="Learn how to compare your project against industry standards and identify improvement opportunities."
                icon={<Check className="h-5 w-5 text-green-500" />}
              />
              
              <DemoFeature 
                title="Integration Capabilities"
                description="Discover how CarbonConstruct integrates with your existing software and workflows."
                icon={<Check className="h-5 w-5 text-green-500" />}
              />
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-medium mb-4">Demo Options</h3>
              <div className="flex items-center gap-3 mb-3">
                <PlayCircle className="h-5 w-5 text-carbon-500" />
                <span>Live online demo (45 minutes)</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-carbon-500" />
                <span>On-site demonstration (by arrangement)</span>
              </div>
            </div>
          </div>
          
          <div>
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your demo request has been received. A member of our team will contact you within one business day to schedule your personalized demonstration.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Request Another Demo
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">Schedule Your Demo</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input 
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full bg-carbon-600 hover:bg-carbon-700 mt-6">
                      Request Demo
                    </Button>
                    
                    <p className="text-xs text-muted-foreground mt-4">
                      By requesting a demo, you agree to our <a href="/privacy-policy" className="underline">Privacy Policy</a> and <a href="/terms-of-service" className="underline">Terms of Service</a>.
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

interface DemoFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const DemoFeature: React.FC<DemoFeatureProps> = ({ title, description, icon }) => {
  return (
    <div className="flex gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Demo;
