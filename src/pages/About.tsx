
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Building, Clock, BarChart } from "lucide-react";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">Our Mission</h1>
            <p className="text-lg md:text-xl text-foreground/80">
              At CarbonConstruct, we're committed to transforming the construction industry by providing innovative solutions that measure, reduce, and report carbon emissions throughout the building lifecycle.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-foreground/80 mb-4">
                  Founded in 2025 by construction and sustainability experts, CarbonConstruct emerged from a simple observation: the construction industry lacked accessible tools to measure and reduce its carbon footprint.
                </p>
                <p className="text-foreground/80">
                  What began as a carbon calculator has evolved into a comprehensive platform trusted by contractors, developers, and architecture firms worldwide to meet their sustainability goals and regulatory requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-foreground/80 mb-4">
                  We envision a future where every construction project is designed, built, and operated with its carbon impact as a primary consideration.
                </p>
                <p className="text-foreground/80">
                  By making carbon data accessible, actionable, and integrated into standard workflows, we aim to help the industry reduce its environmental impact while maintaining profitability and meeting project goals.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-10 gradient-heading">Company Facts</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="stat-card flex flex-col items-center justify-center p-6 text-center">
                <Users className="h-10 w-10 text-carbon-500 mb-3" />
                <h3 className="text-2xl font-bold text-foreground">50+</h3>
                <p className="text-foreground/70">Team Members</p>
              </div>
              
              <div className="stat-card flex flex-col items-center justify-center p-6 text-center">
                <Award className="h-10 w-10 text-carbon-500 mb-3" />
                <h3 className="text-2xl font-bold text-foreground">12</h3>
                <p className="text-foreground/70">Industry Awards</p>
              </div>
              
              <div className="stat-card flex flex-col items-center justify-center p-6 text-center">
                <Building className="h-10 w-10 text-carbon-500 mb-3" />
                <h3 className="text-2xl font-bold text-foreground">500+</h3>
                <p className="text-foreground/70">Projects Analyzed</p>
              </div>
              
              <div className="stat-card flex flex-col items-center justify-center p-6 text-center">
                <Clock className="h-10 w-10 text-carbon-500 mb-3" />
                <h3 className="text-2xl font-bold text-foreground">3+ years</h3>
                <p className="text-foreground/70">Industry Experience</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
