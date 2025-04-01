
import { Calculator, Database, FileText, GraduationCap, BarChart3, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: Calculator,
      title: "Carbon Footprint Calculator",
      description: "Accurate emissions tracking for your projects",
      items: [
        "Material-specific emissions data",
        "Transportation distance calculations",
        "Energy consumption analysis"
      ]
    },
    {
      icon: Database,
      title: "Material Database",
      description: "Comprehensive carbon coefficients for materials",
      items: [
        "Thousands of materials cataloged",
        "Region-specific carbon data",
        "Alternative material suggestions"
      ]
    },
    {
      icon: FileText,
      title: "Project Reporting",
      description: "Clear insights into your environmental impact",
      items: [
        "Sustainability score metrics",
        "Regulatory compliance tracking",
        "Exportable PDF reports"
      ]
    },
    {
      icon: FileCheck2,
      title: "Easy Integration",
      description: "Works with your existing workflows",
      items: [
        "Simple data import/export",
        "Works alongside existing software",
        "No workflow disruption"
      ]
    },
    {
      icon: BarChart3,
      title: "Benchmarking",
      description: "Compare your performance against industry standards",
      items: [
        "Industry-wide comparisons",
        "Project-to-project analysis",
        "Improvement recommendations"
      ]
    },
    {
      icon: GraduationCap,
      title: "Educational Resources",
      description: "Learn about sustainable construction practices",
      items: [
        "Video tutorials and guides",
        "Best practice documentation",
        "Regular sustainability updates"
      ]
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
    <section id="features" className="py-12 md:py-20 bg-gradient-to-b from-background to-carbon-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Sustainable Construction Made Simple</h2>
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
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description}
                items={feature.items}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
