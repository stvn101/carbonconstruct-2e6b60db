
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface PaymentSuccessProps {
  onClose?: () => void;
}

const PaymentSuccess = ({ onClose }: PaymentSuccessProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  useEffect(() => {
    const verifyPayment = async () => {
      if (!user) return;
      
      try {
        await supabase.functions.invoke('verify-payment');
      } catch (error) {
        console.error("Error verifying payment:", error);
      }
    };
    
    // Check if we're coming from a successful payment
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('payment') === 'success') {
      verifyPayment();
      toast.success("Payment successful! Thank you for your purchase.");
    }
  }, [user, location.search]);
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/dashboard");
    }
  };
  
  const handleViewHistory = () => {
    navigate("/dashboard?tab=payments");
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-2xl">Payment Successful</CardTitle>
        <CardDescription>
          Thank you for your purchase. Your payment has been processed successfully.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Your subscription will be activated shortly. You can now access premium features of CarbonConstruct.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={handleClose}>
          Continue to Dashboard
        </Button>
        <Button variant="outline" onClick={handleViewHistory}>
          View Payment History
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentSuccess;
