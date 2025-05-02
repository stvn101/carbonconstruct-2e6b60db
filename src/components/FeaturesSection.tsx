
import { Calculator, Database, FileText, GraduationCap, BarChart3, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";
import { useEffect, useRef } from "react";

const FeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Enhanced logging for when the section mounts to help with debugging
  useEffect(() => {
    if (sectionRef.current) {
      console.log("📋 Features section mounted with ID:", sectionRef.current.id);
      // Add multiple classes to make it easier to find in the DOM
      sectionRef.current.classList.add("features-section-loaded");
      sectionRef.current.classList.add("features-section");
      
      // Dispatch a custom event that can be listened for
      const event = new CustomEvent('featuresSectionLoaded', { detail: { id: 'features' } });
      document.dispatchEvent(event);
      
      // Set a direct ID on the element content for redundancy
      const contentDiv = sectionRef.current.querySelector('.container');
      if (contentDiv) {
        contentDiv.id = "features-content";
      }
    }
  }, []);

  const features = [
    {
      icon: Calculator,
      title: "Carbon Footprint Calculator",
      description: "Accurate emissions tracking for your projects",
      items: [
        "Material-specific emissions data",
        "Transportation distance calculations",
        "Energy consumption analysis"
      ],
      explanationContent: "Our carbon footprint calculator helps you precisely measure the environmental impact of your construction projects by breaking down emissions across different categories like materials, transportation, and energy use."
    },
    {
      icon: Database,
      title: "Material Database",
      description: "Comprehensive carbon coefficients for materials",
      items: [
        "Thousands of materials cataloged",
        "Region-specific carbon data",
        "Alternative material suggestions"
      ],
      explanationContent: "Access a comprehensive database of construction materials with detailed carbon coefficients, helping you make informed decisions about material selection to minimize environmental impact."
    },
    {
      icon: FileText,
      title: "Project Reporting",
      description: "Clear insights into your environmental impact",
      items: [
        "Sustainability score metrics",
        "Regulatory compliance tracking",
        "Exportable PDF reports"
      ],
      explanationContent: "Generate detailed, professional reports that provide clear insights into your project's carbon footprint, helping you track progress and demonstrate sustainability efforts to stakeholders."
    },
    {
      icon: FileCheck2,
      title: "Easy Integration",
      description: "Works with your existing workflows",
      items: [
        "Simple data import/export",
        "Works alongside existing software",
        "No workflow disruption"
      ],
      explanationContent: "Seamlessly integrate our carbon tracking tools into your existing project management workflows without disrupting your current processes."
    },
    {
      icon: BarChart3,
      title: "Benchmarking",
      description: "Compare your performance against industry standards",
      items: [
        "Industry-wide comparisons",
        "Project-to-project analysis",
        "Improvement recommendations"
      ],
      explanationContent: "Compare your project's carbon performance against industry benchmarks and receive actionable recommendations for reducing your environmental impact."
    },
    {
      icon: GraduationCap,
      title: "Educational Resources",
      description: "Learn about sustainable construction practices",
      items: [
        "Video tutorials and guides",
        "Best practice documentation",
        "Regular sustainability updates"
      ],
      explanationContent: "Access a comprehensive library of educational resources to help your team understand and implement sustainable construction practices."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-12 md:py-20 bg-white dark:bg-gray-900 scroll-mt-28 features-section" 
      data-section="features"
      aria-label="Features Section"
      role="features"
      tabIndex={-1} // Make it focusable for scrolling
    >
      <div id="features-inner" className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">Sustainable Construction Made Simple</h2>
          <p className="text-lg text-muted-foreground">
            Our platform provides everything you need to measure, track, and reduce the carbon footprint of your construction projects.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
                items={feature.items}
                explanationContent={feature.explanationContent}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
