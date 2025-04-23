
import React, { lazy, Suspense, useState, useEffect, useCallback } from "react";
import SkeletonHero from "./hero/SkeletonHero";
import { LazyMotion, domAnimation } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary";

// Lazily load non-critical components
const HeroContent = lazy(() => 
  import("./hero/HeroContent").catch(() => {
    console.error("Failed to load HeroContent");
    return { 
      default: () => <div className="md:w-1/2 p-6 bg-white dark:bg-gray-900">
        <h1 className="text-3xl font-bold">Build Greener, Measure Smarter</h1>
        <p className="mt-4">Track, manage, and reduce your construction project's carbon footprint.</p>
      </div> 
    };
  })
);

const DashboardPreview = lazy(() => 
  import("./hero/DashboardPreview").catch(() => {
    console.error("Failed to load DashboardPreview");
    return { 
      default: (props: any) => {
        if (props.onLoad) {
          // Make sure to call onLoad to prevent loading indicator from showing indefinitely
          setTimeout(props.onLoad, 0);
        }
        return <div className="md:w-1/2 bg-secondary/20 rounded-lg p-6">Dashboard preview unavailable</div>;
      }
    };
  })
);

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resourcesLoaded, setResourcesLoaded] = useState(0);
  const totalResources = 1;

  const handleResourceLoad = useCallback(() => {
    setResourcesLoaded(prev => {
      const newCount = prev + 1;
      if (newCount >= totalResources) {
        setIsLoading(false);
      }
      return newCount;
    });
  }, []);

  useEffect(() => {
    // Fallback timeout in case load events don't fire
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        {isLoading ? (
          <SkeletonHero />
        ) : (
          <ErrorBoundary feature="Hero Section">
            <LazyMotion features={domAnimation}>
              <div className="flex flex-col md:flex-row items-center">
                <Suspense fallback={<div className="md:w-1/2 animate-pulse h-64 bg-secondary/20 rounded-lg" />}>
                  <HeroContent />
                </Suspense>
                <Suspense fallback={<div className="md:w-1/2 animate-pulse h-64 bg-secondary/20 rounded-lg" />}>
                  <DashboardPreview onLoad={handleResourceLoad} />
                </Suspense>
              </div>
            </LazyMotion>
          </ErrorBoundary>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
