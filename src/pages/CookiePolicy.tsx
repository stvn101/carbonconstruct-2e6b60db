import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

const CookiePolicy = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SEO
        title="Cookie Policy - CarbonConstruct"
        description="Learn about how CarbonConstruct uses cookies on our website."
        canonical="/cookie-policy"
        type="article"
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        <div className="prose max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. What Are Cookies</h2>
          <p>
            Cookies are small pieces of text sent by your web browser by a website you visit. A cookie file is stored
            in your web browser and allows the service or a third-party to recognize you and make your next visit easier
            and the service more useful to you.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Cookies</h2>
          <p>
            When you use and access our service, we may place a number of cookies files in your web browser. We use cookies
            for the following purposes: to enable certain functions of the service, to provide analytics, to store your preferences,
            to enable advertisements delivery, including behavioral advertising.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Types of Cookies We Use</h2>
          <p>
            Essential cookies: These are cookies that are required for the operation of our website. They include, for example,
            cookies that enable you to log into secure areas of our website, use a shopping cart, or make use of e-billing services.
          </p>
          <p>
            Analytical/performance cookies: They allow us to recognize and count the number of visitors and to see how
            visitors move around our website when they are using it. This helps us to improve the way our website works,
            for example, by ensuring that users are finding what they are looking for easily.
          </p>
          <p>
            Functionality cookies: These are used to recognize you when you return to our website. This enables us to
            personalize our content for you, greet you by name and remember your preferences.
          </p>
          <p>
            Targeting cookies: These cookies record your visit to our website, the pages you have visited and the links
            you have followed. We will use this information to make our website and the advertising displayed on it more
            relevant to your interests.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Managing Cookies</h2>
          <p>
            Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from
            browser to browser, and from version to version. You can however obtain up-to-date information about blocking
            and deleting cookies via these links:
          </p>
          <ul className="list-disc pl-8 my-4">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-blue-600 hover:underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-blue-600 hover:underline">Microsoft Edge</a></li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Changes to This Cookie Policy</h2>
          <p>
            We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page.
            You are advised to review this Cookie Policy periodically for any changes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about our Cookie Policy, please contact us at privacy@carbonconstruct.com.
          </p>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default CookiePolicy;
