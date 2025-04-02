
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CTAForm from "./CTAForm";
import CTASuccessMessage from "./CTASuccessMessage";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
}

const CTAContainer = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (formData: FormData) => {
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
      }, 2000);
    }, 1500);
  };

  return (
    <motion.div 
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-8"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <CTASuccessMessage />
        ) : (
          <CTAForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CTAContainer;
