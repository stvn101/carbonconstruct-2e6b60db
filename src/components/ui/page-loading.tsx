
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PageLoadingProps {
  isLoading: boolean;
  text?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({ 
  isLoading, 
  text = "Loading..." 
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card p-6 rounded-lg shadow-lg text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-500" />
            <p className="text-foreground font-medium">{text}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PageLoading;
