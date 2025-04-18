
import { motion } from "framer-motion";

const ContactHeader = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center max-w-3xl mx-auto mb-16"
    >
      <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">Get in Touch</h1>
      <p className="text-lg md:text-xl text-foreground/80">
        Have questions about our platform or want to schedule a demo? We're here to help you build more sustainably.
      </p>
    </motion.div>
  );
};

export default ContactHeader;
