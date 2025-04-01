
import { Calculator, Database, FileText, GraduationCap, Leaf, LineChart, BarChart3, FileCheck2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, items }: { 
  icon: React.ComponentType<any>, 
  title: string, 
  description: string,
  items: string[] 
}) => {
  return (
    <motion.div
      whileHover={{ 
        y: -8,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-carbon-100 h-full overflow-hidden group hover:border-carbon-300 transition-colors duration-300">
        <CardHeader className="pb-2 relative">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100 group-hover:bg-carbon-200 transition-colors duration-300">
            <Icon className="h-5 w-5 text-carbon-700 group-hover:text-carbon-800 transition-all duration-300" />
          </div>
          <CardTitle className="group-hover:text-carbon-800 dark:group-hover:text-carbon-200 transition-colors duration-300">{title}</CardTitle>
          <CardDescription className="group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
            {description}
          </CardDescription>
          <motion.div 
            className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-carbon-100/20 to-transparent rounded-full -mt-10 -mr-10 opacity-0 group-hover:opacity-100" 
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
            {description}
          </p>
          <ul className="mt-4 space-y-2">
            {items.map((item, index) => (
              <motion.li 
                key={index}
                className="flex items-start"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="mr-2 mt-0.5 bg-carbon-100 rounded-full p-1 group-hover:bg-carbon-200 transition-colors duration-300"
                  whileHover={{ rotate: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Leaf className="h-3 w-3 text-carbon-500 group-hover:text-carbon-600 transition-colors duration-300" />
                </motion.div>
                <span className="text-sm group-hover:font-medium transition-all duration-300">{item}</span>
              </motion.li>
            ))}
          </ul>
          <motion.div
            className="mt-6 pt-4 border-t border-carbon-100 group-hover:border-carbon-200 transition-colors duration-300 opacity-0 group-hover:opacity-100"
            initial={{ y: 20 }}
            whileHover={{ y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="text-sm text-carbon-600 hover:text-carbon-800 font-medium inline-flex items-center dark:text-carbon-300 dark:hover:text-carbon-100 transition-colors duration-300">
              Learn more
              <svg className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

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
