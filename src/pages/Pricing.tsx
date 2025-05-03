
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import PricingHeader from "@/components/pricing/PricingHeader";
import PricingPlans from "@/components/pricing/PricingPlans";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import { generatePricingPlans } from "@/utils/pricingUtils";

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const plans = generatePricingPlans(annual);

  useEffect(() => {
    // Check if we're coming back from a successful payment
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('payment') === 'success') {
      setShowPaymentSuccess(true);
    }
  }, [location.search]);

  const handlePlanAction = async (planId: string) => {
    if (!user) {
      navigate('/auth', { state: { returnTo: '/pricing' } });
      return;
    }

    if (profile?.subscription_tier === 'premium' && planId !== 'enterprise') {
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

        if (data.success && !data.url) {
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

      if (data.success && data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else if (data.success) {
        toast.success("Payment processed successfully!");
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "There was an issue processing your request. Please try again.");
    } finally {
      setProcessing(null);
    }
  };

  if (showPaymentSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 px-4">
          <PaymentSuccess onClose={() => navigate('/dashboard', { replace: true })} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="py-16 md:py-24 container mx-auto px-4">
          <PricingHeader annual={annual} onBillingChange={setAnnual} />

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
