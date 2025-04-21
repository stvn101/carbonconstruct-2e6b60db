import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const DataProcessing = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Data Processing - CarbonConstruct"
        description="Information about how CarbonConstruct processes and handles data."
        canonical="/data-processing"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Data Processing Agreement</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            This Data Processing Agreement ("DPA") forms part of the Terms of Service between CarbonConstruct ("we", "us", "our", or the "Data Processor") 
            and our customers ("you", "your", or the "Data Controller") regarding the processing of personal data.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
          <p>
            "Personal Data" means any information relating to an identified or identifiable natural person ('data subject').
          </p>
          <p>
            "Processing" means any operation or set of operations which is performed on personal data, such as collection, recording, 
            organization, structuring, storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission, 
            dissemination or otherwise making available, alignment or combination, restriction, erasure or destruction.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Processing</h2>
          <p>
            3.1 The Data Processor shall process Personal Data only on documented instructions from the Data Controller.
          </p>
          <p>
            3.2 The Data Processor shall ensure that persons authorized to process the Personal Data have committed themselves 
            to confidentiality or are under an appropriate statutory obligation of confidentiality.
          </p>
          <p>
            3.3 The Data Processor shall take all measures required pursuant to Article 32 of the GDPR (Security of processing).
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Sub-processing</h2>
          <p>
            4.1 The Data Processor shall not engage another processor without prior specific or general written authorization of the Data Controller.
          </p>
          <p>
            4.2 Where the Data Processor engages another processor for carrying out specific processing activities on behalf of the Data Controller, 
            the same data protection obligations as set out in this DPA shall be imposed on that other processor.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Subject Rights</h2>
          <p>
            5.1 The Data Processor shall assist the Data Controller by appropriate technical and organizational measures for the fulfillment 
            of the Data Controller's obligation to respond to requests for exercising the data subject's rights.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Breach Notification</h2>
          <p>
            6.1 The Data Processor shall notify the Data Controller without undue delay after becoming aware of a personal data breach.
          </p>
          <p>
            6.2 The notification shall at least:
            <br />- Describe the nature of the personal data breach
            <br />- Communicate the name and contact details of the data protection officer
            <br />- Describe the likely consequences of the personal data breach
            <br />- Describe the measures taken or proposed to address the personal data breach
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Data Protection Impact Assessment</h2>
          <p>
            The Data Processor shall provide reasonable assistance to the Data Controller with any data protection impact assessments 
            which are required under Article 35 of the GDPR.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Return/Deletion of Data</h2>
          <p>
            At the choice of the Data Controller, the Data Processor shall delete or return all Personal Data to the Data Controller after 
            the end of the provision of services relating to processing, and delete existing copies unless applicable law requires storage of the Personal Data.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Audit Rights</h2>
          <p>
            The Data Processor shall make available to the Data Controller all information necessary to demonstrate compliance with 
            the obligations laid down in this DPA and allow for and contribute to audits, including inspections, conducted by the 
            Data Controller or another auditor mandated by the Data Controller.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Information</h2>
          <p>
            For questions about this Data Processing Agreement, please contact us at dpo@carbonconstruct.com.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default DataProcessing;
