
export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  notIncluded: string[];
  cta: string;
  popular: boolean;
}

export interface PlanPrices {
  starter: number;
  professional: number;
  enterprise: number;
}
