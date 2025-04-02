
import { Check, Info } from "lucide-react";
import { motion } from "framer-motion";

const CTASuccessMessage = () => {
  return (
    <motion.div 
      className="py-10 text-center"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <motion.div 
        className="mx-auto bg-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
      >
        <Check className="h-8 w-8 text-green-400" />
      </motion.div>
      <h3 className="text-xl font-semibold mb-2">Demo Request Submitted!</h3>
      <p className="text-white/80">Thank you for your interest. Our team will contact you shortly.</p>
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-2 text-sm bg-white/10 p-3 rounded-lg">
          <Info className="h-4 w-4 text-blue-300" />
          <p>We've sent a confirmation to your email</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CTASuccessMessage;
