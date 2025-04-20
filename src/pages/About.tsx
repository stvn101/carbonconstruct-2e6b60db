
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import NavbarLogo from "@/components/navbar/NavbarLogo";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center max-w-3xl mx-auto mb-16 gap-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading flex items-center gap-3">
              Our Mission
              <NavbarLogo />
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 max-w-xl text-center">
              At CarbonConstruct, we're committed to transforming the construction industry by providing innovative solutions that measure, reduce, and report carbon emissions throughout the building lifecycle.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-foreground/80 mb-4">
                  Founded in 2025 by Steven Jenkins, a carpenter with over 17 years in construction, CarbonConstruct was born from a clear need: the industry lacked simple tools to track and reduce its carbon footprint, making sustainability accessible for builders.
                </p>
                <p className="text-foreground/80 mb-4">
                  Starting as a carbon calculator, it has grown into a robust platform to help builders meet sustainability goals and regulatory demands. Led by its founder, CarbonConstruct is scaling, engaging leaders like Master Builders Queensland, with builders and suppliers soon testing, aiming for 50+ projects in Australia to shape a sustainable future.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
                <p className="text-foreground/80 mb-4">
                  We envision a future where every construction project—from small residential builds to large commercial developments—is meticulously designed, built, and operated with its carbon impact as a primary consideration, ensuring sustainability is at the heart of every decision. By making carbon data accessible, actionable, and seamlessly integrated into standard workflows, we aim to empower the industry to significantly reduce its environmental impact while maintaining profitability and achieving project goals. Our platform provides builders with the tools to track, analyze, and optimize their carbon footprint in real time, fostering a balance between ecological responsibility and economic success. Through partnerships with industry leaders like Master Builders Queensland, we are committed to scaling this vision across Australia, targeting over 50 projects to drive meaningful change.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
