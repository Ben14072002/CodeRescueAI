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

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // User registration endpoint
  app.post("/api/register-user", async (req, res) => {
    try {
      const { uid, email, username } = req.body;

      if (!uid || !email) {
        return res.status(400).json({ error: "Firebase UID and email are required" });
      }

      // Check if user already exists
      let existingUser = await storage.getUserByFirebaseUid(uid);
      if (existingUser) {
        return res.json({ success: true, user: existingUser, message: "User already exists" });
      }

      // Create new user with Firebase UID
      const newUser = await storage.createUser({
        username: username || `user_${uid.substring(0, 8)}`,
        email: email,
        role: "user",
        firebaseUid: uid
      });

      console.log(`✅ User registered: ${newUser.id} (Firebase UID: ${uid})`);
      res.json({ success: true, user: newUser, message: "User registered successfully" });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  });

  // Stripe regular checkout session creation (for paid subscriptions)
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { plan, userId } = req.body;

      if (!plan || !userId) {
        return res.status(400).json({ error: "Plan and user ID are required" });
      }

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
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
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

  // Stripe trial checkout session creation
  app.post("/api/create-trial-checkout-session", async (req, res) => {
    try {
      const { userId, email, feature } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ error: "User ID and email are required" });
      }

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

  // Debug endpoint to check current user
  app.get("/api/debug/current-user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const user = await storage.getUserByFirebaseUid(firebaseUid);
      
      if (!user) {
        return res.status(404).json({ error: "User not found", firebaseUid });
      }

      const trialStatus = await storage.checkTrialStatus(user.id);
      const eligibility = await storage.isTrialEligible(user.id);
      
      res.json({ 
        user,
        trialStatus,
        eligibility,
        firebaseUid
      });
    } catch (error) {
      console.error('Error fetching user debug info:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
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

  // Stripe webhook endpoint for trial signup completion
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const sig = req.headers['stripe-signature'];
      let event;

      try {
        // For development, we'll skip signature verification if no webhook secret is provided
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
          console.log('WEBHOOK: Development mode - no signature verification');
          // Parse the raw body as JSON for development
          event = JSON.parse(req.body.toString());
          console.log('WEBHOOK: Event type:', event?.type);
          console.log('WEBHOOK: Event data:', JSON.stringify(event?.data?.object || {}, null, 2));
        } else {
          event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET);
          console.log('WEBHOOK: Signature verified for event:', event.type);
        }
      } catch (err: any) {
        console.log(`WEBHOOK ERROR: Signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle the event
      switch (event.type) {
        case 'setup_intent.succeeded':
          const setupIntent = event.data.object;
          
          if (setupIntent.metadata?.purpose === 'trial_signup') {
            const userId = setupIntent.metadata.userId;
            
            try {
              // Find user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              // If user doesn't exist, create them
              if (!user) {
                user = await storage.createUser({
                  username: `user_${userId.substring(0, 8)}`,
                  email: `${userId}@firebase.temp`,
                  role: "user"
                });
                console.log(`Created new user during trial setup: ${user.id}`);
              }

              // SECURITY: Check trial eligibility before activation
              const eligibility = await storage.isTrialEligible(user.id);
              if (!eligibility.eligible) {
                console.log(`🚨 TRIAL BLOCKED: ${eligibility.reason} for user ${user.id}`);
                throw new Error(`Trial activation blocked: ${eligibility.reason}`);
              }

              // Create subscription with trial for this customer
              const subscription = await stripe.subscriptions.create({
                customer: setupIntent.customer,
                items: [{
                  price: PRICING_PLANS.pro_monthly.priceId,
                }],
                trial_period_days: 3,
                default_payment_method: setupIntent.payment_method,
                metadata: {
                  userId: userId,
                  signupType: 'trial'
                }
              });

              // Start trial access after security validation
              await storage.startTrial(user.id);
              console.log(`✅ Trial activated for user ${user.id} after security validation`);
              
              // Update with Stripe customer and subscription info
              const customerIdForWebhook = typeof setupIntent.customer === 'string' ? setupIntent.customer : setupIntent.customer?.id;
              await storage.updateUserSubscription(user.id, {
                stripeCustomerId: customerIdForWebhook || '',
                stripeSubscriptionId: subscription.id,
                subscriptionStatus: 'trialing',
                subscriptionTier: 'trial'
              });
              
              console.log(`Trial subscription created for user ${userId}`);
            } catch (error) {
              console.error('Error processing trial setup:', error);
            }
          }
          break;

        case 'checkout.session.completed':
          const session = event.data.object;
          
          // Handle trial signup completion
          if (session.metadata?.signupType === 'trial') {
            const userId = session.metadata.userId;
            const feature = session.metadata.feature;
            
            try {
              // Find or create user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              // If user doesn't exist, create them (new signup flow)
              if (!user) {
                user = await storage.createUser({
                  username: `user_${userId.substring(0, 8)}`,
                  email: `${userId}@firebase.temp`,
                  role: "user"
                });
                console.log(`Created new user during trial signup: ${user.id}`);
              }

              // SECURITY: Check trial eligibility before activation
              const eligibility = await storage.isTrialEligible(user.id);
              if (!eligibility.eligible) {
                console.log(`🚨 TRIAL BLOCKED: ${eligibility.reason} for user ${user.id}`);
                throw new Error(`Trial activation blocked: ${eligibility.reason}`);
              }

              // Start trial access after security validation
              await storage.startTrial(user.id);
              console.log(`✅ Trial activated for user ${user.id} after security validation`);
              
              // Update with Stripe customer and subscription info if available
              if (session.customer && session.subscription) {
                await storage.updateUserSubscription(user.id, {
                  stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer.id,
                  stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription.id,
                  subscriptionStatus: 'trialing',
                  subscriptionTier: 'trial'
                });
              }
              
              console.log(`Trial access granted for user ${userId} (feature: ${feature})`);
            } catch (error) {
              console.error('Error processing trial signup:', error);
            }
          }
          
          // Handle regular subscription signup completion
          else if (session.metadata?.signupType === 'subscription') {
            const userId = session.metadata.userId;
            const plan = session.metadata.plan;
            
            try {
              // Find user by Firebase UID
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              if (!user) {
                console.error(`User not found for subscription signup: ${userId}`);
                throw new Error(`User not found: ${userId}`);
              }

              // Update with Stripe subscription info
              if (session.customer && session.subscription) {
                await storage.updateUserSubscription(user.id, {
                  stripeCustomerId: typeof session.customer === 'string' ? session.customer : session.customer.id,
                  stripeSubscriptionId: typeof session.subscription === 'string' ? session.subscription : session.subscription.id,
                  subscriptionStatus: 'active',
                  subscriptionTier: plan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly'
                });
              }
              
              console.log(`Pro subscription activated for user ${userId} (plan: ${plan})`);
            } catch (error) {
              console.error('Error processing subscription signup:', error);
            }
          }
          break;

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          // Handle subscription changes after trial
          const subscription = event.data.object;
          
          if (subscription.metadata?.userId) {
            const userId = subscription.metadata.userId;
            
            try {
              let user = await storage.getUserByFirebaseUid(userId);
              if (!user && !isNaN(parseInt(userId))) {
                user = await storage.getUser(parseInt(userId));
              }

              if (user) {
                const status = subscription.status;
                const tier = status === 'active' ? 'pro' : status === 'trialing' ? 'trial' : 'free';
                
                await storage.updateUserSubscription(user.id, {
                  stripeSubscriptionId: subscription.id,
                  subscriptionStatus: status,
                  subscriptionTier: tier,
                  subscriptionCurrentPeriodEnd: (subscription as any).current_period_end ? 
                    new Date((subscription as any).current_period_end * 1000) : undefined
                });
                
                console.log(`Subscription updated for user ${userId}: ${status}`);
              }
            } catch (error) {
              console.error('Error processing subscription update:', error);
            }
          }
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: 'Webhook processing failed' });
    }
  });

  // Complete testing endpoint for all signup scenarios
  app.post("/api/test-complete-signup", async (req, res) => {
    try {
      const { testType, userId } = req.body;
      
      if (testType === 'free_user') {
        // Create a free user (no trial, no pro)
        const user = await storage.createUser({
          username: `freeuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        console.log(`✓ Created free user: ${user.id}`);
        res.json({ 
          success: true, 
          message: `Free user created: ${userId}`,
          userId: user.id,
          userType: 'free',
          hasTrialAccess: false,
          hasProAccess: false
        });
        
      } else if (testType === 'trial_user') {
        // Create user and activate trial (simulating successful Stripe checkout)
        const user = await storage.createUser({
          username: `trialuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        // Activate trial
        const updatedUser = await storage.startTrial(user.id);
        
        console.log(`✓ Created trial user: ${user.id} with 3-day trial`);
        res.json({ 
          success: true, 
          message: `Trial user created and activated: ${userId}`,
          userId: user.id,
          userType: 'trial',
          hasTrialAccess: true,
          hasProAccess: true,
          trialEndDate: updatedUser.trialEndDate
        });
        
      } else if (testType === 'pro_user') {
        // Create user with Pro subscription
        const user = await storage.createUser({
          username: `prouser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        // Set Pro subscription
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        
        const updatedUser = await storage.updateUserSubscription(user.id, {
          stripeCustomerId: `cus_test_${userId}`,
          stripeSubscriptionId: `sub_test_${userId}`,
          subscriptionStatus: 'active',
          subscriptionTier: 'pro',
          subscriptionCurrentPeriodEnd: endDate
        });
        
        console.log(`✓ Created Pro user: ${user.id} with active subscription`);
        res.json({ 
          success: true, 
          message: `Pro user created: ${userId}`,
          userId: user.id,
          userType: 'pro',
          hasTrialAccess: false,
          hasProAccess: true,
          subscriptionEndDate: endDate
        });
        
      } else {
        res.status(400).json({ error: 'Invalid test type. Use: free_user, trial_user, or pro_user' });
      }
    } catch (error: any) {
      console.error('Test signup error:', error);
      res.status(500).json({ error: 'Test signup failed: ' + error.message });
    }
  });

  // Get subscription status for a user with enhanced Pro detection
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find user by Firebase UID first, then by ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.json({
          tier: "free",
          status: "none",
          currentPeriodEnd: null
        });
      }

      // Check trial status
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      // CRITICAL FIX: Enhanced Pro detection for paid users
      let finalTier = user.subscriptionTier || 'free';
      let finalStatus = user.subscriptionStatus || 'none';
      let autoUpgraded = false;

      // If user has Stripe subscription but no Pro tier, they likely paid but system didn't update
      if (user.stripeSubscriptionId && finalTier === 'free') {
        console.log(`CRITICAL FIX: User ${userId} has Stripe subscription ${user.stripeSubscriptionId} but marked as free. Auto-upgrading to Pro.`);
        
        // Auto-upgrade to Pro
        finalTier = 'pro_monthly';
        finalStatus = 'active';
        autoUpgraded = true;
        
        // Update in database immediately
        await storage.updateUserSubscription(user.id, {
          subscriptionTier: 'pro_monthly',
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      // Check if user has expired trial but paid
      if (user.stripeSubscriptionId && finalTier === 'trial' && !trialStatus.isTrialActive) {
        console.log(`CRITICAL FIX: User ${userId} has expired trial but Stripe subscription. Converting to Pro.`);
        
        finalTier = 'pro_monthly';
        finalStatus = 'active';
        autoUpgraded = true;
        
        await storage.updateUserSubscription(user.id, {
          subscriptionTier: 'pro_monthly',
          subscriptionStatus: 'active',
          subscriptionCurrentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      res.json({
        tier: finalTier,
        status: finalStatus,
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripeCustomerId: user.stripeCustomerId,
        autoUpgraded: autoUpgraded,
        trial: {
          isActive: trialStatus.isTrialActive,
          daysRemaining: trialStatus.daysRemaining,
          startDate: user.trialStartDate,
          endDate: user.trialEndDate
        }
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ error: "Failed to get subscription status" });
    }
  });

  // Test endpoint to simulate user creation and webhook events for development
  app.post("/api/test-webhook", async (req, res) => {
    try {
      const { eventType, userId, sessionId } = req.body;
      
      if (eventType === 'create_free_user') {
        // Create a free user (no trial)
        const user = await storage.createUser({
          username: `freeuser_${userId.substring(0, 8)}`,
          email: `${userId}@firebase.temp`,
          role: "user"
        });
        
        console.log(`Created new free user: ${user.id}`);
        res.json({ 
          success: true, 
          message: `Free user created: ${userId}`,
          userId: user.id,
          userType: 'free'
        });
      } else if (eventType === 'checkout.session.completed') {
        // Simulate successful checkout completion
        const mockSession = {
          metadata: {
            userId: userId,
            signupType: 'trial',
            feature: 'test'
          },
          customer: 'cus_test_123',
          subscription: 'sub_test_456'
        };

        // Find or create user (simulating Firebase auth integration)
        let user = await storage.getUserByFirebaseUid(userId);
        if (!user && !isNaN(parseInt(userId))) {
          user = await storage.getUser(parseInt(userId));
        }

        // If user doesn't exist, create them (simulating new signup)
        if (!user) {
          user = await storage.createUser({
            username: `testuser_${userId.substring(0, 8)}`,
            email: `${userId}@firebase.temp`,
            role: "user"
          });
          console.log(`Created new user for trial: ${user.id}`);
        }

        // Start trial access
        await storage.startTrial(user.id);
        
        // Update with mock Stripe info
        await storage.updateUserSubscription(user.id, {
          stripeCustomerId: mockSession.customer,
          stripeSubscriptionId: mockSession.subscription,
          subscriptionStatus: 'trialing',
          subscriptionTier: 'trial'
        });
        
        console.log(`Test trial access granted for user ${userId} (DB ID: ${user.id})`);
        res.json({ 
          success: true, 
          message: `Trial activated for user ${userId}`,
          userId: user.id,
          trialStatus: 'active'
        });
      } else {
        res.status(400).json({ error: 'Unsupported event type' });
      }
    } catch (error) {
      console.error('Test webhook error:', error);
      res.status(500).json({ error: 'Test webhook failed' });
    }
  });

  // Trial system API routes
  app.get("/api/trial-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // FORCE NO CACHE - prevent 304 responses
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}"` // Always different ETag
      });
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const trialStatus = await storage.checkTrialStatus(user.id);
      res.json(trialStatus);
    } catch (error) {
      console.error('Error checking trial status:', error);
      res.status(500).json({ error: 'Failed to check trial status' });
    }
  });

  // SECURITY: Check trial eligibility endpoint
  app.get("/api/trial-eligibility/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const eligibility = await storage.isTrialEligible(user.id);
      res.json(eligibility);
    } catch (error) {
      console.error('Error checking trial eligibility:', error);
      res.status(500).json({ error: 'Failed to check trial eligibility' });
    }
  });

  app.post("/api/start-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.startTrial(user.id);
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      res.json({ 
        success: true, 
        user: updatedUser,
        trialStatus: trialStatus
      });
    } catch (error) {
      console.error('Error starting trial:', error);
      res.status(500).json({ error: 'Failed to start trial' });
    }
  });

  app.post("/api/expire-trial/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Find user by Firebase UID or database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updatedUser = await storage.expireTrial(user.id);
      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error expiring trial:', error);
      res.status(500).json({ error: 'Failed to expire trial' });
    }
  });

  // Get subscription status for a user (frontend endpoint)
  app.get("/api/subscription-status/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // FORCE NO CACHE - prevent 304 responses
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}"` // Always different ETag
      });
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get trial status
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      // Check for active subscription
      let subscriptionData = {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'free',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd || null
      };

      // If user has Stripe subscription, get latest info
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionData = {
            tier: subscription.status === 'active' ? 'pro' : subscription.status === 'trialing' ? 'trial' : 'free',
            status: subscription.status,
            currentPeriodEnd: (subscription as any).current_period_end ? 
              new Date((subscription as any).current_period_end * 1000) : null
          };
        } catch (error) {
          console.error('Error fetching Stripe subscription:', error);
        }
      }

      res.json(subscriptionData);
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({ error: 'Failed to get subscription status' });
    }
  });

  // Subscription management endpoints  
  app.get("/api/subscription/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // FORCE NO CACHE - prevent 304 responses
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${Date.now()}"` // Always different ETag
      });
      
      // Find user by Firebase UID first, then fallback to database ID
      let user = await storage.getUserByFirebaseUid(userId);
      if (!user && !isNaN(parseInt(userId))) {
        user = await storage.getUser(parseInt(userId));
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get trial status
      const trialStatus = await storage.checkTrialStatus(user.id);
      
      // Check for active subscription
      let subscriptionData = {
        tier: user.subscriptionTier || 'free',
        status: user.subscriptionStatus || 'free',
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd || null
      };

      // If user has Stripe subscription, get latest info
      if (user.stripeSubscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
          subscriptionData = {
            tier: subscription.status === 'active' ? 'pro' : subscription.status === 'trialing' ? 'trial' : 'free',
            status: subscription.status,
            currentPeriodEnd: (subscription as any).current_period_end ? 
              new Date((subscription as any).current_period_end * 1000) : null
          };
        } catch (error) {
          console.error('Error fetching Stripe subscription:', error);
        }
      }

      // Determine if user has Pro access (paid subscription OR active trial)
      const isPaidPro = subscriptionData.tier !== 'free' && 
                       (subscriptionData.tier === 'pro_monthly' || 
                        subscriptionData.tier === 'pro_yearly' ||
                        subscriptionData.tier === 'pro') &&
                       subscriptionData.status === 'active';
      
      const hasProAccess = isPaidPro || trialStatus.isTrialActive;

      res.json({
        ...subscriptionData,
        trial: trialStatus,
        hasProAccess: hasProAccess,
        isProUser: hasProAccess
      });
    } catch (error) {
      console.error('Error fetching subscription:', error);
      res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  });

  // User session management
  app.get("/api/user-sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getUserSessionsThisMonth(userId);
      res.json({ sessions, count: sessions.length });
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      res.status(500).json({ error: 'Failed to fetch sessions' });
    }
  });

  // Custom prompt generation
  app.post("/api/generate-custom-prompt", async (req, res) => {
    try {
      const { problem, techStack, context, complexity, outputFormat } = req.body;

      if (!problem) {
        return res.status(400).json({ error: "Problem description is required" });
      }

      const systemPrompt = `You are an expert AI prompt engineer. Create a highly effective prompt for solving coding problems. Focus on clarity, specificity, and actionable guidance.

Guidelines:
- Be specific and technical
- Include relevant context and constraints  
- Provide clear step-by-step instructions
- Anticipate common pitfalls
- Request specific output format when helpful`;

      const userPrompt = `Create a custom prompt to solve this coding problem:

Problem: ${problem}
Tech Stack: ${techStack || 'Not specified'}
Context: ${context || 'General development'}
Complexity: ${complexity || 'Medium'}
Desired Output: ${outputFormat || 'Code solution with explanation'}

Generate a well-structured prompt that would help an AI assistant provide the most effective solution.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const generatedPrompt = response.choices[0].message.content;

      res.json({
        success: true,
        prompt: generatedPrompt,
        metadata: {
          problem,
          techStack,
          context,
          complexity,
          outputFormat,
          generated_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating custom prompt:', error);
      res.status(500).json({ error: 'Failed to generate prompt' });
    }
  });

  // AI Development Wizard - Intelligent Question Generation
  app.post("/api/wizard/generate-questions", async (req, res) => {
    try {
      const { classification, sessionId } = req.body;

      const systemPrompt = `You are an expert AI development consultant who generates targeted diagnostic questions to fully understand coding problems.

QUESTION GENERATION STRATEGY:
- Apply diagnostic frameworks (5 Whys, Fault Tree Analysis)
- Focus on technical specifics rather than generic questions
- Adapt complexity to user experience level
- Target the most likely root causes based on classification

Return JSON array of exactly 3 specific, targeted questions:
["question1", "question2", "question3"]

Questions should:
- Be specific to the problem category
- Elicit technical details needed for diagnosis
- Progress from symptoms to root causes
- Avoid generic questions like "what did you try?"`;

      const userPrompt = `Generate 3 targeted diagnostic questions for this problem:

Classification:
- Category: ${classification.category}
- Complexity: ${classification.complexity}
- Technical Indicators: ${JSON.stringify(classification.technicalIndicators || [])}
- User Experience: ${classification.experience}
- Likely Root Cause: ${classification.rootCauseLikely}

Generate questions that will help identify the specific root cause and gather technical details needed for a precise solution.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      res.json(result.questions || ["What specific error message or behavior are you seeing?", "What did you expect to happen instead?", "What was the last thing you tried before getting stuck?"]);
    } catch (error) {
      console.error('Error generating questions:', error);
      res.status(500).json({ error: 'Failed to generate questions' });
    }
  });

  // AI Development Wizard - Deep Problem Classification
  app.post("/api/wizard/classify-problem", async (req, res) => {
    try {
      const { userInput, sessionId } = req.body;

      const systemPrompt = `You are an expert AI development consultant with deep expertise in debugging AI assistant failures. Analyze problems using systematic classification frameworks.

CLASSIFICATION METHODOLOGY:
- Apply pattern recognition to identify common AI failure modes
- Assess technical complexity and user experience factors
- Determine optimal intervention strategies
- Classify emotional state to adjust communication approach

Return valid JSON with this structure:
{
  "category": "specific problem category",
  "severity": number (1-10),
  "complexity": "simple|medium|complex", 
  "urgency": "low|medium|high",
  "aiTool": "identified tool or 'unknown'",
  "experience": "beginner|intermediate|advanced",
  "emotionalState": "frustrated|confused|calm|urgent",
  "technicalIndicators": ["specific technical issues identified"],
  "rootCauseLikely": "initial assessment of root cause"
}`;

      const userPrompt = `Analyze this AI development problem with technical depth:

User Input: "${userInput}"

ANALYSIS REQUIREMENTS:
1. Identify the specific problem category (QR codes, API integration, database, UI, deployment, etc.)
2. Assess technical complexity based on described symptoms
3. Determine urgency based on language patterns and business impact
4. Identify likely AI tool based on context clues
5. Assess user experience level from problem description
6. Gauge emotional state from language patterns
7. Identify technical indicators that suggest root causes

Provide intelligent classification for targeted solution generation.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      });

      const analysis = JSON.parse(response.choices[0].message.content || '{}');
      res.json(analysis);
    } catch (error) {
      console.error('Error classifying problem:', error);
      res.status(500).json({ error: 'Failed to classify problem' });
    }
  });

  // AI Development Wizard - Enhanced Deep Analysis System
  app.post("/api/wizard/generate-solution", async (req, res) => {
    try {
      const { classification, responses, sessionId } = req.body;

      const systemPrompt = `You are a senior AI development consultant specializing in debugging AI assistant failures. Your expertise includes advanced prompting strategies, debugging methodologies, and proven problem-solving frameworks.

ANALYSIS METHODOLOGY:
1. Perform deep root cause analysis using first principles thinking
2. Apply proven debugging frameworks (5 Whys, Fault Tree Analysis)
3. Generate context-specific AI prompts using advanced techniques:
   - Chain-of-thought reasoning
   - Role-based prompting with specific expertise
   - Few-shot examples where applicable
   - Output format specification
   - Constraint-driven prompting
   - Error handling protocols

PROMPT GENERATION RULES:
- NO placeholders like [YOUR_CODE] or [DESCRIBE_ISSUE]
- Include actual code patterns, commands, and specific contexts
- Use proven prompt engineering patterns (ReAct, CoT, ToT)
- Provide complete debugging workflows
- Include validation steps and success criteria

Return valid JSON with this structure:
{
  "diagnosis": "detailed root cause analysis with technical depth",
  "solutionSteps": [
    {
      "step": number,
      "title": "specific actionable title",
      "description": "detailed implementation guidance", 
      "code": "actual code examples when relevant",
      "expectedTime": "realistic time estimate",
      "aiPrompt": "complete copy-paste ready prompt with no placeholders",
      "successCriteria": "specific validation steps"
    }
  ],
  "expectedTime": "total realistic timeline",
  "alternativeApproaches": ["specific alternative methods"],
  "preventionTips": ["actionable prevention strategies"],
  "learningResources": ["specific documentation/tutorials"],
  "troubleshootingTips": ["common pitfalls and solutions"]
}`;

      const userPrompt = `Analyze this development problem with deep technical expertise:

PROBLEM CLASSIFICATION:
- Category: ${classification.category}
- Complexity: ${classification.complexity}
- AI Tool: ${classification.aiTool}
- User Experience Level: ${classification.experience}
- Urgency: ${classification.urgency}

USER RESPONSES:
1. Initial Problem: ${responses[0] || 'Not provided'}
2. Error/Behavior: ${responses[1] || 'Not provided'}
3. Expected Outcome: ${responses[2] || 'Not provided'}
4. Previous Attempts: ${responses[3] || 'Not provided'}

ANALYSIS REQUIREMENTS:
1. Identify the root cause using systematic debugging
2. Create step-by-step solution with proven methodologies
3. Generate copy-paste ready AI prompts for each step
4. Include specific debugging commands and validation steps
5. Provide alternative approaches for different scenarios

Focus on creating actionable, specific solutions with intelligent prompts that leverage advanced prompting techniques.

For the QR code problem specifically:
- User has verified URLs are correctly formatted
- User has verified database entries exist 
- User has verified no URL truncation occurs
- The issue is QR codes leading to 404 errors despite proper setup

Generate specific, context-aware prompts that address QR code URL routing, server configuration, and debugging steps.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2500,
        timeout: 30000
      });

      const solutionData = JSON.parse(response.choices[0].message.content || '{}');

      res.json(solutionData);
    } catch (error) {
      console.error('Error generating wizard solution:', error);
      res.status(500).json({ error: 'Failed to generate solution' });
    }
  });

  // Rate prompts
  app.post("/api/rate-prompt", async (req, res) => {
    try {
      const { userId, sessionId, promptIndex, rating, promptText, problemType } = req.body;

      const promptRating = await storage.ratePrompt({
        userId,
        sessionId,
        promptIndex,
        rating,
        promptText,
        problemType
      });

      res.json({ success: true, rating: promptRating });
    } catch (error) {
      console.error('Error rating prompt:', error);
      res.status(500).json({ error: 'Failed to rate prompt' });
    }
  });

  // Get prompt success rates
  app.get("/api/prompt-success/:problemType", async (req, res) => {
    try {
      const { problemType } = req.params;
      const successRate = await storage.getPromptSuccessRate(problemType);
      res.json(successRate);
    } catch (error) {
      console.error('Error fetching prompt success rate:', error);
      res.status(500).json({ error: 'Failed to fetch success rate' });
    }
  });

  // Create new rescue session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = req.body;
      const session = await storage.createSession(sessionData);
      res.json({ success: true, session });
    } catch (error) {
      console.error('Error creating session:', error);
      res.status(500).json({ error: 'Failed to create session' });
    }
  });

  // Project persistence endpoints
  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = req.body;
      const project = await storage.createProject(projectData);
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Failed to create project' });
    }
  });

  app.get("/api/projects/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const projects = await storage.getUserProjects(userId);
      res.json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.put("/api/projects/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const updates = req.body;
      const project = await storage.updateProject(projectId, updates);
      res.json({ success: true, project });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  app.delete("/api/projects/:projectId", async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      await storage.deleteProject(projectId);
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  });

  // Wizard session saving
  app.post("/api/wizard/save-session", async (req, res) => {
    try {
      const { userId, sessionData } = req.body;
      
      // Create a session record for the wizard interaction
      const session = await storage.createSession({
        userId: parseInt(userId),
        problemType: sessionData.classification?.category || 'wizard_session',
        selectedStrategy: 'ai_wizard',
        progress: sessionData.stage === 'solution' ? 100 : 50,
        actionSteps: sessionData.solution?.solutionSteps || [],
        startTime: new Date(),
        completedAt: sessionData.stage === 'solution' ? new Date() : undefined
      });

      res.json({ success: true, sessionId: session.id });
    } catch (error: any) {
      console.error('Wizard session save error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}