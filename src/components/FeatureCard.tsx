
import { Leaf, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

interface FeatureCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  items: string[];
  explanationContent?: string;
}

const FeatureCard = ({ icon: Icon, title, description, items, explanationContent }: FeatureCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLearnMoreClick = () => {
    setIsDialogOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ 
          y: -8,
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.2 }}
        className="h-full" // Ensure motion div is full height
      >
        <Card className="border-carbon-100 h-full flex flex-col overflow-hidden group hover:border-carbon-300 transition-colors duration-300 bg-white dark:bg-gray-800 min-h-[450px]">
          <CardHeader className="pb-2 relative">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-carbon-100 group-hover:bg-carbon-200 transition-colors duration-300">
              <Icon className="h-5 w-5 text-carbon-700 group-hover:text-carbon-800 transition-all duration-300" />
            </div>
            <CardTitle className="group-hover:text-carbon-800 dark:group-hover:text-carbon-200 transition-colors duration-300">{title}</CardTitle>
            <CardDescription className="group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
              {description}
            </CardDescription>
            <motion.div 
              className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-carbon-100 to-transparent rounded-full -mt-10 -mr-10 opacity-0 group-hover:opacity-0" 
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <p className="text-sm text-muted-foreground group-hover:text-carbon-700 dark:group-hover:text-carbon-300 transition-colors duration-300">
              {description}
            </p>
            <ul className="mt-4 space-y-2 flex-1">
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
              className="mt-6 pt-4 border-t border-carbon-100 group-hover:border-carbon-200 transition-colors duration-300"
              initial={{ y: 20 }}
              whileHover={{ y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button 
                className="text-sm text-carbon-600 hover:text-carbon-800 font-medium inline-flex items-center dark:text-carbon-300 dark:hover:text-carbon-100 transition-colors duration-300"
                onClick={handleLearnMoreClick}
              >
                Learn more
                <Info className="w-4 h-4 ml-1 group-hover:ml-2 transition-all duration-300" />
              </button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border border-carbon-100 dark:border-carbon-700">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <h3 className="font-semibold">Key Benefits</h3>
            <ul className="list-disc pl-5 space-y-2">
              {items.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
            {explanationContent && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">How It Works</h3>
                <p className="text-sm text-muted-foreground">{explanationContent}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeatureCard;
