import { Button } from "@/components/ui/button";
import { Building2, LeafyGreen } from "lucide-react";
import { m as motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/utils/animationVariants";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/auth';
import { useScrollTo } from "@/hooks/useScrollTo";

const HeroContent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { scrollToElement } = useScrollTo();

  // Preload the features section when the component mounts
  const preloadFeaturesSection = () => {
    import("@/components/FeaturesSection").then(() => {
      console.log("Features section preloaded successfully");
    }).catch(err => {
      console.error("Failed to preload Features section:", err);
    });
  };

  // Attempt to preload after a short delay
  React.useEffect(() => {
    const timer = setTimeout(preloadFeaturesSection, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLearnMore = () => {
    console.log("Learn More button clicked, attempting to scroll to features section");
    
    // Use enhanced scrollToElement with better defaults for lazy-loaded content
    scrollToElement('features', { 
      offset: 100,       // Increased offset to account for the fixed header
      attempts: 10,      // Try up to 10 times (increased from 5)
      delay: 250,        // Increased delay between attempts (from 200)
      initialDelay: 400  // Longer initial delay for lazy-loaded components to render
    })();
  };

  const handleTryCalculator = () => {
    navigate('/calculator', { state: { demoMode: true } });
  };

  return (
    <motion.div 
      className="md:w-1/2 mb-8 md:mb-0 md:pr-8 bg-white dark:bg-gray-900 p-6 rounded-lg"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.h1 
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight gradient-heading"
        variants={fadeInUp}
      >
        <span className="text-foreground dark:text-foreground">Build Greener, </span>
        <br />
        <span className="text-carbon-700 dark:text-carbon-300">Measure Smarter</span>
      </motion.h1>
      
      <motion.p 
        className="text-lg md:text-xl text-carbon-800 dark:text-carbon-200 mb-6 max-w-lg"
        variants={fadeInUp}
      >
        Track, manage, and reduce your construction project's carbon footprint with the first SaaS platform designed specifically for construction sustainability.
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4"
        variants={fadeInUp}
      >
        <Button 
          size="lg" 
          onClick={handleTryCalculator}
          className="bg-carbon-600 hover:bg-carbon-700 text-white transition-transform duration-200 hover:scale-105"
        >
          Try Calculator
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          onClick={handleLearnMore}
          className="border-carbon-500 text-carbon-800 hover:bg-carbon-100 dark:text-carbon-200 dark:hover:bg-carbon-800/50 transition-transform duration-200 hover:scale-105"
          id="learn-more-button" // Added ID for easier debugging
          aria-label="Learn more about CarbonConstruct features" // Added for accessibility
        >
          Learn More
        </Button>
      </motion.div>
      
      <motion.div 
        className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8"
        variants={fadeInUp}
      >
        <motion.div 
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/construction-companies" className="flex items-center">
            <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-2 mr-3">
              <Building2 className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
            </div>
            <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">For Construction Companies</p>
          </Link>
        </motion.div>
        <motion.div 
          className="flex items-center cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/sustainable-building" className="flex items-center">
            <div className="bg-carbon-100 dark:bg-carbon-700 rounded-full p-2 mr-3">
              <LeafyGreen className="h-5 w-5 text-carbon-700 dark:text-carbon-200" />
            </div>
            <p className="text-sm font-medium text-carbon-800 dark:text-carbon-200">Sustainable Building</p>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
