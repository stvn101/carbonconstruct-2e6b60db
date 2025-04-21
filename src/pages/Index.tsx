
import { motion } from "framer-motion";
import { useEffect, lazy, Suspense } from "react";
import { preloadComponent } from "@/utils/lazyLoad";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ThemeToggle from "@/components/ThemeToggle";
import SEO from "@/components/SEO";
import CalculatorDemoVideo from "@/components/CalculatorDemoVideo";

const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const BenefitsSection = lazy(() => import("@/components/BenefitsSection"));
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
        <CalculatorDemoVideo />
        <Suspense fallback={<div className="h-20" />}>
          <FeaturesSection />
        </Suspense>

        {/* --- Begin Replacement for TestimonialsSection --- */}
        <section className="py-12 md:py-20 bg-secondary/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What CarbonConstruct Can Do for Your Company
              </h2>
              <p className="text-lg text-muted-foreground">
                The all-in-one platform empowering construction companies to meet climate disclosure regulations and build a more sustainable future, starting now.
              </p>
            </div>
            <div className="max-w-4xl mx-auto bg-white dark:bg-carbon-900 rounded-xl shadow-md p-8 md:p-10 space-y-6 border border-carbon-100 dark:border-carbon-800">
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
                Don’t wait for the deadline—get started now and turn compliance into a competitive advantage.
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

