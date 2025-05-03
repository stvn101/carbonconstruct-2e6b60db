
import { useAuth } from "@/contexts/auth";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionStatus = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  
  const isPremium = profile?.subscription_tier === 'premium';
  
  return (
    <Card className={`w-full ${isPremium ? 'border-green-500 dark:border-green-700' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Subscription Status
          {isPremium && (
            <Badge className="ml-2 bg-green-600">Premium</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
          {isPremium 
            ? "You're on a Premium plan with access to all features."
            : "You're currently on the Free plan with limited features."}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <h4 className="font-medium mb-2">Your access includes:</h4>
            <ul className="space-y-1 text-sm">
              <li>• Carbon footprint calculation</li>
              <li>• Basic material database</li>
              {isPremium && (
                <>
                  <li>• Extended materials library</li>
                  <li>• Advanced analytics</li>
                  <li>• Team collaboration</li>
                  <li>• Priority support</li>
                </>
              )}
            </ul>
          </div>
          
          {!isPremium && (
            <div>
              <h4 className="font-medium mb-2">Upgrade to get:</h4>
              <ul className="space-y-1 text-sm opacity-70">
                <li>• Extended materials library</li>
                <li>• Advanced analytics</li>
                <li>• Team collaboration</li>
                <li>• Priority support</li>
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isPremium ? (
          <Button variant="outline" className="ml-auto" onClick={() => navigate("/dashboard?tab=payments")}>
            View Payment History
          </Button>
        ) : (
          <Button onClick={() => navigate("/pricing")} className="ml-auto">
            Upgrade Now <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SubscriptionStatus;
