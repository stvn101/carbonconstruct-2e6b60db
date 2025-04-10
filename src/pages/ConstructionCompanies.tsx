
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Building2, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fadeInUp, staggerContainer } from '@/utils/animationVariants';

const ConstructionCompanies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-lg bg-carbon-100 mb-4">
                <Building2 className="h-8 w-8 text-carbon-700" />
              </div>
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold mb-6">
              Solutions for Construction Companies
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground mb-8">
              CarbonConstruct helps construction companies in Australia measure, manage, and reduce their carbon footprint
              through intelligent tools and actionable insights.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button asChild size="lg">
                <Link to="/pricing">Start Your Free Trial</Link>
              </Button>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Why Construction Companies Choose Us</h2>
              <ul className="space-y-4">
                {[
                  'Complete visibility into project carbon emissions',
                  'Compliance with Australian sustainability requirements',
                  'Cost reduction through optimized material sourcing',
                  'Competitive advantage in sustainability-focused tenders',
                  'Data-driven decisions for greener construction practices'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-carbon-600 mr-3 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="outline" asChild className="flex items-center">
                  <Link to="/case-studies">
                    View Case Studies <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-carbon-50 to-carbon-100 dark:from-carbon-900 dark:to-carbon-800 rounded-xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Getting Started is Easy</h2>
              <ol className="space-y-6">
                {[
                  { title: 'Sign Up for Trial', desc: 'Start with our 3-day free trial to explore all features' },
                  { title: 'Enter Your Project Data', desc: 'Use our simple calculator to measure your carbon footprint' },
                  { title: 'Get Actionable Insights', desc: 'Receive recommendations tailored to your construction projects' }
                ].map((step, index) => (
                  <li key={index} className="flex">
                    <div className="h-8 w-8 rounded-full bg-carbon-500 text-white flex items-center justify-center text-sm font-bold mr-4 shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Button asChild>
                  <Link to="/auth">Start Free Trial Now</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ConstructionCompanies;
