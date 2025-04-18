
import { motion } from "framer-motion";
import BillingToggle from "./BillingToggle";

interface PricingHeaderProps {
  annual: boolean;
  onBillingChange: (value: boolean) => void;
}

const PricingHeader = ({ annual, onBillingChange }: PricingHeaderProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
        Transparent Pricing
      </h1>
      <p className="text-lg md:text-xl text-foreground/80 mb-10">
        Choose the plan that's right for your Australian construction business. All plans include our core carbon calculation engine.
      </p>
      
      <BillingToggle annual={annual} onChange={onBillingChange} />
    </motion.div>
  );
};

export default PricingHeader;
