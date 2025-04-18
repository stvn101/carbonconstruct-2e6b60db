import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import BillingToggle from "@/components/pricing/BillingToggle";
import PricingPlans from "@/components/pricing/PricingPlans";
import { PlanPrices, PricingPlan } from "@/types/pricing";

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const monthlyPrices: PlanPrices = {
    starter: 200,
    professional: 500,
    enterprise: 1000
  };
  
  const calculateAnnualPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8);
  };
  
  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: annual ? calculateAnnualPrice(monthlyPrices.starter) : monthlyPrices.starter,
      description: "Best for small construction firms just beginning their sustainability journey in Australia.",
      features: [
        "Carbon footprint calculation",
        "Australian materials library",
        "Single user access",
        "Basic PDF reports",
        "Email support response within 48h"
      ],
      notIncluded: [
        "Team collaboration",
        "API access",
        "Custom reporting",
        "Advanced analytics",
        "Priority support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: annual ? calculateAnnualPrice(monthlyPrices.professional) : monthlyPrices.professional,
      description: "Perfect for growing Australian construction companies ready to measure and reduce their carbon impact.",
      features: [
        "Everything in Starter",
        "Up to 5 team members",
        "Extended materials library",
        "Project comparison tools",
        "Custom reporting",
        "Priority support (24h)",
        "Monthly sustainability insights"
      ],
      notIncluded: [
        "Enterprise integrations",
        "White labeling",
        "Dedicated account manager"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: annual ? calculateAnnualPrice(monthlyPrices.enterprise) : monthlyPrices.enterprise,
      description: "Complete solution for large Australian construction firms with complex sustainability needs.",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Full API access",
        "Custom integrations",
        "White labeling options",
        "Dedicated account manager",
        "24/7 priority support",
        "Australian compliance assistance",
        "Advanced analytics dashboard",
        "Custom training sessions"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const handlePlanAction = async (planId: string) => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/pricing' } });
      return;
    }

    if (profile?.subscription_tier === 'premium') {
      toast.info("You already have a premium subscription.");
      return;
    }

    setProcessing(planId);
    
    try {
      if (planId === 'enterprise') {
        navigate('/contact', { state: { subject: 'Enterprise Plan Inquiry' } });
        return;
      }
      
      if (planId === 'professional') {
        const { data, error } = await supabase.functions.invoke('create-payment-session', {
          body: {
            planName: planId,
            action: 'trial'
          }
        });

        if (error) {
          throw new Error(error.message);
        }

        if (data.success) {
          toast.success("Your 3-day free trial has been activated!");
          navigate('/dashboard');
          return;
        }
        
        if (data.error && data.error.includes("already used your free trial")) {
          toast.info("You've already used your trial. Processing payment...");
        }
      }

      const { data, error } = await supabase.functions.invoke('create-payment-session', {
        body: {
          planName: planId,
          purchaseType: annual ? 'annual' : 'monthly',
          action: 'subscribe'
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.success) {
        toast.success("Payment processed successfully!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("There was an issue processing your request. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">
              Transparent Pricing
            </h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10">
              Choose the plan that's right for your Australian construction business. All plans include our core carbon calculation engine.
            </p>
            
            <BillingToggle annual={annual} onChange={setAnnual} />
          </motion.div>

          <PricingPlans 
            plans={plans}
            processing={processing}
            hadTrial={!!profile?.had_trial}
            onPlanAction={handlePlanAction}
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-foreground/80 mb-6">
              We offer tailored packages for Australian enterprises with specific requirements. Our team will work with you to create a solution that meets your unique needs and complies with Australian standards.
            </p>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
