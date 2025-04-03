
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const PrivacyPolicy = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Privacy Policy - CarbonConstruct"
        description="Our Privacy Policy regarding data collection and usage at CarbonConstruct."
        canonical="/privacy-policy"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            This Privacy Policy explains how CarbonConstruct ("we", "us", or "our") collects, uses, and shares information 
            about you when you use our website, products, and services. We respect your privacy and are committed to 
            protecting your personal data.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter,
            contact us for support, or otherwise communicate with us. This information may include your name, email address,
            company name, job title, and any other information you choose to provide.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to develop new services,
            and to protect our company and users.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>
            We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes.
            We may share information in the following circumstances: with your consent, to comply with laws, to protect your rights,
            or to fulfill business obligations.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Security</h2>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access,
            disclosure, alteration, and destruction.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as the right to
            access, correct, or delete your personal information.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Privacy Policy</h2>
          <p>
            We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date
            at the top of the policy.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@carbonconstruct.com.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
