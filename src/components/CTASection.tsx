
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Building, CalendarDays, Check, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

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
  const [activeField, setActiveField] = useState<string | null>(null);
  const { toast } = useToast();

  // Track CTA view for analytics
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Track CTA section view in Facebook Pixel
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('trackCustom', 'CTASectionView');
          }
          
          // Track CTA section view in Google Analytics
          if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'view_promotion', {
              promotion_name: 'demo_cta'
            });
          }
          
          // Disconnect once tracked
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });
    
    const ctaSection = document.getElementById('demo');
    if (ctaSection) observer.observe(ctaSection);
    
    return () => {
      observer.disconnect();
    };
  }, []);

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

  const handleFocus = (id: string) => {
    setActiveField(id);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Track form submission in Facebook Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'demo_request',
          content_category: 'demo'
        });
      }
      
      // Track form submission in Google Analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          event_category: 'engagement',
          event_label: 'demo_form'
        });
      }
      
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
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div 
                  className="py-10 text-center"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  key="success"
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
                  <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center justify-center space-x-2 text-sm bg-white/10 p-3 rounded-lg">
                      <Info className="h-4 w-4 text-blue-300" />
                      <p>We've sent a confirmation to your email</p>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.form 
                  className="space-y-4" 
                  onSubmit={handleSubmit}
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="name" 
                          placeholder="John Doe"
                          className={`w-full px-4 py-2 bg-white/20 border ${errors.name ? 'border-red-400' : activeField === 'name' ? 'border-white' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                          value={formState.name}
                          onChange={handleChange}
                          onFocus={() => handleFocus('name')}
                          onBlur={handleBlur}
                        />
                        {errors.name && (
                          <motion.p 
                            className="mt-1 text-xs text-red-300 flex items-center"
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
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Work Email</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          id="email" 
                          placeholder="john@construction.com"
                          className={`w-full px-4 py-2 bg-white/20 border ${errors.email ? 'border-red-400' : activeField === 'email' ? 'border-white' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                          value={formState.email}
                          onChange={handleChange}
                          onFocus={() => handleFocus('email')}
                          onBlur={handleBlur}
                        />
                        {errors.email && (
                          <motion.p 
                            className="mt-1 text-xs text-red-300 flex items-center"
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
                      <label htmlFor="company" className="block text-sm font-medium mb-1">Company</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          id="company" 
                          placeholder="Construction Inc."
                          className={`w-full px-4 py-2 bg-white/20 border ${errors.company ? 'border-red-400' : activeField === 'company' ? 'border-white' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                          value={formState.company}
                          onChange={handleChange}
                          onFocus={() => handleFocus('company')}
                          onBlur={handleBlur}
                        />
                        {errors.company && (
                          <motion.p 
                            className="mt-1 text-xs text-red-300 flex items-center"
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
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number <span className="text-xs text-white/50">(Optional)</span></label>
                      <input 
                        type="tel" 
                        id="phone" 
                        placeholder="(123) 456-7890"
                        className={`w-full px-4 py-2 bg-white/20 border ${activeField === 'phone' ? 'border-white' : 'border-white/30'} rounded-md text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200`}
                        value={formState.phone}
                        onChange={handleChange}
                        onFocus={() => handleFocus('phone')}
                        onBlur={handleBlur}
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
                  <div className="text-xs text-white/60 text-center mt-2">
                    By submitting this form, you agree to our <a href="#" className="underline hover:text-white">Terms & Privacy Policy</a>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center gap-6 text-sm">
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Building className="h-5 w-5 mr-2 opacity-70" />
              <span>Used by 200+ construction companies</span>
            </motion.div>
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <CalendarDays className="h-5 w-5 mr-2 opacity-70" />
              <span>Get started in less than 30 minutes</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
