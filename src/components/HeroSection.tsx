
import { useScrollTo } from "@/hooks/useScrollTo";
import HeroContent from "./hero/HeroContent";
import DashboardPreview from "./hero/DashboardPreview";

const HeroSection = () => {
  const { scrollToElement } = useScrollTo();
  const handleLearnMore = scrollToElement('learn-more');

  return (
    <section className="pt-24 pb-12 md:pt-28 md:pb-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <HeroContent handleLearnMore={handleLearnMore} />
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
