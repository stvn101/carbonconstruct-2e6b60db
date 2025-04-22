
import React from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import MaterialDatabase from "@/components/materials/MaterialDatabase";

const MaterialDatabasePage = () => {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Materials Database | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Browse sustainable building materials and their carbon footprint data."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow">
        <MaterialDatabase />
      </main>
      <Footer />
    </motion.div>
  );
};

export default MaterialDatabasePage;
