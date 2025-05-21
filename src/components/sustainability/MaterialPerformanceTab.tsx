
import React from "react";
import { motion } from "framer-motion";
import MaterialPerformanceDashboard from "./MaterialPerformanceDashboard";

interface MaterialPerformanceTabProps {
  materials: any[];
  className?: string;
}

const MaterialPerformanceTab: React.FC<MaterialPerformanceTabProps> = ({ materials, className }) => {
  return (
    <div className={className}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <MaterialPerformanceDashboard materials={materials} />
      </motion.div>
    </div>
  );
};

export default MaterialPerformanceTab;
