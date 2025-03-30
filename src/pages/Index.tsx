
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect } from "react";

const Index = () => {
  // Add scroll to element handler
  useEffect(() => {
    // Check if URL has a hash and scroll to that element
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO />
      <Navbar />
      <main id="learn-more">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Footer />
    </motion.div>
  );
};

export default Index;
