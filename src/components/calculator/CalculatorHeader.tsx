
import { motion } from "framer-motion";

const CalculatorHeader = () => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-6 md:mb-12">
      <h1 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 text-foreground">
        Carbon Footprint Calculator
      </h1>
      <p className="text-sm md:text-lg text-muted-foreground mb-4 md:mb-8">
        Calculate the carbon emissions of your construction projects with our precise calculator
        that accounts for materials, transportation, and energy use.
      </p>
    </div>
  );
};

export default CalculatorHeader;
