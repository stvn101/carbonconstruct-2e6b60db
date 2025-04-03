
import { useScrollTo } from "@/hooks/useScrollTo";
import HeroContent from "./hero/HeroContent";
import DashboardPreview from "./hero/DashboardPreview";
import SkeletonHero from "./hero/SkeletonHero";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const { scrollToElement } = useScrollTo();
  const handleLearnMore = scrollToElement('learn-more');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay to show skeleton
    // In a real app, this would be tied to actual resource loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Show skeleton for 1.2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <div className="flex flex-col md:flex-row items-center">
            <HeroContent handleLearnMore={handleLearnMore} />
            <DashboardPreview />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
