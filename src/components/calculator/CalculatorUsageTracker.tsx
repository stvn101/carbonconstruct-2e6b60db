
import { useCallback } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

interface CalculatorUsageTrackerProps {
  onComplete: () => void;
  demoMode?: boolean;
  isPremiumUser?: boolean;
}

const CalculatorUsageTracker = ({ onComplete, demoMode, isPremiumUser = false }: CalculatorUsageTrackerProps) => {
  const { user } = useAuth();

  const recordCalculatorUsage = useCallback(async () => {
    try {
      if (user && !demoMode) {
        const { error } = await supabase
          .from('calculator_usage')
          .insert({ 
            user_id: user.id,
            ip_address: null,
            is_premium: isPremiumUser
          });

        if (error) {
          console.error('Failed to record calculator usage:', error);
        }
      }
    } catch (error) {
      console.error('Error recording calculator usage:', error);
    } finally {
      onComplete();
    }
  }, [user, demoMode, isPremiumUser, onComplete]);

  return null;
};

export default CalculatorUsageTracker;
