
import { PlanPrices, PricingPlan } from "@/types/pricing";

// Define monthly prices in cents
export const monthlyPrices: PlanPrices = {
  starter: 4900, // $49.00
  professional: 9900, // $99.00
  enterprise: 24900 // $249.00
};

// Calculate annual price with discount
export const calculateAnnualPrice = (monthlyPrice: number, planId: string) => {
  const annualBase = monthlyPrice * 12;
  // Starter plan gets no discount
  if (planId === 'starter') {
    return annualBase; // $588.00 annually
  }
  // Professional and Enterprise get 15% discount
  return Math.round(annualBase * 0.85); // 15% discount
};

// Generate pricing plans based on billing cycle
export const generatePricingPlans = (annual: boolean): PricingPlan[] => {
  return [
    {
      id: "starter",
      name: "Starter",
      price: annual ? calculateAnnualPrice(monthlyPrices.starter, 'starter') : monthlyPrices.starter,
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
      price: annual ? calculateAnnualPrice(monthlyPrices.professional, 'professional') : monthlyPrices.professional,
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
      price: annual ? calculateAnnualPrice(monthlyPrices.enterprise, 'enterprise') : monthlyPrices.enterprise,
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
};

