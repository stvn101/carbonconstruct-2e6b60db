
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const CalculatorError = () => {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorHeader />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Calculator Error</h3>
            <p className="mt-2 text-red-700 dark:text-red-400">
              There was a problem loading the calculator. Please refresh the page or contact support if the issue persists.
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CalculatorError;
