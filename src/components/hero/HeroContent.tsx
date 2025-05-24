
import React from "react";
import { Button } from "@/components/ui/button";
import { Building2, LeafyGreen } from "lucide-react";
import { m as motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/utils/animationVariants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import { useScrollTo } from "@/hooks/useScrollTo";
// Direct import of FeaturesSection for preloading
import FeaturesSection from "@/components/FeaturesSection";

const HeroContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollToElement } = useScrollTo();

  // Enhanced preloading of the features section
  const preloadFeaturesSection = () => {
    try {
      console.log("⏱️ Attempting to preload Features section...");
      // Directly import to ensure it's loaded
      if (FeaturesSection) {
        console.log("✅ Features section preloaded successfully via direct import");
      }
      
      // Also try the dynamic import as a fallback
      import("@/components/FeaturesSection").then(() => {
        console.log("✅ Features section also preloaded via dynamic import");
      }).catch(err => {
        console.error("❌ Failed to preload Features section via dynamic import:", err);
      });
    } catch (error) {
      console.error("❌ Error during preload of Features section:", error);
    }
  };

  // Attempt to preload after a short delay
  React.useEffect(() => {
    console.log("🔄 Setting up preload timer for Features section");
    const timer = setTimeout(preloadFeaturesSection, 200);
    return () => clearTimeout(timer);
  }, []);

  // Listen for scroll events to help with debugging
  React.useEffect(() => {
    const handleScroll = () => {
      const featuresSection = document.getElementById('features');
      if (featuresSection) {
        const rect = featuresSection.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= window.innerHeight) {
          console.log("📍 Features section is now visible in viewport");
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Direct scroll function as backup without using hook
  const directScrollToFeatures = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log("⚡ Direct scroll to features initiated");
    
    // Try multiple approaches
    setTimeout(() => {
      try {
        // Try to find the element by id
        const element = document.getElementById('features') || 
                         document.querySelector('.features-section') || 
                         document.querySelector('[data-section="features"]');
                         
        if (element) {
          console.log("📍 Found features section, scrolling directly");
          const yOffset = -100; // Adjusted offset
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        } else {
          console.error("❌ Could not find features section for direct scroll");
        }
      } catch (error) {
        console.error("❌ Error in direct scroll:", error);
      }
    }, 1500);
  };
  
  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("🔘 Learn More button clicked, attempting to scroll to features section");
    
    // 1. Try to scroll directly first as immediate feedback
    setTimeout(() => {
      try {
        // Try to find the element by id
        const element = document.getElementById('features') || 
                         document.querySelector('.features-section') || 
                         document.querySelector('[data-section="features"]');
                         
        if (element) {
          console.log("📍 Found features section, scrolling directly");
          const yOffset = -100; // Adjusted offset
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          
          window.scrollTo({
            top: y,
            behavior: 'smooth'
          });
        } else {
          console.error("❌ Could not find features section for direct scroll");
        }
      } catch (error) {
        console.error("❌ Error in direct scroll:", error);
      }
    }, 1500);
    
    // 2. Also use enhanced scrollToElement with better defaults for lazy-loaded content
    scrollToElement('features', { 
      offset: 120,        // Increased offset to account for the fixed header
      attempts: 20,       // Try up to 20 times (increased from 15)
      delay: 350,         // Increased delay between attempts
      initialDelay: 1500  // Much longer initial delay for lazy-loaded components to render (1.5 second)
    })(e);
  };

  const handleTryCalculator = () => {
    navigate('/calculator', { state: { demoMode: true } });
  };

  return (
    <motion.div 
      className="md:w-1/2 mb-8 md:mb-0 md:pr-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <div className="text-center flex flex-col items-center justify-center h-full">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-center"
          variants={fadeInUp}
        >
          <span className="text-foreground dark:text-foreground">Build Greener, </span> 
          <br />
          <span className="text-carbon-700 dark:text-carbon-300">Measure Smarter</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-carbon-800 dark:text-carbon-200 mb-8 max-w-lg mx-auto text-center"
          variants={fadeInUp}
        >
          Track, manage, and reduce your construction project's carbon footprint with the first SaaS platform designed specifically for construction sustainability.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          variants={fadeInUp}
        >
          <Button 
            size="lg" 
            onClick={handleTryCalculator}
            className="bg-carbon-600 hover:bg-carbon-700 text-white transition-transform duration-200 hover:scale-105 rounded-xl"
          >
            Try Calculator
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleLearnMore}
            className="border-carbon-500 text-carbon-800 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800/50 transition-transform duration-200 hover:scale-105 rounded-xl"
            id="learn-more-button" 
            aria-label="Learn more about CarbonConstruct features"
          >
            Learn More
          </Button>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center w-full"
          variants={fadeInUp}
        >
          <motion.div 
            className="flex items-center justify-center cursor-pointer w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/construction-companies" className="flex items-center bg-carbon-50 dark:bg-carbon-800 p-4 rounded-xl hover:bg-carbon-100 dark:hover:bg-carbon-700 transition-colors w-full sm:w-auto justify-center">
              <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-3 mr-3">
                <Building2 className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
              </div>
              <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">For Construction Companies</p>
            </Link>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center cursor-pointer w-full sm:w-auto"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/sustainable-building" className="flex items-center bg-carbon-50 dark:bg-carbon-800 p-4 rounded-xl hover:bg-carbon-100 dark:hover:bg-carbon-700 transition-colors w-full sm:w-auto justify-center">
              <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-3 mr-3">
                <LeafyGreen className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
              </div>
              <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">Sustainable Building</p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroContent;
