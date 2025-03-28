
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarbonCalculator from "@/components/CarbonCalculator";

const Calculator = () => {
  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Carbon Footprint Calculator | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Calculate the carbon footprint of your construction projects with our precise calculator that accounts for materials, transportation, and energy use."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <CarbonCalculator />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Calculator;
