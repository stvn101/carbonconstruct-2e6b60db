
import { useScrollTo } from "@/hooks/useScrollTo";
import HeroContent from "./hero/HeroContent";
import DashboardPreview from "./hero/DashboardPreview";
import SkeletonHero from "./hero/SkeletonHero";
import { useState, useEffect } from "react";
import { LazyMotion, domAnimation } from "framer-motion";

const HeroSection = () => {
  const { scrollToElement } = useScrollTo();
  const handleLearnMore = scrollToElement('learn-more');
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(0);
  const totalResources = 1; // Increase this number if loading more assets

  // Function to track when resources are loaded
  const handleResourceLoad = () => {
    setResourcesLoaded(prev => {
      const newCount = prev + 1;
      if (newCount >= totalResources) {
        setIsLoading(false);
      }
      return newCount;
    });
  };

  useEffect(() => {
    // Fallback to ensure we don't show the skeleton forever
    // Even if resources fail to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Max loading time

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <LazyMotion features={domAnimation}>
            <div className="flex flex-col md:flex-row items-center">
              <HeroContent handleLearnMore={handleLearnMore} />
              <DashboardPreview onLoad={handleResourceLoad} />
            </div>
          </LazyMotion>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
