
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Check, X } from "lucide-react";

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  
  const monthlyPrices = {
    starter: 199,
    professional: 449,
    enterprise: 899
  };
  
  const calculateAnnualPrice = (monthlyPrice: number) => {
    return Math.round(monthlyPrice * 12 * 0.8);
  };
  
  const plans = [
    {
      name: "Starter",
      price: annual ? calculateAnnualPrice(monthlyPrices.starter) : monthlyPrices.starter,
      description: "Best for small construction firms just beginning their sustainability journey in Australia.",
      features: [
        "Carbon footprint calculation",
        "Australian materials library",
        "Single user access",
        "PDF report generation",
        "Email support"
      ],
      notIncluded: [
        "Team collaboration",
        "API access",
        "Custom reporting",
        "Advanced analytics"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: annual ? calculateAnnualPrice(monthlyPrices.professional) : monthlyPrices.professional,
      description: "Perfect for growing Australian construction companies ready to measure and reduce their carbon impact.",
      features: [
        "Everything in Starter",
        "Up to 5 team members",
        "Extended Australian materials library",
        "Project comparison tools",
        "Custom reporting",
        "Priority support"
      ],
      notIncluded: [
        "Enterprise integrations",
        "White labeling"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: annual ? calculateAnnualPrice(monthlyPrices.enterprise) : monthlyPrices.enterprise,
      description: "Complete solution for large Australian construction firms with complex sustainability needs.",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "Full API access",
        "Custom integrations",
        "White labeling",
        "Dedicated support",
        "Australian compliance assistance",
        "Advanced analytics"
      ],
      notIncluded: [],
      cta: "Contact Sales",
      popular: false
    }
  ];

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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading">Transparent Pricing</h1>
            <p className="text-lg md:text-xl text-foreground/80 mb-10">
              Choose the plan that's right for your Australian construction business. All plans include our core carbon calculation engine.
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-12">
              <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-foreground/60'}`}>Annual</span>
              <Switch
                checked={!annual}
                onCheckedChange={() => setAnnual(!annual)}
                aria-label="Toggle billing cycle"
              />
              <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-foreground/60'}`}>Monthly</span>
              {annual && (
                <span className="ml-2 inline-block bg-carbon-100 text-carbon-800 text-xs font-medium py-1 px-2 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full flex flex-col ${plan.popular ? 'border-carbon-500 shadow-lg shadow-carbon-100/20' : ''}`}>
                  {plan.popular && (
                    <div className="bg-carbon-500 text-white text-center py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">A${plan.price}</span>
                      <span className="text-foreground/60 ml-2">/ {annual ? 'year' : 'month'}</span>
                    </div>
                    <p className="text-foreground/80 mt-3 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <h3 className="font-medium mb-3">Includes:</h3>
                    <ul className="space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check className="h-5 w-5 text-carbon-500 mr-2 shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.notIncluded.length > 0 && (
                      <>
                        <h3 className="font-medium mb-3 mt-6">Not included:</h3>
                        <ul className="space-y-2">
                          {plan.notIncluded.map((feature) => (
                            <li key={feature} className="flex items-start">
                              <X className="h-5 w-5 text-foreground/30 mr-2 shrink-0" />
                              <span className="text-sm text-foreground/60">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
          
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
            <Button size="lg">Contact Our Australian Sales Team</Button>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
