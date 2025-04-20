
import { motion } from "framer-motion";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import ThemeToggle from "@/components/ThemeToggle";

const Index = () => {
  // Track when users visit important sections
  useEffect(() => {
    // Setup intersection observer for tracking section views
    const sections = ['learn-more', 'features', 'testimonials', 'demo'];
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          // Track section view in Facebook Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', `View${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
          }
          
          // Track section view in Google Analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'section_view', {
              section_name: sectionId
            });
          }
        }
      });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });
    
    // Check if URL has a hash and scroll to that element
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO 
        title="CarbonConstruct - Sustainable Carbon Management for Construction"
        description="Track, manage, and reduce your construction project's carbon footprint with CarbonConstruct. The first SaaS platform designed specifically for construction sustainability."
        canonical="/"
        keywords="carbon tracking, construction sustainability, green building, carbon footprint, construction management"
        type="website"
      />
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
