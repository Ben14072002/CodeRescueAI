import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "../storage";

// Use live Stripe key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: "2023-10-16" as any,
});

const PRICING_PLANS = {
  pro_monthly: {
    priceId: 'price_1RYjUZK0aFmFV51vgRokbSRm',
    name: 'Rescue Pro',
    price: 4.99,
    interval: 'month'
  },
  pro_yearly: {
    priceId: 'price_1RYjUZK0aFmFV51vqZP19L2k',
    name: 'Rescue Pro',
    price: 47.88,
    interval: 'year'
  }
};

// Input validation schemas
const validateCreateCheckoutSession = (req: any, res: any, next: any) => {
  const { plan, userId } = req.body;
  
  if (!plan || !userId) {
    return res.status(400).json({ error: "Plan and user ID are required" });
  }
  
  if (!['pro_monthly', 'pro_yearly'].includes(plan)) {
    return res.status(400).json({ error: "Invalid plan selected" });
  }
  
  if (typeof userId !== 'string' || userId.length < 1) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  next();
};

const validateTrialSession = (req: any, res: any, next: any) => {
  const { userId, email } = req.body;
  
  if (!userId || !email) {
    return res.status(400).json({ error: "User ID and email are required" });
  }
  
  if (typeof userId !== 'string' || userId.length < 1) {
    return res.status(400).json({ error: "Invalid user ID" });
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }
  
  next();
};

