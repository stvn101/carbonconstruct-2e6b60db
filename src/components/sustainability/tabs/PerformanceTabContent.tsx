
import React from "react";
import { motion } from "framer-motion";
import MaterialPerformanceTab from "../MaterialPerformanceTab";
import { MaterialInput } from "@/lib/carbonExports";

interface PerformanceTabContentProps {
  materials: MaterialInput[];
}

const PerformanceTabContent: React.FC<PerformanceTabContentProps> = ({
  materials
}) => {
  return (
    <motion.div
      className="mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <MaterialPerformanceTab materials={materials} />
    </motion.div>
  );
};

export default PerformanceTabContent;
