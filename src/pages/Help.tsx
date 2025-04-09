
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HelpTutorial from "@/components/HelpTutorial";

const Help = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Help & Tutorials | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Learn how to use the Carbon Construction Calculator with our detailed tutorials and guides."
        />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4">
          <HelpTutorial />
        </div>
      </main>
      
      <Footer />
    </motion.div>
  );
};

export default Help;
