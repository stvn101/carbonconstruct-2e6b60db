
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { LeafyGreen, Lightbulb, BarChart, Building, Recycle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/utils/animationVariants';
import ErrorBoundary from '@/components/ErrorBoundary';

const SustainableBuilding = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Add a useEffect with a timer to prevent infinite loading states
  useEffect(() => {
    // Set a timeout to ensure loading state doesn't persist indefinitely
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Simulate content loading - we would remove this in a production app
    // but it helps break out of any potential infinite loading states
    setIsLoading(false);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24">
          <div className="container mx-auto px-4 py-16">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <ErrorBoundary feature="Sustainable Building">
          <section className="py-16 md:py-24 container mx-auto px-4">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <motion.div variants={fadeInUp} className="mb-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-carbon-100 mb-4">
                  <LeafyGreen className="h-8 w-8 text-carbon-700" />
                </div>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
                Sustainable Building Solutions
              </motion.h1>
              <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
                Build a greener future with sustainable construction practices, Australian-focused materials, 
                and carbon-reducing strategies that benefit both the environment and your bottom line.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <Button asChild size="lg">
                  <Link to="/calculator">Try Our Calculator</Link>
                </Button>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
              {[
                {
                  icon: <Lightbulb className="h-8 w-8 text-carbon-600" />,
                  title: "Energy Efficiency",
                  description: "Implement strategies to reduce operational energy consumption in buildings through smart design and materials."
                },
                {
                  icon: <Recycle className="h-8 w-8 text-carbon-600" />,
                  title: "Circular Materials",
                  description: "Utilize recycled and recyclable materials to minimize waste and reduce embodied carbon."
                },
                {
                  icon: <BarChart className="h-8 w-8 text-carbon-600" />,
                  title: "Carbon Reduction",
                  description: "Measure and track carbon metrics throughout your project to identify optimization opportunities."
                },
                {
                  icon: <Building className="h-8 w-8 text-carbon-600" />,
                  title: "Australian Standards",
                  description: "Meet and exceed Australian building sustainability standards and certification requirements."
                },
                {
                  icon: <LeafyGreen className="h-8 w-8 text-carbon-600" />,
                  title: "Green Infrastructure",
                  description: "Incorporate nature-based solutions that enhance biodiversity and reduce urban heat islands."
                },
                {
                  icon: <Lightbulb className="h-8 w-8 text-carbon-600" />,
                  title: "Innovation",
                  description: "Stay ahead with the latest sustainable building technologies and practices from around the world."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white dark:bg-gray-800 border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-carbon-100 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-bold mb-6">Ready to make your building projects sustainable?</h2>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/materials">Browse Sustainable Materials</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing">View Pricing Plans</Link>
                </Button>
              </div>
            </div>
          </section>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default SustainableBuilding;
