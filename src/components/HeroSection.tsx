
import { Button } from "@/components/ui/button";
import { BarChart3, Building2, LeafyGreen } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('learn-more');
    if (element) {
      const navbarHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemFade = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const dashboardVariants = {
    initial: { opacity: 0, scale: 0.9, rotate: -1 },
    animate: { 
      opacity: 1, 
      scale: 1,
      rotate: -1,
      transition: {
        duration: 0.7,
        delay: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div 
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight gradient-heading"
              variants={itemFade}
            >
              <span className="text-foreground dark:text-foreground">Build Greener, </span>
              <br />
              <span className="text-carbon-700 dark:text-carbon-300">Measure Smarter</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-carbon-800 dark:text-carbon-200 mb-6 max-w-lg"
              variants={itemFade}
            >
              Track, manage, and reduce your construction project's carbon footprint with the first SaaS platform designed specifically for construction sustainability.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemFade}
            >
              <Button size="lg" asChild className="bg-carbon-600 hover:bg-carbon-700 text-white transition-transform duration-200 hover:scale-105">
                <a href="#demo">Get Started</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-carbon-500 text-carbon-800 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800/50 transition-transform duration-200 hover:scale-105">
                <a href="#learn-more" onClick={handleLearnMore}>Learn More</a>
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8"
              variants={itemFade}
            >
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-2 mr-3">
                  <Building2 className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
                </div>
                <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">For Construction Companies</p>
              </motion.div>
              <motion.div 
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-2 mr-3">
                  <LeafyGreen className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
                </div>
                <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">Sustainable Building</p>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial="initial"
            animate="animate"
            variants={fadeIn}
          >
            <motion.div 
              className="relative"
              variants={dashboardVariants}
              initial="initial"
              animate="animate"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-carbon-300 to-carbon-100 dark:from-carbon-700 dark:to-carbon-500 rounded-2xl transform rotate-1"></div>
              <div className="relative bg-white dark:bg-gray-800 border border-border rounded-2xl shadow-lg p-6 transform -rotate-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Project Carbon Dashboard</h3>
                  <BarChart3 className="h-5 w-5 text-carbon-500" />
                </div>
                <div className="space-y-4">
                  <motion.div 
                    className="bg-secondary/50 p-4 rounded-lg"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Carbon Score</span>
                      <span className="text-sm font-bold text-carbon-600 dark:text-carbon-300">78/100</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <motion.div 
                        className="bg-carbon-500 dark:bg-carbon-400 h-2 rounded-full" 
                        style={{ width: '0%' }}
                        animate={{ width: '78%' }}
                        transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                  </motion.div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { title: "Materials", value: "42.3", unit: "tonnes CO₂e" },
                      { title: "Transport", value: "28.7", unit: "tonnes CO₂e" },
                      { title: "Energy", value: "15.2", unit: "tonnes CO₂e" },
                      { title: "Total", value: "86.2", unit: "tonnes CO₂e" },
                    ].map((item, index) => (
                      <motion.div 
                        key={item.title}
                        className="bg-secondary/50 p-3 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1 + (index * 0.15) }}
                        whileHover={{ 
                          scale: 1.03,
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                        }}
                      >
                        <div className="text-sm font-medium mb-1">{item.title}</div>
                        <div className="text-xl font-bold text-carbon-600 dark:text-carbon-300">{item.value}</div>
                        <div className="text-xs text-carbon-700 dark:text-carbon-400">{item.unit}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
