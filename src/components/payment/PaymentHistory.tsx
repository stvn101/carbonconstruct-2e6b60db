
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadPayments = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Set a timeout to prevent infinite loading
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      
      loadTimeoutRef.current = setTimeout(() => {
        setLoading(false);
        setError("Request timed out. Please try again.");
      }, 15000); // 15 seconds timeout
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      // Clear timeout on success
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
        
      if (error) throw error;
      
      // If no data returned, set empty array
      setPayments(data || []);
    } catch (err: any) {
      console.error("Error loading payments:", err);
      setError(err.message || "Failed to load payment history");
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
      // Ensure timeout is cleared
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    }
  };

  const verifyPayments = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true);
      
      // Set a timeout for verification
      const verifyTimeout = setTimeout(() => {
        setRefreshing(false);
        toast.error("Verification request timed out. Please try again later.");
      }, 15000); // 15 seconds timeout
      
      const { data, error } = await supabase.functions.invoke('verify-payment');
      
      // Clear timeout on success
      clearTimeout(verifyTimeout);
      
      if (error) throw error;
      
      if (data?.updated_payments?.length > 0) {
        toast.success(`${data.updated_payments.length} payment(s) updated`);
        loadPayments();
      } else {
        toast.info("No payment updates available");
      }
    } catch (err: any) {
      console.error("Error verifying payments:", err);
      toast.error("Failed to verify payments");
    } finally {
      setRefreshing(false);
    }
  };

  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  // Show a better fallback loading state
  if (loading && !refreshing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-carbon-600"></div>
            <span className="ml-3">Loading payment history...</span>
          </div>
          {/* Add a button to force refresh if loading takes too long */}
          <div className="flex justify-center mt-4">
            <Button 
              onClick={() => {
                setLoading(false);
                loadPayments();
              }} 
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Force Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Failed to load payment history</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadPayments}>Try Again</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment History</CardTitle>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={verifyPayments}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No payment records found.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="whitespace-nowrap">{formatDate(payment.created_at)}</TableCell>
                  <TableCell>{payment.description}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
