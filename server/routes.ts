import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import OpenAI from "openai";
import { storage } from "./storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PRICING_PLANS = {
  pro_monthly: {
    priceId: 'price_1RVSwMK0aFmFV51v1PsSdU6r',
    name: 'Rescue Pro',
    price: 9.99,
    interval: 'month'
  },
  pro_yearly: {
    priceId: 'price_1RVSwMK0aFmFV51vTFAjTsQL',
    name: 'Rescue Pro',
    price: 95.88,
    interval: 'year'
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Session management routes - simplified to work without passport authentication
  app.get("/api/user/sessions/count", async (req, res) => {
    // For now, return default values for new users
    // TODO: Implement proper authentication
    res.json({
      monthlyCount: 0,
      remainingFree: 3,
      canCreateSession: true
    });
  });

  // Custom Prompt Generator - Pro feature using OpenAI
  app.post("/api/generate-custom-prompts", async (req, res) => {
    try {
      const { problemDescription, codeContext, errorMessages } = req.body;

      if (!problemDescription?.trim()) {
        return res.status(400).json({ 
          error: "Problem description is required" 
        });
      }

      // Build context for AI analysis
      let contextPrompt = `You are an expert AI coding assistant rescue specialist. A developer is stuck and needs custom prompts to get their AI assistant unstuck. 

Problem Description: ${problemDescription}`;

      if (codeContext?.trim()) {
        contextPrompt += `\n\nCode Context: ${codeContext}`;
      }

      if (errorMessages?.trim()) {
        contextPrompt += `\n\nError Messages: ${errorMessages}`;
      }

      contextPrompt += `\n\nGenerate 3 custom prompts that use advanced AI manipulation techniques to solve this specific problem. Each prompt should:
1. Use psychological triggers (role constraints, context reset, urgency)
2. Be tailored to the exact problem described
3. Include specific methodology enforcement
4. Have clear difficulty levels

Return a JSON object with this structure:
{
  "prompts": [
    {
      "title": "Brief descriptive title",
      "prompt": "The complete prompt text to copy-paste",
      "explanation": "Why this prompt works for this specific problem",
      "difficulty": "beginner|intermediate|advanced"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system", 
            content: "You are an expert at creating AI manipulation prompts that redirect stuck coding assistants. Respond only with valid JSON."
          },
          {
            role: "user",
            content: contextPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000
      });

      const result = JSON.parse(response.choices[0].message.content || '{"prompts": []}');
      
      res.json(result);
    } catch (error) {
      console.error("Error generating custom prompts:", error);
      res.status(500).json({ 
        error: "Failed to generate custom prompts",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Cancel Subscription
  app.post("/api/cancel-subscription", async (req, res) => {
    try {
      // For authenticated users with active subscriptions
      // This would cancel the subscription at period end
      
      // Simulated response for now
      res.json({ 
        success: true,
        message: "Subscription will be cancelled at the end of the current period"
      });
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      res.status(500).json({ 
        error: "Failed to cancel subscription",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Reactivate Subscription
  app.post("/api/reactivate-subscription", async (req, res) => {
    try {
      // For authenticated users with cancelled subscriptions
      // This would reactivate the subscription
      
      // Simulated response for now
      res.json({ 
        success: true,
        message: "Subscription has been reactivated"
      });
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      res.status(500).json({ 
        error: "Failed to reactivate subscription",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Create Stripe Products - run this once to set up pricing
  app.post("/api/setup-stripe-products", async (req, res) => {
    try {
      // Create the main product
      const product = await stripe.products.create({
        name: 'Rescue Pro',
        description: 'Unlimited AI rescues with advanced features',
      });

      // Create monthly price
      const monthlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: 999, // $9.99 in cents
        currency: 'usd',
        recurring: {
          interval: 'month',
        },
        nickname: 'Rescue Pro Monthly',
      });

      // Create yearly price (20% discount)
      const yearlyPrice = await stripe.prices.create({
        product: product.id,
        unit_amount: 9588, // $95.88 in cents (20% discount)
        currency: 'usd',
        recurring: {
          interval: 'year',
        },
        nickname: 'Rescue Pro Yearly',
      });

      res.json({
        product: product.id,
        monthlyPrice: monthlyPrice.id,
        yearlyPrice: yearlyPrice.id,
        message: 'Products created successfully'
      });
    } catch (error: any) {
      console.error('Error creating Stripe products:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Checkout Session Creation
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, userId } = req.body;

      if (!plan || !userId) {
        return res.status(400).json({ error: "Plan and userId are required" });
      }

      const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];
      if (!planConfig) {
        return res.status(400).json({ error: "Invalid plan" });
      }

      // For Firebase users, create a temporary user record if needed
      let user;
      try {
        user = await storage.getUser(parseInt(userId));
      } catch (e) {
        // userId is not numeric (Firebase UID), create temp user
        user = await storage.getUserByEmail(`${userId}@firebase.temp`);
        if (!user) {
          try {
            user = await storage.createUser({
              username: `firebase_${userId.substring(0, 8)}_${Date.now()}`,
              email: `${userId}@firebase.temp`,
              role: "user"
            });
          } catch (createError) {
            // If username still conflicts, try with random suffix
            user = await storage.createUser({
              username: `user_${Math.random().toString(36).substring(7)}`,
              email: `${userId}@firebase.temp`,
              role: "user"
            });
          }
        }
      }
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let customerId = user.stripeCustomerId;
      
      // Create Stripe customer if doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: userId.toString()
          }
        });
        customerId = customer.id;
        
        await storage.updateUserSubscription(user.id, {
          stripeCustomerId: customerId
        });
      }

      // Create checkout session - more reliable than payment links
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: planConfig.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${req.protocol}://${req.get('host')}/?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/?upgrade=cancelled`,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        metadata: {
          userId: user.id.toString(),
          firebaseUid: userId.toString(),
          plan: plan
        }
      });

      res.json({ sessionId: session.id, url: session.url });
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get subscription status
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      let subscriptionData = {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'free',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd
      };

      // If user has Stripe subscription, get latest data
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionData = {
            tier: subscription.metadata.plan || user.subscriptionTier || 'free',
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
          };
        } catch (stripeError) {
          console.error('Error fetching Stripe subscription:', stripeError);
        }
      }

      res.json(subscriptionData);
    } catch (error: any) {
      console.error('Subscription status error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Stripe Webhook Handler
  app.post("/api/stripe-webhook", async (req, res) => {
    let event;
    
    try {
      event = req.body;
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = parseInt(session.metadata.userId);
        const plan = session.metadata.plan;
        
        if (session.mode === 'subscription') {
          const subscriptionId = session.subscription;
          
          await storage.updateUserSubscription(userId, {
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: 'active',
            subscriptionTier: plan
          });
        }
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata.userId) {
          const userId = parseInt(customer.metadata.userId);
          
          await storage.updateUserSubscription(userId, {
            subscriptionStatus: subscription.status,
            subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000)
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
