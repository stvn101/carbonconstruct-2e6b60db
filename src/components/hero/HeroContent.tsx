
import { Button } from "@/components/ui/button";
import { Building2, LeafyGreen } from "lucide-react";
import { motion } from "framer-motion";

interface HeroContentProps {
  handleLearnMore: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HeroContent = ({ handleLearnMore }: HeroContentProps) => {
  // Animation variants
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

  return (
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
  );
};

export default HeroContent;
