
import { motion } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import { preloadComponent } from "@/utils/lazyLoad";
import Navbar from "@/components/navbar/Navbar";
import HeroSection from "@/components/HeroSection";
import ThemeToggle from "@/components/ThemeToggle";
import SEO from "@/components/SEO";
import CalculatorDemoVideo from "@/components/CalculatorDemoVideo";
import { useA11y } from "@/hooks/useA11y";
import Footer from "@/components/Footer"; 

// Direct import FeaturesSection to ensure it's available immediately
// This is critical for the Learn More button
import FeaturesSection from "@/components/FeaturesSection";

// Lazy load other non-critical components
const BenefitsSection = lazy(() => import("@/components/BenefitsSection"));
const CTASection = lazy(() => import("@/components/CTASection"));

// Preload Calculator for better UX
if (typeof window !== 'undefined') {
  import("@/pages/Calculator").then(() => {
    console.log("Calculator page preloaded");
  });
}

const Index = () => {
  useA11y({
    title: "CarbonConstruct - Sustainable Carbon Management for Construction",
    announceRouteChanges: true,
  });

  useEffect(() => {
    // Register an intersection observer to detect when sections come into view
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
          console.log(`Section ${sectionId} is now visible`);

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

    // Also handle direct navigation to sections via hash
    if (window.location.hash) {
      requestAnimationFrame(() => {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
            console.log(`Scrolled to hash target: #${id}`);
          }, 800); // Increased delay for more reliable scrolling
        }
      });
    }

    // Start observing sections after a small delay to ensure they're rendered
    setTimeout(() => {
      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          sectionObserver.observe(element);
          console.log(`Now observing section: #${sectionId}`);
        } else {
          console.warn(`Section #${sectionId} not found in DOM`);
        }
      });
    }, 500); // Increased from 300 to give more time

    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col mobile-friendly-container bg-white dark:bg-gray-900 overflow-x-hidden"
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
      <main id="main-content" tabIndex={-1} className="flex-1 pt-16 md:pt-16 bg-white dark:bg-gray-900">
        <div className="overflow-x-hidden w-full">
          <HeroSection />
          <CalculatorDemoVideo />
          
          {/* Import FeaturesSection directly - this is crucial for the Learn More button */}
          <FeaturesSection />

          {/* --- Begin Replacement for TestimonialsSection --- */}
          <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-800">
            <div className="container mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10 px-4">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  What CarbonConstruct Can Do for Your Company
                </h2>
                <p className="text-base md:text-lg text-muted-foreground">
                  The all-in-one platform empowering construction companies to meet climate disclosure regulations and build a more sustainable future, starting now.
                </p>
              </div>
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md p-4 md:p-10 space-y-6 border border-carbon-100 dark:border-carbon-800 m-4">
                <h3 className="text-2xl font-semibold text-carbon-800 dark:text-white mb-2">
                  Smarter Carbon Tracking, Made for Construction
                </h3>
                <p className="text-md text-carbon-700 dark:text-carbon-100">
                  <strong>CarbonConstruct</strong> is purpose-built for construction professionals—developers, builders, consultants, and contractors—who want to take charge of their carbon emissions. Our platform features the <strong>CarbonCalculator</strong>: an easy-to-use tool that lets you accurately measure, analyze, and reduce emissions from materials, transport, and energy use across your projects. Generate instant reports for Scope 1, 2, and 3 emissions, compare performance, and demonstrate progress to clients and auditors.
                </p>

                <h3 className="text-xl font-semibold text-carbon-800 dark:text-white mt-2">
                  Why You Need to Start Now
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-carbon-700 dark:text-carbon-200">
                  <li>The <b>Australian Federal Government</b> has introduced new laws <b>mandating climate-related financial disclosures</b> for large and medium-sized businesses, effective <span className="font-medium text-carbon-900 dark:text-carbon-100">January 1, 2025</span>.</li>
                  <li>
                    Under the{' '}
                    <span className="font-medium text-carbon-900 dark:text-carbon-100">
                      Treasury Laws Amendment (Financial Market Infrastructure and Other Measures) Bill 2024
                    </span>
                    , construction companies must report on climate-related risks, opportunities, and <b>Scope 1, 2, and 3 emissions</b>.
                  </li>
                  <li>Start today to streamline compliance, avoid penalties, and enhance your company's reputation as a leader in sustainability.</li>
                </ul>

                <h3 className="text-xl font-semibold text-carbon-800 dark:text-white mt-4">
                  Streamline Your Path to Compliance
                </h3>
                <p className="text-md text-carbon-700 dark:text-carbon-100">
                  Instead of scrambling to gather complex data, <strong>CarbonConstruct</strong> simplifies everything—so you can focus on building, not bureaucracy. Our automated reports are audit-ready, aligned with the latest standards, and always up-to-date for regulatory changes. Rest easy knowing your emissions tracking and climate disclosures are handled—all in a secure, central platform made for the construction industry.<br /><br />
                  Don't wait for the deadline—get started now and turn compliance into a competitive advantage.
                </p>
              </div>
            </div>
          </section>
          {/* --- End Replacement for TestimonialsSection --- */}

          <Suspense fallback={<div className="h-20" />}>
            <BenefitsSection />
          </Suspense>
          <Suspense fallback={<div className="h-20" />}>
            <CTASection />
          </Suspense>
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-40">
        <ThemeToggle />
      </div>
      <Footer />
    </motion.div>
  );
};

export default Index;
