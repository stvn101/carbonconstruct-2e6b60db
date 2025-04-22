
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { motion } from "framer-motion";

interface CTAFormProps {
  onSubmit: (formData: {
    name: string;
    email: string;
    company: string;
    phone: string;
  }) => void;
  isSubmitting: boolean;
}

const CTAForm = ({ onSubmit, isSubmitting }: CTAFormProps) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeField, setActiveField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formState.company.trim()) {
      newErrors.company = "Company name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormState(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleFocus = (id: string) => {
    setActiveField(id);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formState);
    }
  };

  return (
    <motion.form 
      className="space-y-4" 
      onSubmit={handleSubmit}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Full Name</label>
          <div className="relative">
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe"
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border ${
                errors.name ? 'border-red-400' : activeField === 'name' ? 'border-carbon-600 dark:border-carbon-400' : 'border-gray-300 dark:border-gray-600'
              } rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-500/50 transition-all duration-200`}
              value={formState.name}
              onChange={handleChange}
              onFocus={() => handleFocus('name')}
              onBlur={handleBlur}
              aria-label="Your full name"
            />
            {errors.name && (
              <motion.p 
                className="mt-1 text-xs text-red-500 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="bg-red-400/20 p-1 rounded-full mr-1">!</span>
                {errors.name}
              </motion.p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Work Email</label>
          <div className="relative">
            <input 
              type="email" 
              id="email" 
              placeholder="john@construction.com"
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border ${
                errors.email ? 'border-red-400' : activeField === 'email' ? 'border-carbon-600 dark:border-carbon-400' : 'border-gray-300 dark:border-gray-600'
              } rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-500/50 transition-all duration-200`}
              value={formState.email}
              onChange={handleChange}
              onFocus={() => handleFocus('email')}
              onBlur={handleBlur}
              aria-label="Your work email"
            />
            {errors.email && (
              <motion.p 
                className="mt-1 text-xs text-red-500 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="bg-red-400/20 p-1 rounded-full mr-1">!</span>
                {errors.email}
              </motion.p>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Company</label>
          <div className="relative">
            <input 
              type="text" 
              id="company" 
              placeholder="Construction Inc."
              className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border ${
                errors.company ? 'border-red-400' : activeField === 'company' ? 'border-carbon-600 dark:border-carbon-400' : 'border-gray-300 dark:border-gray-600'
              } rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-500/50 transition-all duration-200`}
              value={formState.company}
              onChange={handleChange}
              onFocus={() => handleFocus('company')}
              onBlur={handleBlur}
              aria-label="Your company name"
            />
            {errors.company && (
              <motion.p 
                className="mt-1 text-xs text-red-500 flex items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="bg-red-400/20 p-1 rounded-full mr-1">!</span>
                {errors.company}
              </motion.p>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-200">Phone Number <span className="text-xs text-gray-500">(Optional)</span></label>
          <input 
            type="tel" 
            id="phone" 
            placeholder="(123) 456-7890"
            className={`w-full px-4 py-2 bg-white dark:bg-gray-700 border ${
              activeField === 'phone' ? 'border-carbon-600 dark:border-carbon-400' : 'border-gray-300 dark:border-gray-600'
            } rounded-md text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-carbon-500/50 transition-all duration-200`}
            value={formState.phone}
            onChange={handleChange}
            onFocus={() => handleFocus('phone')}
            onBlur={handleBlur}
            aria-label="Your phone number (optional)"
          />
        </div>
      </div>
      <motion.div
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
      >
        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-carbon-600 text-white hover:bg-carbon-700 transition-all duration-300 relative overflow-hidden"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </motion.div>
          ) : "Schedule a Free Demo"}
        </Button>
      </motion.div>
      <div className="text-xs text-carbon-700 dark:text-carbon-200 text-center mt-2">
        By submitting this form, you agree to our <a href="#" className="underline hover:text-carbon-900 dark:hover:text-carbon-50">Terms & Privacy Policy</a>
      </div>
    </motion.form>
  );
};

export default CTAForm;
