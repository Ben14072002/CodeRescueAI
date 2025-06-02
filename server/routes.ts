import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16",
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
  // Session management routes
  app.get("/api/user/sessions/count", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const sessionsThisMonth = await storage.getUserSessionsThisMonth(req.user.id);
      const remainingFree = Math.max(0, 3 - sessionsThisMonth.length);
      
      res.json({
        monthlyCount: sessionsThisMonth.length,
        remainingFree: remainingFree,
        canCreateSession: req.user.subscriptionTier === 'pro' || sessionsThisMonth.length < 3
      });
    } catch (error) {
      console.error("Error fetching session count:", error);
      res.status(500).json({ error: "Failed to fetch session count" });
    }
  });

  app.post("/api/sessions", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      // Check if user can create more sessions
      const sessionsThisMonth = await storage.getUserSessionsThisMonth(req.user.id);
      if (req.user.subscriptionTier !== 'pro' && sessionsThisMonth.length >= 3) {
        return res.status(403).json({ 
          error: "Monthly session limit reached",
          remainingFree: 0
        });
      }

      const sessionData = {
        ...req.body,
        userId: req.user.id,
        startTime: new Date()
      };

      const newSession = await storage.createSession(sessionData);
      res.json(newSession);
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
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

      const user = await storage.getUser(userId);
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
        
        await storage.updateUserSubscription(userId, {
          stripeCustomerId: customerId
        });
      }

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
        success_url: `${req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/pricing`,
        metadata: {
          userId: userId.toString(),
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
