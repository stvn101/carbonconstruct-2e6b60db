
import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import CTASection from '../components/CTASection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

function HomePage() {
  return (
    <>
      <Helmet>
        <title>CarbonConstruct - Sustainable Construction Management</title>
        <meta name="description" content="Track, manage, and optimize carbon emissions in construction projects with CarbonConstruct's sustainability-focused solution." />
      </Helmet>
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
