
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const TermsOfService = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Terms of Service - CarbonConstruct"
        description="Terms and conditions for using the CarbonConstruct platform."
        canonical="/terms-of-service"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CarbonConstruct's services, you agree to be bound by these Terms of Service and all applicable
            laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use CarbonConstruct's services for personal, non-commercial transitory viewing only.
            This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials;
            use the materials for any commercial purpose; attempt to decompile or reverse engineer any software contained on CarbonConstruct's website;
            remove any copyright or other proprietary notations from the materials; or transfer the materials to another person or "mirror"
            the materials on any other server.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Disclaimer</h2>
          <p>
            The materials on CarbonConstruct's website are provided on an 'as is' basis. CarbonConstruct makes no warranties,
            expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties
            or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other
            violation of rights.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Limitations</h2>
          <p>
            In no event shall CarbonConstruct or its suppliers be liable for any damages (including, without limitation, damages for loss
            of data or profit, or due to business interruption) arising out of the use or inability to use CarbonConstruct's materials,
            even if CarbonConstruct or a CarbonConstruct authorized representative has been notified orally or in writing of the possibility
            of such damage.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Accuracy of Materials</h2>
          <p>
            The materials appearing on CarbonConstruct's website could include technical, typographical, or photographic errors.
            CarbonConstruct does not warrant that any of the materials on its website are accurate, complete or current.
            CarbonConstruct may make changes to the materials contained on its website at any time without notice.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Links</h2>
          <p>
            CarbonConstruct has not reviewed all of the sites linked to its website and is not responsible for the contents of any
            such linked site. The inclusion of any link does not imply endorsement by CarbonConstruct of the site. Use of any such
            linked website is at the user's own risk.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications</h2>
          <p>
            CarbonConstruct may revise these terms of service for its website at any time without notice. By using this website
            you are agreeing to be bound by the then current version of these terms of service.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit
            to the exclusive jurisdiction of the courts in that location.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default TermsOfService;
