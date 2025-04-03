
import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPreview = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Show actual content when the main content has loaded
  const handleContentLoad = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div 
      className="md:w-1/2"
      initial="initial"
      animate="animate"
      variants={fadeIn}
      onViewportEnter={handleContentLoad}
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
  );
};

export default DashboardPreview;
