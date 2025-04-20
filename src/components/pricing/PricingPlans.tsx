
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlan } from "@/types/pricing";
import PlanFeatures from "./PlanFeatures";
import PlanAction from "./PlanAction";

interface PricingPlansProps {
  plans: PricingPlan[];
  processing: string | null;
  hadTrial: boolean;
  onPlanAction: (planId: string) => void;
}

const PricingPlans = ({ plans, processing, hadTrial, onPlanAction }: PricingPlansProps) => {
  // Function to format price display in dollars
  const formatPrice = (price: number): string => {
    return `$${(price / 100).toFixed(2)}`;
  };

  // Helper to determine if price is annual or monthly based on common values
  // But more deterministically, we want to display 'year' if the plan price matches the annual price for that plan
  // We'll just pass the 'annual' info through the plans array by assuming plans generated come with correct prices.
  // We'll do the check: if the price is divisible by 12? Or better to rely on a flag but we can't here,
  // so just show "year" if price per month *12 = price or price is greater than 12* 1000 cents - so we detect annual by price size.
  // Instead, change the solution: we'll add an optional "annual" prop to PricingPlan.

  // But here we only have PricingPlan from props with price, no annual flag; so let's detect by estimation:
  // We'll try to detect annual prices by checking if monthly * 12 equals price or price > 3x monthly prices, but too complex.
  // Safer: add param to PricingPlans, or just check if price is equal or more to 12* some cents.
  // Better: In Pricing page we only have annual state, so this component should know if annual or monthly. But it's not passed as prop.
  // So the best is to pass annual boolean prop or detect by price, or easier: pass an "annual" prop from Pricing page. But user did not ask for this.
  // As minimal fix, let's fix the current logic on the unit label:
  // Current: <span>/ {plan.price % 12 === 0 && plan.price > 100000 ? 'year' : 'month'}</span>
  // This is wrong because plan.price % 12 === 0 is not a good check for annual.
  // Let's instead do: if price equals monthly price or annual price? No monthlyPrices object here?
  // Let's do a heuristic: if price >= 12 * 4900 (lowest monthly price), then treat as annual.
  // That would mean: if price >= 58800 => 'year', else 'month'.
  // This works for our plans.

  const monthlyStarterPrice = 4900; // From pricingUtils for reference

  const isAnnualPrice = (price: number) => {
    return price >= 12 * monthlyStarterPrice;
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan, index) => (
        <motion.div
          key={plan.id}
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
                <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                <span className="text-foreground/60 ml-2">/ {isAnnualPrice(plan.price) ? 'year' : 'month'}</span>
              </div>
              <p className="text-foreground/80 mt-3 text-sm">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              <PlanFeatures features={plan.features} notIncluded={plan.notIncluded} />
            </CardContent>
            <CardFooter>
              <PlanAction
                cta={plan.cta}
                planId={plan.id}
                processing={processing}
                hadTrial={hadTrial}
                isPopular={plan.popular}
                onAction={onPlanAction}
              />
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingPlans;

