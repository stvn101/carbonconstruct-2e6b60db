
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Stripe
const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')!;
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Get authorization header from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify the token and get the user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all pending payments for the user
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending');

    if (paymentsError) {
      return new Response(
        JSON.stringify({ error: "Error fetching payments" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const updatedPayments = [];

    // Check status of each payment with Stripe
    for (const payment of payments) {
      try {
        const session = await stripe.checkout.sessions.retrieve(payment.stripe_payment_id);
        
        let newStatus = payment.status;
        
        if (session.payment_status === 'paid') {
          newStatus = 'completed';
        } else if (session.status === 'expired' || session.status === 'canceled') {
          newStatus = 'failed';
        }
        
        // Only update if the status has changed
        if (newStatus !== payment.status) {
          const { data, error } = await supabase
            .from('payments')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', payment.id)
            .select()
            .single();
            
          if (error) {
            console.error("Error updating payment:", error);
          } else {
            updatedPayments.push(data);
            
            // If payment completed, update the user's subscription tier
            if (newStatus === 'completed') {
              // Try to get plan info from session metadata
              const planName = session.metadata?.plan_name;
              
              if (planName) {
                let subscriptionTier = 'free';
                
                if (planName === 'professional') {
                  subscriptionTier = 'premium';
                } else if (planName === 'enterprise') {
                  subscriptionTier = 'premium';
                }
                
                // Update user's profile with the new subscription tier
                await supabase
                  .from('profiles')
                  .update({ subscription_tier: subscriptionTier, had_trial: true })
                  .eq('id', user.id);
                  
                // Create notification about subscription upgrade
                await supabase
                  .from('notifications')
                  .insert({
                    user_id: user.id,
                    title: 'Subscription Updated',
                    message: `Your subscription has been upgraded to ${planName.charAt(0).toUpperCase() + planName.slice(1)}`,
                    type: 'success',
                    read: false,
                  });
              }
            }
          }
        }
      } catch (error) {
        console.error("Error checking payment status with Stripe:", error);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated_payments: updatedPayments,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
