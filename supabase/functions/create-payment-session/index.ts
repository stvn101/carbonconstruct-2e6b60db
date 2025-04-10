
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    // Parse request body
    const { planName, action, purchaseType } = await req.json();
    
    // Basic validation
    if (!planName || !action) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine amount based on plan name
    let amount = 0;
    let period = ''; 
    let description = '';

    if (action === 'trial') {
      // Set up a free trial
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        return new Response(
          JSON.stringify({ error: "Error fetching profile" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if user already had a trial
      if (profile.had_trial) {
        return new Response(
          JSON.stringify({ error: "You have already used your free trial" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update user profile to mark them as in trial and set expiration
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3); // 3-day trial

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'premium',
          had_trial: true,
          trial_end_date: trialEndDate.toISOString(),
        })
        .eq('id', user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to start trial" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create a notification about the trial
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: `3-Day Trial Started`,
          message: `Your 3-day free trial of the Premium plan has begun. Enjoy all premium features until ${trialEndDate.toLocaleDateString()}.`,
          type: 'info',
          read: false,
        });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Trial activated successfully",
          trialEndDate: trialEndDate.toISOString(),
          subscription_tier: 'premium'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (action === 'subscribe') {
      // Determine amount based on plan
      if (planName === 'starter') {
        amount = purchaseType === 'monthly' ? 199 : 1912; // ~20% discount for annual
        period = purchaseType === 'monthly' ? 'month' : 'year';
        description = purchaseType === 'monthly' ? 'Starter Plan - Monthly' : 'Starter Plan - Annual';
      } else if (planName === 'professional') {
        amount = purchaseType === 'monthly' ? 449 : 4310; // ~20% discount for annual
        period = purchaseType === 'monthly' ? 'month' : 'year';
        description = purchaseType === 'monthly' ? 'Professional Plan - Monthly' : 'Professional Plan - Annual';
      } else if (planName === 'enterprise') {
        amount = purchaseType === 'monthly' ? 899 : 8630; // ~20% discount for annual
        period = purchaseType === 'monthly' ? 'month' : 'year';
        description = purchaseType === 'monthly' ? 'Enterprise Plan - Monthly' : 'Enterprise Plan - Annual';
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid plan selected" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Insert a payment record for demonstration
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          amount: amount,
          status: 'pending',
          description: description,
          plan: planName,
          period: period
        })
        .select()
        .single();

      if (paymentError) {
        return new Response(
          JSON.stringify({ error: "Failed to create payment record" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create a notification about the payment
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: `Payment Initiated for ${planName}`,
          message: `Your payment of A$${(amount/100).toFixed(2)} for the ${description} has been initiated.`,
          type: 'info',
          read: false,
        });

      // In a full implementation, this would create a Stripe checkout session
      // For this demo, we'll simulate a successful payment and update the user profile
      
      // Update user's subscription tier
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          subscription_tier: 'premium',
        })
        .eq('id', user.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: "Failed to update subscription" }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // For demo purposes, also mark the payment as completed
      await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('id', payment.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Payment processed successfully",
          subscription_tier: 'premium',
          payment: {
            id: payment.id,
            amount: payment.amount,
            description: payment.description,
            status: 'completed'
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
