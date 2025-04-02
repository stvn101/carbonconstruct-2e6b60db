
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Building, CalendarDays, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const CTASection = () => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

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
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        
        toast({
          title: "Demo scheduled!",
          description: "We'll be in touch soon to confirm your appointment.",
        });
        
        // Reset form after 2 seconds of showing success state
        setTimeout(() => {
          setIsSubmitted(false);
          setFormState({
            name: "",
            email: "",
            company: "",
            phone: ""
          });
        }, 2000);
      }, 1500);
    }
  };

  return (
    <section id="demo" className="py-12 md:py-20 bg-carbon-600 text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build a Greener Future?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">
            Join construction companies across the world who are reducing their carbon footprint and meeting sustainability goals with CarbonConstruct.
          </p>
          <motion.div 
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {isSubmitted ? (
              <motion.div 
                className="py-10 text-center"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <motion.div 
                  className="mx-auto bg-green-500/20 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 15 }}
                >
                  <Check className="h-8 w-8 text-green-400" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">Demo Request Submitted!</h3>
                <p className="text-white/80">Thank you for your interest. Our team will contact you shortly.</p>
              </motion.div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="John Doe"
                      className={`w-full px-4 py-2 bg-white/20 border ${errors.name ? 'border-red-400' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                      value={formState.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <motion.p 
                        className="mt-1 text-xs text-red-300"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">Work Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      placeholder="john@construction.com"
                      className={`w-full px-4 py-2 bg-white/20 border ${errors.email ? 'border-red-400' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                      value={formState.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <motion.p 
                        className="mt-1 text-xs text-red-300"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                    <input 
                      type="text" 
                      id="company" 
                      placeholder="Construction Inc."
                      className={`w-full px-4 py-2 bg-white/20 border ${errors.company ? 'border-red-400' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                      value={formState.company}
                      onChange={handleChange}
                    />
                    {errors.company && (
                      <motion.p 
                        className="mt-1 text-xs text-red-300"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {errors.company}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      placeholder="(123) 456-7890"
                      className={`w-full px-4 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                      value={formState.phone}
                      onChange={handleChange}
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
                    className="w-full bg-white text-carbon-600 hover:bg-white/90 transition-all duration-300 relative overflow-hidden"
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
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-carbon-600" 
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
              </form>
            )}
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
            <div className="flex items-center justify-center">
              <Building className="h-5 w-5 mr-2 opacity-70" />
              <span>Used by 200+ construction companies</span>
            </div>
            <div className="flex items-center justify-center">
              <CalendarDays className="h-5 w-5 mr-2 opacity-70" />
              <span>Get started in less than 30 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
