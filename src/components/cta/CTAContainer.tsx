
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import CTAForm from "./CTAForm";
import CTASuccessMessage from "./CTASuccessMessage";
import { sendEmail } from "@/utils/email/emailService";

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

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    try {
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
      
      // Format email content for admin notification
      const adminHtml = `
        <h2>New Demo Request</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Company:</strong> ${formData.company || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
      `;
      
      // Send notification to admin
      await sendEmail({
        to: 'contact@stvn.carbonconstruct.net',
        subject: `New Demo Request: ${formData.name} from ${formData.company || 'Individual'}`,
        html: adminHtml
      });
      
      // Send confirmation to user
      await sendEmail({
        to: formData.email,
        subject: 'Your CarbonConstruct Demo Request',
        html: `
          <h2>Thank you for requesting a CarbonConstruct demo!</h2>
          <p>Hello ${formData.name},</p>
          <p>We've received your demo request and will be in touch shortly to schedule a time that works for you.</p>
          <p>In the meantime, you might be interested in:</p>
          <ul>
            <li><a href="https://carbonconstruct.net/case-studies">Case studies</a> from builders like you</li>
            <li><a href="https://carbonconstruct.net/resources">Educational resources</a> about reducing project emissions</li>
          </ul>
          <p>If you have any questions before your demo, please reply to this email.</p>
          <p>Best regards,<br>The CarbonConstruct Team</p>
        `
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Demo scheduled!",
        description: "We'll be in touch soon to confirm your appointment.",
      });
      
      // Reset form after 5 seconds of showing success state
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting demo request:', error);
      setIsSubmitting(false);
      
      toast({
        title: "Error scheduling demo",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    }
  };

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 mb-8 shadow-md"
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