export function registerSubscriptionRoutes(app: Express) {
  // Stripe regular checkout session creation (for paid subscriptions)
  app.post("/api/create-checkout-session", validateCreateCheckoutSession, async (req, res) => {
    try {
      const { plan, userId } = req.body;

      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate plan
      const planConfig = PRICING_PLANS[plan as keyof typeof PRICING_PLANS];
      if (!planConfig) {
        return res.status(400).json({ error: "Invalid plan selected" });
      }

      // Create Stripe checkout session for regular subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        line_items: [{
          price: planConfig.priceId,
          quantity: 1,
        }],
        metadata: {
          userId: userId,
          plan: plan,
          signupType: 'subscription'
        },
        success_url: `${req.headers.origin || 'https://localhost:5000'}/?upgrade=success`,
        cancel_url: `${req.headers.origin || 'https://localhost:5000'}/pricing?upgrade=cancelled`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error('Error creating checkout session:', {
        error: error.message,
        userId: req.body.userId,
        plan: req.body.plan
      });
      res.status(500).json({ 
        error: 'Failed to create checkout session',
        code: 'CHECKOUT_SESSION_ERROR'
      });
    }
  });

  // Create trial session with Stripe checkout
  app.post("/api/create-trial-session", async (req, res) => {
    try {
      const { userId, feature } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Find or create user
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check trial eligibility
      const eligibility = await storage.isTrialEligible(user.id);
      if (!eligibility.eligible) {
        return res.status(400).json({ error: `Trial not available: ${eligibility.reason}` });
      }

      // Create Stripe checkout session with trial
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: user.email,
        line_items: [{
          price: PRICING_PLANS.pro_monthly.priceId,
          quantity: 1,
        }],
        subscription_data: {
          trial_period_days: 3,
          metadata: {
            userId: userId,
            signupType: 'trial',
            feature: feature || 'general'
          }
        },
        metadata: {
          userId: userId,
          signupType: 'trial',
          feature: feature || 'general'
        },
        success_url: `${req.headers.origin || 'https://localhost:5000'}/?upgrade=success`,
        cancel_url: `${req.headers.origin || 'https://localhost:5000'}/pricing?upgrade=cancelled`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating trial session:', error);
      res.status(500).json({ error: 'Failed to create trial session' });
    }
  });

  // Stripe trial checkout session creation
  app.post("/api/create-trial-checkout-session", validateTrialSession, async (req, res) => {
    try {
      const { userId, email, feature } = req.body;

      // Create Stripe checkout session for trial signup
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: email,
        line_items: [{
          price: PRICING_PLANS.pro_monthly.priceId,
          quantity: 1,
        }],
        subscription_data: {
          trial_period_days: 3,
          metadata: {
            userId: userId,
            feature: feature || 'trial',
            signupType: 'trial'
          }
        },
        metadata: {
          userId: userId,
          feature: feature || 'trial',
          signupType: 'trial'
        },
        success_url: `${req.headers.origin}/?trial=success&uid=${userId}`,
        cancel_url: `${req.headers.origin}/?trial=cancelled`,
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating trial checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Stripe setup intent for trial payment method collection
  app.post("/api/create-trial-setup-intent", async (req, res) => {
    try {
      const { userId, email, name } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email are required" });
      }

      // Create or get Stripe customer
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      let customer;
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: email,
          name: name || email,
          metadata: { userId: userId }
        });
      }

      // Create setup intent for payment method collection
      const setupIntent = await stripe.setupIntents.create({
        customer: customer.id,
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
          userId: userId,
          purpose: 'trial_signup'
        }
      });

      res.json({ clientSecret: setupIntent.client_secret });
    } catch (error) {
      console.error('Error creating setup intent:', error);
      res.status(500).json({ error: 'Failed to create setup intent' });
    }
  });

  // Complete trial setup after payment method collection
  app.post("/api/complete-trial-setup", async (req, res) => {
    try {
      const { setupIntentId, userId } = req.body;

      if (!setupIntentId || !userId) {
        return res.status(400).json({ error: "Setup intent ID and user ID are required" });
      }

      // Retrieve setup intent to get customer and payment method
      const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);
      
      if (setupIntent.status !== 'succeeded') {
        return res.status(400).json({ error: "Setup intent not completed" });
      }

      // Find or create user
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        user = await storage.createUser({
          username: `user_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
      }

      // Check trial eligibility
      const eligibility = await storage.isTrialEligible(user.id);
      if (!eligibility.eligible) {
        return res.status(400).json({ error: `Trial not available: ${eligibility.reason}` });
      }

      // Create subscription with trial
      const customerId = typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id;
      const paymentMethodId = typeof setupIntent.payment_method === 'string' ? setupIntent.payment_method : setupIntent.payment_method?.id;
      
      if (!customerId) {
        throw new Error('No customer ID found in setup intent');
      }

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: PRICING_PLANS.pro_monthly.priceId,
        }],
        trial_period_days: 3,
        default_payment_method: paymentMethodId || undefined,
        metadata: {
          userId: userId,
          signupType: 'trial'
        }
      });

      // Activate trial
      await storage.startTrial(user.id);
      
      // Update subscription info
      await storage.updateUserSubscription(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: 'trialing',
        subscriptionTier: 'trial'
      });

      console.log(`Trial activated for user ${userId}`);
      res.json({ success: true, message: "Trial activated successfully" });
    } catch (error) {
      console.error('Error completing trial setup:', error);
      res.status(500).json({ error: 'Failed to complete trial setup' });
    }
  });

  // Manual trial activation endpoint (for testing/emergency use)
  app.post("/api/start-trial", async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Find user by Firebase UID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check trial eligibility
      const eligibility = await storage.isTrialEligible(user.id);
      if (!eligibility.eligible) {
        return res.status(400).json({ error: `Trial not available: ${eligibility.reason}` });
      }

      // Activate trial
      const updatedUser = await storage.startTrial(user.id);
      
      console.log(`✅ Manual trial activated for user ${userId} (ID: ${user.id})`);
      res.json({ 
        success: true, 
        message: "Trial activated successfully",
        user: updatedUser
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      res.status(500).json({ error: 'Failed to start trial' });
    }
  });

  // URGENT: Manual Pro activation endpoint for paid users
  app.post("/api/activate-pro", async (req, res) => {
    try {
      const { userId, plan = 'pro_monthly' } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Find user by Firebase UID or create if doesn't exist
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      // If user doesn't exist, create them immediately
      if (!user) {
        console.log(`Creating new user for Pro activation: ${userId}`);
        user = await storage.createUser({
          username: `user_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          firebaseUid: userId,
          role: "user",
          subscriptionStatus: 'active',
          subscriptionTier: plan
        });
      } else {
        // Update existing user to Pro
        user = await storage.updateUserSubscription(user.id, {
          subscriptionStatus: 'active',
          subscriptionTier: plan,
          subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }
      
      console.log(`🔥 URGENT: Manual Pro activation completed for user ${userId} (ID: ${user.id})`);
      res.json({ 
        success: true, 
        message: "Pro subscription activated successfully",
        user: {
          id: user.id,
          subscriptionStatus: user.subscriptionStatus,
          subscriptionTier: user.subscriptionTier
        },
        plan: plan
      });
    } catch (error) {
      console.error('Error activating Pro:', error);
      res.status(500).json({ error: `Failed to activate Pro subscription: ${error.message}` });
    }
  });
}