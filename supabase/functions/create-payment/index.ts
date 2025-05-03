
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

    // Parse request body
    const { planName, amount, purchaseType, description } = await req.json();
    
    // Basic validation
    if (!planName || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already has a Stripe customer ID
    let { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
    }
    
    let customerId = profiles?.stripe_customer_id;
    
    // Create or retrieve Stripe customer
    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_metadata?.full_name || '',
        metadata: {
          user_id: user.id
        },
      });
      
      customerId = customer.id;
      
      // Update profile with Stripe customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Determine if this is a one-time payment or subscription
    const isSubscription = purchaseType === 'monthly' || purchaseType === 'annual';
    
    let session;
    
    if (isSubscription) {
      // Create a subscription checkout session
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: `CarbonConstruct ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan`,
                description: `${purchaseType === 'annual' ? 'Annual' : 'Monthly'} subscription`,
              },
              unit_amount: amount, // amount in cents
              recurring: {
                interval: purchaseType === 'annual' ? 'year' : 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
        cancel_url: `${req.headers.get('origin')}/pricing?payment=canceled`,
        metadata: {
          user_id: user.id,
          plan_name: planName,
          purchase_type: purchaseType
        }
      });
    } else {
      // Create a one-time payment checkout session
      session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: `CarbonConstruct ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan`,
                description: description || `One-time payment for ${planName} plan`,
              },
              unit_amount: amount, // amount in cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/dashboard?payment=success`,
        cancel_url: `${req.headers.get('origin')}/pricing?payment=canceled`,
        metadata: {
          user_id: user.id,
          plan_name: planName
        }
      });
    }

    // Insert payment record in the database
    const paymentData = {
      user_id: user.id,
      amount: amount / 100, // Convert cents to dollars for storage
      status: 'pending',
      description: description || `Payment for ${planName} plan`,
      stripe_payment_id: session.id,
    };

    const { data: payment, error: dbError } = await supabase
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to create payment record" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a notification about the payment
    const notificationData = {
      user_id: user.id,
      title: `Payment Initiated for ${planName.charAt(0).toUpperCase() + planName.slice(1)} Plan`,
      message: `Your payment of $${(amount / 100).toFixed(2)} for ${planName} plan has been initiated.`,
      type: 'info',
      read: false,
    };

    await supabase
      .from('notifications')
      .insert(notificationData);

    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
        payment: {
          id: payment.id,
          amount: payment.amount,
          status: payment.status,
          created_at: payment.created_at
        }
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
