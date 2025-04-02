
import { useEffect } from "react";
import CTAContainer from "./cta/CTAContainer";
import CTAStats from "./cta/CTAStats";

const CTASection = () => {
  // Track CTA view for analytics
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Track CTA section view in Facebook Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'CTASectionView');
          }
          
          // Track CTA section view in Google Analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'view_promotion', {
              promotion_name: 'demo_cta'
            });
          }
          
          // Disconnect once tracked
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    const ctaSection = document.getElementById('demo');
    if (ctaSection) observer.observe(ctaSection);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="demo" className="py-12 md:py-20 bg-carbon-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build a Greener Future?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Join construction companies across the world who are reducing their carbon footprint and meeting sustainability goals with CarbonConstruct.
          </p>
          <CTAContainer />
          <CTAStats />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
