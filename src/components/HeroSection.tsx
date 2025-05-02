
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { preloadComponent } from "@/utils/lazyLoad";

const HeroSection = () => {
  const navigate = useNavigate();

  // Preload calculator when user hovers over the Try Calculator button
  const handleMouseOverCalculator = useCallback(() => {
    // Preload the Calculator page
    preloadComponent(() => import("@/pages/Calculator"));
    
    // Also preload essential calculator components
    preloadComponent(() => import("@/components/CarbonCalculator"));
    // Fix: Use a component that has a default export instead of a named export
    preloadComponent(() => import("@/contexts/calculator"));
  }, []);

  // Preload calculator when user scrolls down, indicating engagement
  React.useEffect(() => {
    const handleScroll = () => {
      // If user has scrolled more than 20% of screen height
      if (window.scrollY > window.innerHeight * 0.2) {
        preloadComponent(() => import("@/pages/Calculator"));
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click with improved error handling
  const handleCalculatorClick = useCallback(() => {
    try {
      navigate('/calculator', { state: { source: 'hero_section' } });
    } catch (error) {
      console.error("Navigation error:", error);
      // As a fallback, use window.location
      window.location.href = '/calculator';
    }
  }, [navigate]);
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-12 md:py-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-10 md:mb-0 z-10">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-carbon-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block">Build Greener,</span>
            <span className="block text-carbon-600 dark:text-carbon-400">Measure Smarter</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Calculate, track, and reduce your construction project's carbon footprint with our comprehensive platform.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              className="text-base bg-carbon-600 hover:bg-carbon-700 dark:bg-carbon-500 dark:hover:bg-carbon-600"
              onClick={handleCalculatorClick}
              onMouseOver={handleMouseOverCalculator}
              onFocus={handleMouseOverCalculator}
            >
              <Calculator className="mr-2 h-5 w-5" />
              Try Calculator
            </Button>
            <Link to="#learn-more">
              <Button variant="outline" size="lg" className="text-base bg-white dark:bg-transparent">
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-sm text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p>3 builders currently testing, with Master Builders Queensland exploring a beta for their network.</p>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 relative">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-carbon-50 dark:bg-carbon-800 opacity-50 md:opacity-70 w-[80%] h-[80%] md:w-[100%] md:h-[100%] blur-3xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.5 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <motion.img
            src="/images/hero-image.webp"
            alt="Construction project carbon tracking"
            className="relative z-10 rounded-lg shadow-xl mx-auto"
            style={{ maxWidth: '90%', height: 'auto' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
