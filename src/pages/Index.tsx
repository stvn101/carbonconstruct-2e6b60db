import { motion } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import { preloadComponent } from "@/utils/lazyLoad";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ThemeToggle from "@/components/ThemeToggle";
import SEO from "@/components/SEO";

const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const BenefitsSection = lazy(() => import("@/components/BenefitsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const Footer = lazy(() => import("@/components/Footer"));

if (typeof window !== 'undefined') {
  import("@/pages/Calculator").then(() => {
    console.log("Calculator page preloaded");
  });
}

const Index = () => {
  useEffect(() => {
    const sections = ['learn-more', 'features', 'testimonials', 'demo'];
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          
          if (typeof window !== 'undefined') {
            if ('requestIdleCallback' in window) {
              (window as any).requestIdleCallback(() => {
                if ((window as any).fbq) {
                  (window as any).fbq('trackCustom', `View${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
                }
                
                if ((window as any).gtag) {
                  (window as any).gtag('event', 'section_view', {
                    section_name: sectionId
                  });
                }
                
                if (sectionId === 'features') {
                  preloadComponent(() => import("@/components/TestimonialsSection"));
                } else if (sectionId === 'testimonials') {
                  preloadComponent(() => import("@/components/BenefitsSection"));
                }
              });
            } else {
              if ((window as any).fbq) {
                (window as any).fbq('trackCustom', `View${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}Section`);
              }
              
              if ((window as any).gtag) {
                (window as any).gtag('event', 'section_view', {
                  section_name: sectionId
                });
              }
            }
          }
        }
      });
    }, observerOptions);
    
    sections.forEach(sectionId => {
      const element = document.getElementById(sectionId);
      if (element) {
        sectionObserver.observe(element);
      }
    });
    
    if (window.location.hash) {
      requestAnimationFrame(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
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
      transition={{ duration: 0.3 }}
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
        <Suspense fallback={<div className="h-20" />}>
          <FeaturesSection />
        </Suspense>
        <Suspense fallback={<div className="h-20" />}>
          <TestimonialsSection />
        </Suspense>
        <Suspense fallback={<div className="h-20" />}>
          <BenefitsSection />
        </Suspense>
        <Suspense fallback={<div className="h-20" />}>
          <CTASection />
        </Suspense>
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Suspense fallback={<div className="h-16 bg-background" />}>
        <Footer />
      </Suspense>
    </motion.div>
  );
};

export default Index;
