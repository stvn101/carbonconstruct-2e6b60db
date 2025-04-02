
import { Building, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

const CTAStats = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
      <motion.div 
        className="flex items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <Building className="h-5 w-5 mr-2 opacity-70" />
        <span>Used by 200+ construction companies</span>
      </motion.div>
      <motion.div 
        className="flex items-center justify-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <CalendarDays className="h-5 w-5 mr-2 opacity-70" />
        <span>Get started in less than 30 minutes</span>
      </motion.div>
    </div>
  );
};

export default CTAStats;
